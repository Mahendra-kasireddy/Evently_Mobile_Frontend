import { useCallback, useMemo, useState } from 'react';
import { INITIAL_PREFS } from './constants';
import type { SettingsGroup, SettingsPref } from './types';

export interface SettingsContainerResult {
  groups: SettingsGroup[];
  toggle: (key: string) => void;
}

/** Local-state only — no backend preferences endpoint exists yet (same limitation as the web app). */
export function useSettingsContainer(): SettingsContainerResult {
  const [prefs, setPrefs] = useState<SettingsPref[]>(INITIAL_PREFS);

  const toggle = useCallback((key: string) => {
    setPrefs((current) => current.map((p) => (p.key === key ? { ...p, enabled: !p.enabled } : p)));
  }, []);

  const groups = useMemo<SettingsGroup[]>(() => {
    const order: string[] = [];
    prefs.forEach((p) => {
      if (!order.includes(p.group)) order.push(p.group);
    });
    return order.map((title) => ({ title, prefs: prefs.filter((p) => p.group === title) }));
  }, [prefs]);

  return { groups, toggle };
}
