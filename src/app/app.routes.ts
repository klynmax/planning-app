import { Routes } from '@angular/router';
import { Template } from './shared/components/template/template';
import { RegisteredCards } from './features/cards/views/registered-cards/registered-cards';
import { CardListing } from './features/cards/views/card-listing/card-listing';
import { CategoryListing } from './features/category/views/category-listing/category-listing';
export const routes: Routes = [
  {
    path: '',
    component: Template,
    children: [
      {
        path: 'registered-cards',
        component: RegisteredCards,
        data: { title: 'Cadastro de Cartões' },
      },
      {
        path: 'cards-listing',
        component: CardListing,
        data: { title: 'Listagem de Cartões' },
      },
      {
        path: 'category-listing',
        component: CategoryListing,
        data: { title: 'Listagem de Categorias' },
      }
    ]
  }
];
