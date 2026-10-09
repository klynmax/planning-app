import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RegisteredCardForms } from '../../models/registered-card-forms.model';
import { CardService } from '../../service/card-service';
import { DataCardsForm } from '../../models/data-cards-forms.model';
import { CardDetails } from '../../models/card-details.model';
import { ValidationErrorResponse } from '../../../common/models/validation/validation-error.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-registered-cards',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './registered-cards.html',
  styleUrl: './registered-cards.scss',
})
export class RegisteredCards implements OnInit {

  form!: FormGroup<RegisteredCardForms>;
  activeRoute = inject(ActivatedRoute);
  service = inject(CardService);
  toast = inject(ToastrService);
  idCardEdit?: string | null;

  ngOnInit(): void {
    this.form = new FormGroup<RegisteredCardForms>({
      name: new FormControl('', { nonNullable: true, validators: Validators.required }),
      brand: new FormControl('', { nonNullable: true, validators: Validators.required }),
    });
    this.loadDataForEditing();
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
      error: () => this.toast.error('Erro ao carregar dados do cartão.')
    });
  }

  isFormInvalid(): boolean {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Erro de validação. Verifique os valores informados.');
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
    console.log('response: ', response)
    if(response.status === 422) {
      this.applyValidationErrors(response.error);
      this.toast.error('Erro de validação. Verifique os valores informados.');
      return;
    }
    this.toast.error('Ocorreu um erro ao processar a requisição.'),
    console.error(response.error)
  }

}
