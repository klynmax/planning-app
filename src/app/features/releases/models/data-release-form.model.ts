export type TYPERELEASE = 'REVENUE' | 'EXPENSES';

export class DataReleaseForm {
  type!: string;
  date!: string;
  value!: string;
  cardId?: string | null;
  categoryId!: TYPERELEASE;
}
