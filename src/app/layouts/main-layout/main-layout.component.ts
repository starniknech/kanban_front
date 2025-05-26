import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from '../../shared/components/header/header.component';
import { UserStoreService } from '../../shared/stores/user-store.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterOutlet, RouterModule, MatIconModule],
  template: `
    <app-header></app-header>

    <main class="container">
      <nav class="view-switch">
        <a routerLink="/board" routerLinkActive="active" class="switch-btn" aria-label="Board view">
          <mat-icon>view_column</mat-icon>
        </a>

        <a routerLink="/tasks" routerLinkActive="active" class="switch-btn" aria-label="List view">
          <mat-icon>view_list</mat-icon>
        </a>
      </nav>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      $app-blue: #2c64f2;

      .container {
        padding: 80px 16px 40px;
        max-width: 1280px;
        margin: 0 auto;
      }

      .view-switch {
        display: flex;
        justify-content: flex-start;
        gap: 8px;
        padding: 8px 24px;
      }

      .switch-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f0f0;
        color: #333;
        filter: grayscale(1);
        transition:
          background 0.2s,
          filter 0.2s;

        &:hover {
          background: #e0e0e0;
        }

        &.active {
          filter: grayscale(0);
          background: lighten($app-blue, 45%);
          color: $app-blue;
        }
      }
    `,
  ],
})
export class MainLayoutComponent implements OnInit {
  constructor(private userStore: UserStoreService) {}

  ngOnInit(): void {
    this.userStore.load();
  }
}
