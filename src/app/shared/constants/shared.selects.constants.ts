export interface BrandProps {
  value: string;
  label: string;
}

export const BRAND_LIST: BrandProps[] = [
  { value: 'AMERICAN_EXPRESS', label: 'American Express' },
  { value: 'DINERS',           label: 'Diners' },
  { value: 'ELO',              label: 'Elo' },
  { value: 'HIPERCARD',        label: 'Hipercard' },
  { value: 'MASTERCARD',       label: 'Mastercard' },
  { value: 'VISA',             label: 'Visa' }
];
