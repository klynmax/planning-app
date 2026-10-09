import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Toast, ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { CardService } from '../../services/card-service';
import { CardDetails } from '../../models/card-details.model';
import { PageResult } from '../../../../shared/models/pagination/page-result';
import { RECORD_SUCCESSFULLY_UPDATE } from '../../../../shared/constants/shared.constants';
import { ACTIONS, BRAND, NAME, REGISTER_NEW, STATUS } from '../../constants/cards.constants';

@Component({
  selector: 'app-card-listing',
  imports: [CommonModule, RouterLink],
  templateUrl: './card-listing.html',
  styleUrl: './card-listing.scss',
})
export class CardListing implements OnInit {

  size = 10;
  currentPage = 0;
  router = inject(Router);
  service = inject(CardService);
  toast = inject(ToastrService);
  list$!: Observable<PageResult<CardDetails>>;

  /**
   * Constants
   */
  readonly NAME = NAME;
  readonly BRAND = BRAND;
  readonly STATUS = STATUS;
  readonly ACTIONS = ACTIONS;
  readonly REGISTER_NEW = REGISTER_NEW;
  readonly RECORD_SUCCESSFULLY_UPDATE = RECORD_SUCCESSFULLY_UPDATE;

  ngOnInit(): void {
    this.cardListing();
  }

  cardListing() {
    this.list$ = this.service.getList(this.currentPage, this.size);
  }

  navigation(page: number) {
    this.currentPage = page;
    this.cardListing();
  }

  navigationNext(listing: PageResult<CardDetails>) {
    if(!listing.last) {
      this.navigation(listing.number + 1);
    }
  }

  navigationPrevious (listing: PageResult<CardDetails>) {
    if(!listing.first) {
      this.navigation(listing.number - 1);
    }
  }

  pages(allPages: number): number[] {
    return Array.from({ length: allPages }, (value, index) => index);
  }

  initialRecord(listing: PageResult<CardDetails>) {
    if(listing.totalElements === 0) {
      return 0
    }

    return (listing.number * listing.size) + 1;
  }

  finalRecord(listing: PageResult<CardDetails>) {
     if(listing.totalElements === 0) {
      return 0
    }

    return Math.min( (listing.number + 1) * listing.size, listing.totalElements);
  }

  prepareEdition(idCard: string) {
    this.router.navigate(['/registered-cards'], {
      queryParams: {
        id: idCard
      }
    });
  }

  updateStatus(idCard: string) {
    this.service
    .updateStatus(idCard)
    .subscribe(next => {
      this.toast.success(RECORD_SUCCESSFULLY_UPDATE);
      this.cardListing();
    })
  }

}
