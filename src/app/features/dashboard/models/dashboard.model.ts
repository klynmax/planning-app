
import { ExpenseCategorySummary } from "./expense-category-summary.model";
import { FinancialSummary } from "./financial-summary.model";

export class DashboardModel {
  month!: string;
  summary!: FinancialSummary;
  expenseByCategory!: ExpenseCategorySummary[]
}
