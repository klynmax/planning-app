import {
  EXIT,
  APP_NAME,
  DASHBOARD,
  CATEGORIES,
  CREDIT_CARDS,
  NEW_RELEASES,
} from '../../constants/shared.constants';

import { Header } from '../header/header';
import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../features/auth/login/services/auth-service';


@Component({
  selector: 'app-template',
  imports: [RouterOutlet, RouterModule, Header],
  templateUrl: './template.html',
  styleUrl: './template.scss',
})
export class Template {
  readonly EXIT = EXIT;
  readonly APP_NAME = APP_NAME;
  readonly DASHBOARD = DASHBOARD;
  readonly CATEGORIES = CATEGORIES;
  readonly CREDIT_CARDS = CREDIT_CARDS;
  readonly NEW_RELEASES = NEW_RELEASES;

  authService = inject(AuthService)

  logout() {
    this.authService.logout(true);
  }
}
