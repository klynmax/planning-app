import { Routes } from '@angular/router';
import { Template } from './components/template/template';
import { RegisteredCards } from './cards/views/registered-cards/registered-cards';
import { CardListing } from './cards/views/card-listing/card-listing';

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
