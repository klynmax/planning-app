import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface AuthForm {
  name: FormControl<string>;
  login: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm implements OnInit {

  form!: FormGroup<AuthForm>;
  mode: 'login' | 'register' = 'login';

  authService = inject(AuthService);
  router =  inject(Router);
  toast = inject(ToastrService);

  ngOnInit(): void {
    this.form = new FormGroup<AuthForm>({
      name: new FormControl<string>('', { nonNullable: true }),
      login: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.min(6)] }),
    });
  }

  updateModel(mode: 'login' | 'register'): void {
    this.mode = mode;

    if(mode === 'register') {
      this.form.controls.name.setValidators(Validators.required);
    } else {
      this.form.controls.name.clearAsyncValidators();
    }

    this.form.controls.name.updateValueAndValidity();
  }

  handleSubmit(): void {
    console.log(this.form.value);
  }

}
