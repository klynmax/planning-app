import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { AuthService } from '../../../features/auth/login/services/auth-service';


@Component({
  selector: 'app-template',
  imports: [RouterOutlet, RouterModule, Header],
  templateUrl: './template.html',
  styleUrl: './template.scss',
})
export class Template {
  authService = inject(AuthService)

  logout() {
    this.authService.logout(true);
  }
}
