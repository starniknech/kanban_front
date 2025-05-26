import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <header class="app-header">
      <a routerLink="/board" class="logo-group" aria-label="Board">
        <img src="assets/app-icon.png" class="logo" alt="Logo" />
        <span class="title">Kanban&nbsp;Task&nbsp;Manager</span>
      </a>

      <div class="spacer"></div>

      <button class="btn secondary" aria-label="Back" (click)="back()">
        <mat-icon>arrow_back</mat-icon>
        <span class="txt">Back</span>
      </button>
    </header>
  `,
  styles: [
    `
      $app-blue: #2c64f2;
      $light-gray: #f5f5f5;

      .app-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        height: 64px;
        padding: 0 24px;
        background: #fff;
        border-bottom: 1px solid $light-gray;
        max-width: 1280px;
        margin: 0 auto;
      }

      .logo-group {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: inherit;
      }

      .logo {
        width: 32px;
        height: 32px;
      }

      .title {
        margin-left: 8px;
        font-weight: 600;
        font-size: 1.1rem;
      }

      .spacer {
        flex: 1 1 auto;
      }

      .btn {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 14px;
        font-weight: 500;
        border-radius: 4px;
        border: 1px solid $app-blue;
        background: #fff;
        color: $app-blue;
        cursor: pointer;
        transition: opacity 0.2s;
      }

      .btn:hover {
        opacity: 0.85;
      }

      .txt {
        display: none;
      }

      @media (min-width: 600px) {
        .txt {
          display: inline;
        }
      }
    `,
  ],
})
export class TaskHeaderComponent {
  constructor(private loc: Location) {}

  back(): void {
    this.loc.back();
  }
}
