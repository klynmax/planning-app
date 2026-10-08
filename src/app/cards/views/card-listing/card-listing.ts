import { Component, inject, OnInit } from '@angular/core';
import { CardService } from '../../service/card-service';
import { Observable } from 'rxjs';
import { PageResult } from '../../../common/models/pagination/page-result';
import { CardDetails } from '../../models/card-details.model';

@Component({
  selector: 'app-card-listing',
  imports: [],
  templateUrl: './card-listing.html',
  styleUrl: './card-listing.scss',
})
export class CardListing implements OnInit {

  service = inject(CardService);
  list$!: Observable<PageResult<CardDetails>>;
  currentPage = 0;
  size = 10;


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
}
