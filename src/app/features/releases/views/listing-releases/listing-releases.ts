import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TYPERELEASE } from '../../models/data-release-form.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReleasesService } from '../../service/releases-service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { PageResult } from '../../../../shared/models/pagination/page-result';
import { ReleaseDetails } from '../../models/releases-details.model';
import { ACTION, CATEGORY, DATE, DESCRIPTION, ENTRY_SUCCESSFULLY_DELETED, ERROR_DELETING_ENTRY, ERROR_LOADING_CATEGORIES_FOR_FILTERS, REGISTER_NEW, TYPE, VALUE } from '../../constants/release.constants';
import { CategoryDetails } from '../../../category/models/category-details.models';
import { Breadcrumb, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb';

interface FiltersForm {
  month: FormControl<string>;
  type: FormControl<TYPERELEASE | ''>;
  categoryId: FormControl<string>;
}

@Component({
  selector: 'app-listing-releases',
  imports: [
    RouterLink,
    Breadcrumb,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './listing-releases.html',
  styleUrl: './listing-releases.scss',
})
export class ListingReleases implements OnInit {

  sizePage = 10;
  actualPage = 0;
  form!: FormGroup
  toast = inject(ToastrService);
  category: CategoryDetails[] = [];
  service = inject(ReleasesService);
  listing$!: Observable<PageResult<ReleaseDetails>>;

   breadcrumb: BreadcrumbItem[] = [
      { label: 'Lançamentos', url: '#' },
      { label: 'Listagem de Lançamentos'},
    ];

  /**
   * Constants
   */
  readonly DATE = DATE;
  readonly TYPE = TYPE;
  readonly VALUE = VALUE;
  readonly ACTION = ACTION;
  readonly CATEGORY = CATEGORY;
  readonly DESCRIPTION = DESCRIPTION;

  readonly REGISTER_NEW = REGISTER_NEW;
  readonly ERROR_DELETING_ENTRY = ERROR_DELETING_ENTRY;

  readonly ENTRY_SUCCESSFULLY_DELETED =
    ENTRY_SUCCESSFULLY_DELETED;

  readonly ERROR_LOADING_CATEGORIES_FOR_FILTERS =
    ERROR_LOADING_CATEGORIES_FOR_FILTERS

  ngOnInit(): void {
    this.form = new FormGroup<FiltersForm>({
      month: new FormControl<string>('', { nonNullable: true }),
      type: new FormControl<TYPERELEASE | ''>('', { nonNullable: true }),
      categoryId: new FormControl<string>('', { nonNullable: true }),
    })
    this.listReleases();
    this.listReleaseFilter()
  }

  listReleases() {
    const month = this.form.get('month')?.value;
    const type = this.form.get('type')?.value;
    const categoryId = this.form.get('categoryId')?.value;

    this.listing$ = this.service.getList({
      page: this.actualPage,
      size: this.sizePage,
      month: month || undefined,
      type: type || undefined,
      categoryId: categoryId || undefined
    })
  }

  listReleaseFilter() {
    this.service.getCategoryFilterAll().subscribe({
      next: (result: CategoryDetails[]) => {
        this.category = result;
      },
      error: () => this.toast.error(ERROR_LOADING_CATEGORIES_FOR_FILTERS)
    })
  }

  applyFilter() {
    this.actualPage = 0;
    this.listReleases();
  }

  cleanFilters() {
    this.form.reset({
      month: '',
      type: '',
      categoryId: ''
    });
    this.actualPage = 0;
    this.listReleases();
  }

  navigation(page: number): void {
    this.actualPage = page;
    this.listReleases();
  }

  delete(id: string) {
    this.service.delete(id).subscribe({
      next: () => {
        this.toast.success(ENTRY_SUCCESSFULLY_DELETED);
        this.listReleases();
      },
      error: () => this.toast.error(ERROR_DELETING_ENTRY)
    })
  }

  navigationNext(list: PageResult<ReleaseDetails>): void {
    if(!list.last) {
      this.navigation(list.number + 1);
    }
  }

  navigationPrevious(list: PageResult<ReleaseDetails>): void {
    if(!list.first) {
      this.navigation(list.number - 1);
    }
  }

  pages(totalPages: number): number[] {
    return Array.from({ length: totalPages }, ( _value, index) => index);
  }

  initialRecord(listing: PageResult<ReleaseDetails>): number {
    if(!listing.totalElements) {
      return 0;
    }
    return listing.number * listing.size + 1;
  }

  finalRecord(listing: PageResult<ReleaseDetails>) {
    if(listing.totalElements === 0) {
      return 0
    }

    return Math.min( (listing.number + 1) * listing.size, listing.totalElements);
  }

}
