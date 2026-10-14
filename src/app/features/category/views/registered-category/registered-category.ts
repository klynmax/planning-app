import {
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  Breadcrumb,
  BreadcrumbItem
} from '../../../../shared/components/breadcrumb/breadcrumb';

import {
  SAVE,
  CANCEL,
  VALIDATION_ERROR_CHECK_THE_VALUES_PROVIDED,
  AN_ERROR_OCCURRED_WHILE_PROCESSING_THE_REQUEST,
} from '../../../../shared/constants/shared.constants';

import {
  NEW_CATEGORY,
  THE_CATEGORY_NAME_IS_REQUIRED,
  CATEGORY_SUCCESSFULLY_REGISTERED,
} from '../../constants/category.constants';

import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CategoryService } from '../../services/category-service';
import { DataCategoryForms } from '../../models/data-category-forms.model';
import { RegisteredCategoryForm } from '../../models/registered-category-forms.model';
import { ValidationErrorResponse } from '../../../../shared/models/validation/validation-error.model';

@Component({
  selector: 'app-registered-category',
  imports: [
    Breadcrumb,
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './registered-category.html',
  styleUrl: './registered-category.scss',
})
export class RegisteredCategory {

  toast = inject(ToastrService);
  service = inject(CategoryService);
  form!: FormGroup<RegisteredCategoryForm>;

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Categorias', url: '/category-listing' },
    { label: 'Cadastro de Categorias'},
  ];

  /**
   * Constants
   */

  readonly SAVE = SAVE;
  readonly CANCEL = CANCEL;
  readonly NEW_CATEGORY = NEW_CATEGORY;

  readonly THE_CATEGORY_NAME_IS_REQUIRED =
    THE_CATEGORY_NAME_IS_REQUIRED;

  readonly CATEGORY_SUCCESSFULLY_REGISTERED =
    CATEGORY_SUCCESSFULLY_REGISTERED;

  readonly VALIDATION_ERROR_CHECK_THE_VALUES_PROVIDED =
    VALIDATION_ERROR_CHECK_THE_VALUES_PROVIDED;

  readonly AN_ERROR_OCCURRED_WHILE_PROCESSING_THE_REQUEST =
    AN_ERROR_OCCURRED_WHILE_PROCESSING_THE_REQUEST;

  ngOnInit(): void {
    this.form = new FormGroup<RegisteredCategoryForm>({
      name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    });
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
      return
    }

    const dateCategory = this.form.value as DataCategoryForms;

    this.service
      .create(dateCategory)
        .subscribe({
          next: (response) => {
            this.toast.success(CATEGORY_SUCCESSFULLY_REGISTERED)
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
}
