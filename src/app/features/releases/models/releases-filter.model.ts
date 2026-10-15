import { TYPERELEASE } from "./data-release-form.model";

export class ReleaseFilter {
  page?: number;
  size?: number;
  month?: string;
  type?: TYPERELEASE;
  categoryId?: string;
}
