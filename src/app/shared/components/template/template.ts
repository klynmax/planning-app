import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { AuthService } from '../../../features/auth/login/services/auth-service';
import { APP_NAME, CATEGORIES, CREDIT_CARDS, DASHBOARD, NEW_RELEASES } from '../../constants/shared.constants';


@Component({
  selector: 'app-template',
  imports: [RouterOutlet, RouterModule, Header],
  templateUrl: './template.html',
  styleUrl: './template.scss',
})
export class Template {
  readonly APP_NAME = APP_NAME;
  readonly DASHBOARD = DASHBOARD;
  readonly CREDIT_CARDS = CREDIT_CARDS;
  readonly CATEGORIES = CATEGORIES;
  readonly NEW_RELEASES = NEW_RELEASES;

  authService = inject(AuthService)

  logout() {
    this.authService.logout(true);
  }
}
