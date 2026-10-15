import { TYPERELEASE } from "./data-release-form.model";

export class ReleaseDetails {
  id!: string;
  type!: string;
  date!: string;
  value!: string;
  cardName?: string;
  categoryName!: string;
  cardId?: string | null;
  categoryId!: TYPERELEASE;
}
