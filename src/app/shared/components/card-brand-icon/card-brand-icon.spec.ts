import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBrandIcon } from './card-brand-icon';

describe('CardBrandIcon', () => {
  let component: CardBrandIcon;
  let fixture: ComponentFixture<CardBrandIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardBrandIcon],
    }).compileComponents();

    fixture = TestBed.createComponent(CardBrandIcon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
