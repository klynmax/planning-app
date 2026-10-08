import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardService } from '../service/card-service';
import { DataCardsForm } from '../models/data-cards-forms.model';
import { CardDetails } from '../models/card-details.model';
import { ValidationErrorResponse } from '../../common/models/validation/validation-error.model';
import { RegisteredCardForms } from '../models/registered-card-forms.model';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registered-cards',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registered-cards.html',
  styleUrl: './registered-cards.scss',
})
export class RegisteredCards implements OnInit {

  form!: FormGroup<RegisteredCardForms>;
  service = inject(CardService);
  toast = inject(ToastrService);

  ngOnInit(): void {
    this.form = new FormGroup<RegisteredCardForms>({
      name: new FormControl('', { nonNullable: true, validators: Validators.required }),
      brand: new FormControl('', { nonNullable: true, validators: Validators.required }),
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
    this.service
      .create(dateCard)
      .subscribe({
        next: (response: CardDetails) => {
          console.log('response: ', response),
          this.toast.success('Cartão cadastrado/atualizado com sucesso!')
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
