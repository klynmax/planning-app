import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category-service';
import { CategoryDetails } from '../../models/category-details.models';
import { PageResult } from '../../../../shared/models/pagination/page-result';
import { ACTIONS, NAME, REGISTER_NEW, STATUS } from '../../constants/category.constants';
import { Breadcrumb, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb';
import { RECORD_SUCCESSFULLY_UPDATE } from '../../../../shared/constants/shared.constants';

@Component({
  selector: 'app-category-listing',
  imports: [Breadcrumb, RouterLink, CommonModule],
  templateUrl: './category-listing.html',
  styleUrl: './category-listing.scss',
})
export class CategoryListing {

  size = 10;
  currentPage = 0;
  router = inject(Router);
  toast = inject(ToastrService);
  service = inject(CategoryService);
  list$!: Observable<PageResult<CategoryDetails>>;

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Categorias', url: '#' },
    { label: 'Listagem de Categorias'},
  ];

  /**
   * Constants
   */

  readonly NAME = NAME;
  readonly STATUS = STATUS;
  readonly ACTIONS = ACTIONS;
  readonly REGISTER_NEW = REGISTER_NEW;
  readonly RECORD_SUCCESSFULLY_UPDATE = RECORD_SUCCESSFULLY_UPDATE;

   ngOnInit(): void {
    this.categoryListing();
  }

  categoryListing() {
    this.list$ = this.service.getList(this.currentPage, this.size);
  }

  navigation(page: number) {
    this.currentPage = page;
    this.categoryListing();
  }

  navigationNext(listing: PageResult<CategoryDetails>) {
    if(!listing.last) {
      this.navigation(listing.number + 1);
    }
  }

  navigationPrevious (listing: PageResult<CategoryDetails>) {
    if(!listing.first) {
      this.navigation(listing.number - 1);
    }
  }

  pages(allPages: number): number[] {
    return Array.from({ length: allPages }, (value, index) => index);
  }

  initialRecord(listing: PageResult<CategoryDetails>) {
    if(listing.totalElements === 0) {
      return 0
    }

    return (listing.number * listing.size) + 1;
  }

  finalRecord(listing: PageResult<CategoryDetails>) {
    if(listing.totalElements === 0) {
      return 0
    }

    return Math.min( (listing.number + 1) * listing.size, listing.totalElements);
  }

  updateStatus(idCard: string) {
    this.service
      .updateStatus(idCard)
        .subscribe(next => {
          this.toast.success(RECORD_SUCCESSFULLY_UPDATE);
          this.categoryListing();
        })
  }
}
