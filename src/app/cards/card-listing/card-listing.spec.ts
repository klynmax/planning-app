import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardListing } from './card-listing';

describe('CardListing', () => {
  let component: CardListing;
  let fixture: ComponentFixture<CardListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardListing],
    }).compileComponents();

    fixture = TestBed.createComponent(CardListing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
