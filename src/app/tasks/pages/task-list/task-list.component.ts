import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { Task, StatusEnum, User } from '../../../shared/models/models';
import { TaskStoreService } from '../../../shared/stores/task-store.service';
import { UserStoreService } from '../../../shared/stores/user-store.service';
import { API_URL } from '../../../shared/constants/constants';

@Component({
  standalone: true,
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  apiUrl = API_URL;

  private usersMap: Record<string, User> = {};

  constructor(
    private taskStore: TaskStoreService,
    private userStore: UserStoreService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.taskStore.list$.subscribe((list) => (this.tasks = list));

    this.userStore.users$.subscribe(
      (u) => (this.usersMap = u.reduce<Record<string, User>>((acc, x) => ((acc[x._id] = x), acc), {})),
    );
  }

  userBy(id?: string): User | null {
    return id ? (this.usersMap[id] ?? null) : null;
  }

  nav(id: string): void {
    this.router.navigate(['/tasks', id]);
  }
}
