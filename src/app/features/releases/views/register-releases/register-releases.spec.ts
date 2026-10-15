import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterReleases } from './register-releases';

describe('RegisterReleases', () => {
  let component: RegisterReleases;
  let fixture: ComponentFixture<RegisterReleases>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterReleases],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterReleases);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
