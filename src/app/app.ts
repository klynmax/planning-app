import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './features/auth/login/services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.initSessionSave();
  }

  protected readonly title = signal('planning-app');
}
