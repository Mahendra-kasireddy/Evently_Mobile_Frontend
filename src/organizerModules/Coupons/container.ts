import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { COUPONS_COPY as COPY } from './constants';
import { useCouponUsage, useMyCoupons } from './hooks';
import { createCoupon, setCouponStatus } from './services';
import type {
  CouponCardModel,
  CouponDiscountType,
  CouponDTO,
  CouponForm,
  CouponFormErrors,
  CouponsSummary,
  CouponStatusDTO,
  UsageRowModel,
} from './types';
import {
  emptyForm,
  errorMessage,
  isFormDirty,
  mapCoupons,
  mapUsage,
  summarize,
  toTermsBody,
  validateForm,
} from './utils';

/** Refetch whenever the screen comes back into view; the first focus is the mount. */
function useRefetchOnFocus(refetch: () => void) {
  const seen = useRef(false);
  const ref = useRef(refetch);
  ref.current = refetch;
  useFocusEffect(
    useCallback(() => {
      if (seen.current) ref.current();
      seen.current = true;
    }, []),
  );
}

/** A copy of `map` without `id`. */
function without<T>(map: Record<string, T>, id: string): Record<string, T> {
  const next = { ...map };
  delete next[id];
  return next;
}

export interface CouponsContainerResult {
  cards: CouponCardModel[];
  usage: UsageRowModel[];
  summary: CouponsSummary;
  /** Loaded, and the organizer has never made a coupon. */
  isEmpty: boolean;
  /** Coupons whose switch is waiting on the server. */
  pending: Record<string, boolean>;
  notice: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  refresh: () => void;
  /** Flip a coupon on or off: shown at once, put back if the server refuses. */
  toggle: (id: string, enabled: boolean) => void;
  /** After a create, so the new coupon is in the list. */
  reloadCoupons: () => void;
}

/**
 * The Coupons screen: the organizer's coupons, the switch on each, and who has
 * used them. Usage is secondary — if only it fails, the screen still works and
 * the section is simply not shown.
 */
export function useCouponsContainer(): CouponsContainerResult {
  const coupons = useMyCoupons();
  const usage = useCouponUsage();
  const [overrides, setOverrides] = useState<Record<string, CouponStatusDTO>>(
    {},
  );
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [pulling, setPulling] = useState(false);
  const pendingRef = useRef(pending);
  pendingRef.current = pending;

  const refetchCoupons = coupons.refetch;
  const refetchUsage = usage.refetch;
  const refresh = useCallback(() => {
    setPulling(true);
    setNotice(null);
    refetchCoupons();
    refetchUsage();
  }, [refetchCoupons, refetchUsage]);
  const loading = coupons.loading || usage.loading;
  if (pulling && !loading) setPulling(false);

  const reloadAll = useCallback(() => {
    refetchCoupons();
    refetchUsage();
  }, [refetchCoupons, refetchUsage]);
  useRefetchOnFocus(reloadAll);

  // Fresh server data is the truth again — except for a switch still in flight.
  const data = coupons.data;
  useEffect(() => {
    setOverrides(prev => {
      const kept = Object.keys(prev).filter(id => pendingRef.current[id]);
      if (kept.length === Object.keys(prev).length) return prev;
      return Object.fromEntries(kept.map(id => [id, prev[id]]));
    });
  }, [data]);

  const toggle = useCallback((id: string, enabled: boolean) => {
    if (pendingRef.current[id]) return;
    const status: CouponStatusDTO = enabled ? 'active' : 'disabled';
    setNotice(null);
    setOverrides(prev => ({ ...prev, [id]: status }));
    setPending(prev => ({ ...prev, [id]: true }));
    setCouponStatus(id, status)
      .catch(error => {
        setOverrides(prev => without(prev, id));
        setNotice(errorMessage(error, COPY.toggleFailed));
      })
      .finally(() => setPending(prev => without(prev, id)));
  }, []);

  const list: CouponDTO[] = useMemo(
    () =>
      (data ?? []).map(c =>
        overrides[c.id] ? { ...c, status: overrides[c.id] } : c,
      ),
    [data, overrides],
  );
  const usageData = usage.data;

  return {
    cards: useMemo(() => mapCoupons(list), [list]),
    usage: useMemo(() => mapUsage(usageData ?? []), [usageData]),
    summary: useMemo(() => summarize(list, usageData ?? []), [list, usageData]),
    isEmpty: !!data && data.length === 0,
    pending,
    notice,
    isLoading: coupons.loading && !data,
    isRefreshing: pulling,
    errorMessage: !data && coupons.error ? coupons.error.message : null,
    refresh,
    toggle,
    reloadCoupons: reloadAll,
  };
}

export interface CouponFormContainerResult {
  visible: boolean;
  form: CouponForm;
  errors: CouponFormErrors;
  dirty: boolean;
  saving: boolean;
  saveError: string | null;
  open: () => void;
  /** Closes without asking — the screen asks first when `dirty`. */
  close: () => void;
  setField: <K extends keyof CouponForm>(key: K, value: CouponForm[K]) => void;
  setDiscountType: (type: CouponDiscountType) => void;
  /** Validates, then creates; resolves true once the coupon exists. */
  submit: () => Promise<boolean>;
}

/** The create-coupon form: its fields, the checks before sending, and the POST. */
export function useCouponFormContainer(
  onCreated: () => void,
): CouponFormContainerResult {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState<CouponForm>(emptyForm);
  const [errors, setErrors] = useState<CouponFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const open = useCallback(() => {
    setForm(emptyForm());
    setErrors({});
    setSaveError(null);
    setVisible(true);
  }, []);

  const close = useCallback(() => setVisible(false), []);

  const setField = useCallback(
    <K extends keyof CouponForm>(key: K, value: CouponForm[K]) => {
      setForm(prev => ({ ...prev, [key]: value }));
      setErrors(prev => (prev[key] ? { ...prev, [key]: undefined } : prev));
      setSaveError(null);
    },
    [],
  );

  // A cap only means something on a percentage, so switching clears its error.
  const setDiscountType = useCallback((type: CouponDiscountType) => {
    setForm(prev => ({ ...prev, discountType: type }));
    setErrors(prev => ({
      ...prev,
      discountValue: undefined,
      maxDiscount: undefined,
    }));
    setSaveError(null);
  }, []);

  const submit = useCallback(async () => {
    if (saving) return false;
    const found = validateForm(form);
    if (Object.values(found).some(Boolean)) {
      setErrors(found);
      setSaveError(COPY.fixFields);
      return false;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await createCoupon(toTermsBody(form));
      setVisible(false);
      onCreated();
      return true;
    } catch (error) {
      const message = errorMessage(error, COPY.saveFailed);
      // A taken code is the one server error that belongs to a single field.
      if ((error as { status?: number })?.status === 409) {
        setErrors(prev => ({ ...prev, code: message }));
      }
      setSaveError(message);
      return false;
    } finally {
      setSaving(false);
    }
  }, [form, saving, onCreated]);

  return {
    visible,
    form,
    errors,
    dirty: isFormDirty(form),
    saving,
    saveError,
    open,
    close,
    setField,
    setDiscountType,
    submit,
  };
}
