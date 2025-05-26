import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';

import { UserStoreService } from '../../shared/stores/user-store.service';
import { TaskHeaderComponent } from '../../tasks/components/task-header/task-header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, TaskHeaderComponent, RouterOutlet, RouterModule],
  template: `
    <app-task-header></app-task-header>

    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      $app-blue: #2c64f2;

      .container {
        padding: 24px 16px 40px;
        max-width: 1280px;
        margin: 0 auto;
      }
    `,
  ],
})
export class TaskLayoutComponent implements OnInit {
  constructor(private userStore: UserStoreService) {}

  ngOnInit(): void {
    this.userStore.load();
  }
}
