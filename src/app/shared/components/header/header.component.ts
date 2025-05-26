import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { API_URL } from '../../constants/constants';
import { User } from '../../models/models';
import { UserStoreService } from '../../stores/user-store.service';
import { TaskCreateModalComponent } from '../../../tasks/components/task-create-modal/task-create-modal.component';
import { UserModalComponent } from '../../../users/components/user-modal/user-modal.component';
import { UserInfoModalComponent } from '../../../users/components/user-info-modal/user-info-modal.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatTooltipModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  users: User[] = [];
  apiUrl = API_URL;

  constructor(
    private dialog: MatDialog,
    private userStore: UserStoreService,
  ) {}

  ngOnInit(): void {
    this.userStore.users$.subscribe((u) => (this.users = u));
  }

  openNewTask(): void {
    this.dialog
      .open(TaskCreateModalComponent, {
        width: '520px',
      })
      .afterClosed()
      .subscribe();
  }

  openNewUser(): void {
    this.dialog
      .open(UserModalComponent, { width: '400px' })
      .afterClosed()
      .subscribe((created) => {
        if (created) {
          this.userStore.set([...this.users, created]);
        }
      });
  }

  openUserInfo(user: User): void {
    this.dialog
      .open(UserInfoModalComponent, {
        width: '520px',
        data: user,
      })
      .afterClosed()
      .subscribe((res) => {
        if (!res) return;

        if ((res as any).deleted) {
          this.userStore.set(this.users.filter((u) => u._id !== (res as any)._id));
          return;
        }

        const updated = res as User;
        const list = this.users.map((u) => (u._id === updated._id ? updated : u));
        this.userStore.set(list);
      });
  }
}
