import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterUserForm } from '../../models/register-user-form.model';
import { LoginFormModel } from '../../models/login-form.model';

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

    if(this.authService.isAutenticate()) {
      this.router.navigate(['/dashboard']);
    }
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
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Verifique os dados informados!');
      return;
    }

    if(this.mode === 'register') {
      const dataRegister = this.form.value as RegisterUserForm;
      this.authService.register(dataRegister).subscribe({
        next: () => this.onAuthSucess(),
        error: response => this.onAuthError(response)
      });
      return;
    }

    const dataLogin = this.form.value as LoginFormModel;
    this.authService.login(dataLogin).subscribe({
      next: () => this.onAuthSucess(),
      error: response => this.onAuthError(response)
    });
  }

  onAuthSucess(): void {
    this.router.navigate(['/dashboard']);
  }

  onAuthError(response: any): void {
    if(response.status === 401) {
      this.toast.error('Login ou senha inválidos!');
      return;
    }

    if(response.status === 422) {
      this.toast.error('Verifique os dados informados!');
      return;
    }

    this.toast.error('Ocorreu um erro ao autenticar!')
  }
}
