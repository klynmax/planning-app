import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
   private router = inject(Router);
  private route = inject(ActivatedRoute);

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
