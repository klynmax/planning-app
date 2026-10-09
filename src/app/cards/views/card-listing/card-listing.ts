import { Component, inject, OnInit } from '@angular/core';
import { CardService } from '../../service/card-service';
import { Observable } from 'rxjs';
import { PageResult } from '../../../common/models/pagination/page-result';
import { CardDetails } from '../../models/card-details.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-listing',
  imports: [CommonModule],
  templateUrl: './card-listing.html',
  styleUrl: './card-listing.scss',
})
export class CardListing implements OnInit {

  service = inject(CardService);
  list$!: Observable<PageResult<CardDetails>>;
  currentPage = 0;
  size = 2;


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

}
