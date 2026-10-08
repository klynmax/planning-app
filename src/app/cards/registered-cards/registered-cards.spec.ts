import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredCards } from './registered-cards';

describe('RegisteredCards', () => {
  let component: RegisteredCards;
  let fixture: ComponentFixture<RegisteredCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisteredCards],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisteredCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
