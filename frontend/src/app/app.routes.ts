import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      {
        path: '',
        redirectTo: 'data-explorer',
        pathMatch: 'full'
      },
      {
        path: 'data-explorer',
        loadComponent: () =>
          import('./features/data-explorer/pages/data-explorer-page/data-explorer-page')
            .then(m => m.DataExplorerPage)
      }
    ]
  }
];
