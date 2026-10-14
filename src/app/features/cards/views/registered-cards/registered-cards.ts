import {
  SAVE,
  CANCEL,
  UPDATE,
  VALIDATION_ERROR_CHECK_THE_VALUES_PROVIDED,
  AN_ERROR_OCCURRED_WHILE_PROCESSING_THE_REQUEST,
} from '../../../../shared/constants/shared.constants';

import {
  NEW_CARD,
  EDIT_CARD,
  THE_CARD_NAME_IS_REQUIRED,
  THE_CARD_NETWORK_IS_MANDATORY,
  ERROR_LOADING_CARD_DATA
} from '../../constants/cards.constants';

import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CardService } from '../../services/card-service';
import { CardDetails } from '../../models/card-details.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataCardsForm } from '../../models/data-cards-forms.model';
import { RegisteredCardForms } from '../../models/registered-card-forms.model';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BRAND_LIST, BrandProps } from '../../../../shared/constants/shared.selects.constants';
import { Breadcrumb, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb';
import { ValidationErrorResponse } from '../../../../shared/models/validation/validation-error.model';

@Component({
  selector: 'app-registered-cards',
  imports: [
    Breadcrumb,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './registered-cards.html',
  styleUrl: './registered-cards.scss',
})
export class RegisteredCards implements OnInit {

  idCardEdit?: string | null;
  service = inject(CardService);
  toast = inject(ToastrService);
  activeRoute = inject(ActivatedRoute);
  brandList: BrandProps[] = BRAND_LIST;
  form!: FormGroup<RegisteredCardForms>;

  readonly SAVE = SAVE;
  readonly CANCEL = CANCEL;
  readonly UPDATE = UPDATE;
  readonly NEW_CARD = NEW_CARD;
  readonly EDIT_CARD = EDIT_CARD;

  readonly ERROR_LOADING_CARD_DATA =
    ERROR_LOADING_CARD_DATA;

  readonly THE_CARD_NAME_IS_REQUIRED =
    THE_CARD_NAME_IS_REQUIRED;

  readonly THE_CARD_NETWORK_IS_MANDATORY =
    THE_CARD_NETWORK_IS_MANDATORY;

  readonly VALIDATION_ERROR_CHECK_THE_VALUES_PROVIDED =
   VALIDATION_ERROR_CHECK_THE_VALUES_PROVIDED;

  readonly AN_ERROR_OCCURRED_WHILE_PROCESSING_THE_REQUEST =
    AN_ERROR_OCCURRED_WHILE_PROCESSING_THE_REQUEST;

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Cartões', url: '/cards-listing' },
    { label: this.idCardEdit ? 'Edição de cartão' : 'Cadastro de cartão' },
  ];

  ngOnInit(): void {
    this.form = new FormGroup<RegisteredCardForms>({
      name: new FormControl('', { nonNullable: true, validators: Validators.required }),
      brand: new FormControl('', { nonNullable: true, validators: Validators.required }),
    });
    this.loadDataForEditing();
    this.buildBreadcrumb();
  }

  private buildBreadcrumb(): void {
  this.breadcrumb = [
    { label: 'Cartões', url: '/cards-listing' },
    { label: this.idCardEdit ? 'Edição de cartão' : 'Cadastro de cartão' }
  ];
}

  loadDataForEditing() {
    this.idCardEdit = this.activeRoute.snapshot.queryParamMap.get('id');

    if(!this.idCardEdit) {
      return;
    }

    this.service
    .getById(this.idCardEdit)
    .subscribe({
      next: (card) => {
        this.form.patchValue({
          name: card.name,
          brand: card.brand
        })
      },
      error: () => this.toast.error(ERROR_LOADING_CARD_DATA)
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

    const dateCard = this.form.value as DataCardsForm;

    const request: Observable<CardDetails | void> = this.idCardEdit ?
      this.service.update(this.idCardEdit, dateCard)
      : this.service.create(dateCard);

    request
      .subscribe({
        next: (response) => {
          this.toast.success('Cartão cadastrado/atualizado com sucesso!')
          this.form.reset();
          this.idCardEdit = null
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
