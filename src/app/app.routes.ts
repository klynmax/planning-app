import { Routes } from '@angular/router';
import { Template } from './components/template/template';
import { RegisteredCards } from './cards/registered-cards/registered-cards';

export const routes: Routes = [
  {
    path: '',
    component: Template,
    children: [
      {
        path: 'registered-cards',
        component: RegisteredCards
      }
    ]
  }
];
