export type LegalSupportAction = 'contact' | 'placeholder';

export interface LegalSupportItem {
  key: string;
  icon: string;
  label: string;
  action: LegalSupportAction;
}
