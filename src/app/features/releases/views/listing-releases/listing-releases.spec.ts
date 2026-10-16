import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingReleases } from './listing-releases';

describe('ListingReleases', () => {
  let component: ListingReleases;
  let fixture: ComponentFixture<ListingReleases>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingReleases],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingReleases);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
