import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListing } from './category-listing';

describe('CategoryListing', () => {
  let component: CategoryListing;
  let fixture: ComponentFixture<CategoryListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryListing],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryListing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
