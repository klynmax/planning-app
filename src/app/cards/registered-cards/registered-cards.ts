import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface RegisteredCardForms {
  name: FormControl<string>;
  brand: FormControl<string>;
}

@Component({
  selector: 'app-registered-cards',
  imports: [ReactiveFormsModule],
  templateUrl: './registered-cards.html',
  styleUrl: './registered-cards.scss',
})
export class RegisteredCards implements OnInit {

  form!: FormGroup<RegisteredCardForms>;

  ngOnInit(): void {
    this.form = new FormGroup<RegisteredCardForms>({
      name: new FormControl('', { nonNullable: true, validators: Validators.required }),
      brand: new FormControl('', { nonNullable: true, validators: Validators.required }),
    });
  }

  handleSubmit() {
    console.log('forms', this.form.value)
  }
}
