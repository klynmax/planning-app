import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type CardBrand =
  | 'VISA'
  | 'MASTERCARD'
  | 'AMERICAN_EXPRESS'
  | 'DINERS'
  | 'ELO'
  | 'HIPERCARD';

@Component({
  selector: 'app-card-brand-icon',
   standalone: true,
  imports: [CommonModule],
  templateUrl: './card-brand-icon.html',
  styleUrl: './card-brand-icon.scss',
})

export class CardBrandIcon {
   @Input({ required: true }) brand!: string;
  @Input() width = 48;
  @Input() height = 32;

  get normalizedBrand(): CardBrand | 'UNKNOWN' {
    return (this.brand?.toUpperCase().trim() as CardBrand) ?? 'UNKNOWN';
  }
}
