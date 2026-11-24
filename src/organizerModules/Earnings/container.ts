import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useEarnings } from './hooks';
import type {
  EarningsPeriod,
  EarningsSummary,
  MixSlice,
  MonthBar,
  PaymentItem,
} from './types';
import {
  mixSlices,
  monthBars,
  paymentItems,
  summarize,
  transactionsFor,
} from './utils';

export interface EarningsContainerResult {
  period: EarningsPeriod;
  setPeriod: (period: EarningsPeriod) => void;
  summary: EarningsSummary | null;
  bars: MonthBar[];
  mix: MixSlice[];
  payments: PaymentItem[];
  /** Any bookings at all, so an empty period is told apart from a new account. */
  hasAny: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  refresh: () => void;
}

export function useEarningsContainer(): EarningsContainerResult {
  const earnings = useEarnings();
  const [period, setPeriod] = useState<EarningsPeriod>('month');
  const [pulling, setPulling] = useState(false);
  const data = earnings.data;

  const seen = useRef(false);
  const refetch = earnings.refetch;
  useFocusEffect(
    useCallback(() => {
      if (seen.current) refetch();
      seen.current = true;
    }, [refetch]),
  );

  const refresh = useCallback(() => {
    setPulling(true);
    refetch();
  }, [refetch]);
  if (pulling && !earnings.loading) setPulling(false);

  return {
    period,
    setPeriod,
    summary: useMemo(
      () => (data ? summarize(data, period) : null),
      [data, period],
    ),
    bars: useMemo(() => (data ? monthBars(data) : []), [data]),
    mix: useMemo(() => (data ? mixSlices(data) : []), [data]),
    payments: useMemo(
      () => (data ? paymentItems(transactionsFor(data, period)) : []),
      [data, period],
    ),
    hasAny: (data?.transactions ?? []).length > 0,
    isLoading: earnings.loading && !data,
    isRefreshing: pulling,
    errorMessage: !data && earnings.error ? earnings.error.message : null,
    refresh,
  };
}
