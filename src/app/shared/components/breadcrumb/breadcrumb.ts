import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;      // se não tiver url, é o item ativo (última página)
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
   /** Lista de itens do breadcrumb */
  @Input() items: BreadcrumbItem[] = [];

  /** Tema pastel: 'default' | 'lavender' | 'sky' | 'rose' */
  @Input() theme: 'default' | 'lavender' | 'sky' | 'rose' = 'default';

  /** Separador customizado (padrão: '/') */
  @Input() separator: string = '/';

  get themeClass(): string {
    return this.theme === 'default' ? '' : `breadcrumb-${this.theme}`;
  }
}
