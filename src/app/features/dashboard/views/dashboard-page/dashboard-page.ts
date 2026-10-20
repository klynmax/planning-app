import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../service/dashboard-service';
import { Observable } from 'rxjs';
import { DashboardModel } from '../../models/dashboard.model';
import { CommonModule } from '@angular/common';
import { ExpenseCategorySummary } from '../../models/expense-category-summary.model';
import { CURRENT_BALANCE, CURRENT_MONTH, EXPENSES, EXPENSES_BY_CATEGORY, NO_EXPENSES_RECORDED_FOR_THE_CURRENT_MONTH, REVENUES } from '../../constants/dashboard.constants';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  service = inject(DashboardService);
  dashboard$!: Observable<DashboardModel>;

  /**
   * Constants
   */

  readonly REVENUES = REVENUES;
  readonly EXPENSES = EXPENSES;
  readonly CURRENT_MONTH = CURRENT_MONTH;
  readonly CURRENT_BALANCE = CURRENT_BALANCE;
  readonly EXPENSES_BY_CATEGORY = EXPENSES_BY_CATEGORY;

  readonly NO_EXPENSES_RECORDED_FOR_THE_CURRENT_MONTH =
    NO_EXPENSES_RECORDED_FOR_THE_CURRENT_MONTH;

  ngOnInit(): void {
    this.dashboard$ = this.service.getDashboardCurrentMonth();
  }

  percentage(value: number, total: number) {
    if(!total) {
      return 0;
    }

    const result = (value / total) * 100;
    return Math.round(result);
  }

  largestExpenseCategory(expenses: ExpenseCategorySummary[]) {
    if(!expenses.length) {
      return 0;
    }

    const expensesValue = expenses.map(expense => expense.value);
    return Math.max(...expensesValue);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  }

  formatMonth(month: string): string {
    if(!month) {
      return ''
    }

    const [year, numberMonth] = month.split('-').map(Number);
    const date = new Date(year, numberMonth - 1, 1);

    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  }
}
