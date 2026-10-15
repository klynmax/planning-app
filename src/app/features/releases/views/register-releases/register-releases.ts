import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataReleaseForm, TYPERELEASE } from '../../models/data-release-form.model';
import { ToastrService } from 'ngx-toastr';
import { ReleasesService } from '../../service/releases-service';
import { CategoryDetails } from '../../../category/models/category-details.models';
import { CardDetails } from '../../../cards/models/card-details.model';
import { forkJoin } from 'rxjs';
import { ENTRY_SUCCESSFULLY_REGISTERED, ERROR_LOADING_CATEGORIES_AND_CARDS, NEW_RELEASE } from '../../constants/release.constants';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { AN_ERROR_OCCURRED_WHILE_PROCESSING_THE_REQUEST, VALIDATION_ERROR_CHECK_THE_VALUES_PROVIDED } from '../../../../shared/constants/shared.constants';
import { ValidationErrorResponse } from '../../../../shared/models/validation/validation-error.model';

interface ReleaseRegistrationForm {
  date: FormControl<string>;
  value: FormControl<string>;
  cardId: FormControl<string>
  categoryId: FormControl<string>;
  type: FormControl<TYPERELEASE | ''>

}

@Component({
  selector: 'app-register-releases',
  imports: [
    CommonModule,
    NgxMaskDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './register-releases.html',
  styleUrl: './register-releases.scss',
})
export class RegisterReleases implements OnInit {
  form!: FormGroup<ReleaseRegistrationForm>;
  toast = inject(ToastrService);
  service = inject(ReleasesService);

  categoriesActive: CategoryDetails[] = [];
  cardActive: CardDetails[] = [];

  /**
   * Constants
   */
  readonly NEW_RELEASE = NEW_RELEASE;

  readonly ENTRY_SUCCESSFULLY_REGISTERED =
    ENTRY_SUCCESSFULLY_REGISTERED

  readonly VALIDATION_ERROR_CHECK_THE_VALUES_PROVIDED =
    VALIDATION_ERROR_CHECK_THE_VALUES_PROVIDED

  readonly ERROR_LOADING_CATEGORIES_AND_CARDS =
    ERROR_LOADING_CATEGORIES_AND_CARDS

  readonly AN_ERROR_OCCURRED_WHILE_PROCESSING_THE_REQUEST =
    AN_ERROR_OCCURRED_WHILE_PROCESSING_THE_REQUEST;

  ngOnInit(): void {
    this.form = new FormGroup<ReleaseRegistrationForm>({
      categoryId: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      date: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      value: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
      type: new FormControl<TYPERELEASE | ''>('', { nonNullable: true, validators: Validators.required }),
      cardId: new FormControl<string>('', { nonNullable: true }),
    });

    this.initializeDropDowns();
  }

  initializeDropDowns() {
    forkJoin({
      category: this.service.getAvailableCategories(),
      cards: this.service.getAvailableCards(),
    }).subscribe({
      next: (result) => {
        this.categoriesActive = result.category;
        this.cardActive = result.cards;
      },
      error: () => this.toast.error(ERROR_LOADING_CATEGORIES_AND_CARDS)
    })
  }

  isExpenses(): boolean {
    return this.form.controls.type.value === 'EXPENSES';
  }

  handleTypeChange(): void {
    if(!this.isExpenses()) {
      this.form.controls.cardId.setValue('');
      this.form.controls.cardId.setErrors(null);
    }
  }

  isFormInvalid(): boolean {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error(VALIDATION_ERROR_CHECK_THE_VALUES_PROVIDED);

      return true;
    }

    return false;
  }

  handleSubmit() {
    if(this.isFormInvalid()) {
      return;
    }

    const data = this.form.value as DataReleaseForm;
    data.value = this.parseValue(data.value);
    this.service.create(data).subscribe({
      next: () => {
        this.toast.success(ENTRY_SUCCESSFULLY_REGISTERED);
        this.form.reset();
      },
      error: (error) => this.onApiError(error)
    })
  }

  private applyValidationErrors(error: ValidationErrorResponse) {
    error.invalidFields.forEach(fields => {
      const control = this.form.get(fields.field);
      if(control) {
        control.setErrors({ ...control.errors, apiError: fields.error });
        control.markAllAsTouched();
      }
    })
  }

  private onApiError(response: any): void {
    if(response.status === 422) {
      this.applyValidationErrors(response.error);
      this.toast.error(VALIDATION_ERROR_CHECK_THE_VALUES_PROVIDED);
      return;
    }
    this.toast.error(AN_ERROR_OCCURRED_WHILE_PROCESSING_THE_REQUEST),
    console.error(response.error)
  }

  private parseValue(maskValue: string): string {
    if(!maskValue) {
      return '';
    }
    return maskValue.replace(/\./g, '').replace(',', '.');
  }

}
