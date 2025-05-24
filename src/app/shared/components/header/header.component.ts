import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../models/models';
import { UsersService } from '../../../services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { UserModalComponent } from '../../../users/components/user-modal/user-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  users: User[] = [];

  constructor(private usersService: UsersService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.usersService.getAll().subscribe((users) => {
      this.users = users;
    });
  }

  openNewTask() {
    console.log('new task clicked');
  }

  openNewUser() {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('New user data:', result);
        // можно вызвать UsersService.create(result)
      }
    });
  }
}
