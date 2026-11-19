import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/login/services/auth-service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  authService = inject(AuthService);
  userNameActive = '';

  ngOnInit(): void {
    this.userNameActive = this.authService.getUserName() ?? 'Usuário';
  }

  readonly title = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.getDeepestTitle(this.route)),
    ),
    { initialValue: '' },
  );

  private getDeepestTitle(route: ActivatedRoute): string {
    let current = route.firstChild ?? route;
    while (current.firstChild) current = current.firstChild;
    return current.snapshot.data['title'] ?? '';
  }
}
