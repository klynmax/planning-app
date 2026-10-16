import {
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  NEW_RELEASE,
  THE_DATE_IS_MANDATORY,
  THE_TYPE_IS_MANDATORY,
  THE_VALUE_IS_MANDATORY,
  THE_CATEGORY_IS_MANDATORY,
  THE_DESCRIPTION_IS_MANDATORY,
  ENTRY_SUCCESSFULLY_REGISTERED,
  ERROR_LOADING_CATEGORIES_AND_CARDS,
  THE_VALUE_MUST_BE_GREATER_THAN_ZERO
} from '../../constants/release.constants';

import {
  SAVE,
  CANCEL,
  VALIDATION_ERROR_CHECK_THE_VALUES_PROVIDED,
  AN_ERROR_OCCURRED_WHILE_PROCESSING_THE_REQUEST,
} from '../../../../shared/constants/shared.constants';

import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective } from 'ngx-mask';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReleasesService } from '../../service/releases-service';
import { CardDetails } from '../../../cards/models/card-details.model';
import { DataReleaseForm, TYPERELEASE } from '../../models/data-release-form.model';
import { CategoryDetails } from '../../../category/models/category-details.models';
import { ValidationErrorResponse } from '../../../../shared/models/validation/validation-error.model';

interface ReleaseRegistrationForm {
  date: FormControl<string>;
  value: FormControl<string>;
  cardId: FormControl<string>
  categoryId: FormControl<string>;
  description: FormControl<string>;
  type: FormControl<TYPERELEASE | ''>
}

@Component({
  selector: 'app-register-releases',
  imports: [
    RouterLink,
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
  readonly SAVE = SAVE;
  readonly CANCEL = CANCEL;
  readonly NEW_RELEASE = NEW_RELEASE;
  readonly THE_TYPE_IS_MANDATORY = THE_TYPE_IS_MANDATORY;
  readonly THE_DATE_IS_MANDATORY = THE_DATE_IS_MANDATORY;
  readonly THE_VALUE_IS_MANDATORY = THE_VALUE_IS_MANDATORY;
  readonly THE_CATEGORY_IS_MANDATORY = THE_CATEGORY_IS_MANDATORY;

  readonly THE_VALUE_MUST_BE_GREATER_THAN_ZERO =
    THE_VALUE_MUST_BE_GREATER_THAN_ZERO;

  readonly THE_DESCRIPTION_IS_MANDATORY =
    THE_DESCRIPTION_IS_MANDATORY

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
      description: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
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
