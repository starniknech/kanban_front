import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { TaskLayoutComponent } from './layouts/task-layout/task-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'board', pathMatch: 'full' },
      {
        path: 'board',
        loadComponent: () => import('./tasks/pages/board/board.component').then((m) => m.BoardComponent),
      },
      {
        path: 'tasks',
        loadComponent: () => import('./tasks/pages/task-list/task-list.component').then((m) => m.TaskListComponent),
      },
    ],
  },

  {
    path: 'tasks/:id',
    component: TaskLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./tasks/pages/task-details/task-details.component').then((m) => m.TaskDetailsComponent),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
