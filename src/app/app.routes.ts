import { Routes } from '@angular/router';
import { Template } from './shared/components/template/template';
import { RegisteredCards } from './features/cards/views/registered-cards/registered-cards';
import { CardListing } from './features/cards/views/card-listing/card-listing';
export const routes: Routes = [
  {
    path: '',
    component: Template,
    children: [
      {
        path: 'registered-cards',
        component: RegisteredCards
      },
      {
        path: 'cards-listing',
        component: CardListing
      }
    ]
  }
];
