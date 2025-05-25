import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router, RouterModule } from '@angular/router';
import { StatusEnum, Task, User } from '../../../models/models';
import { TasksService } from '../../../services/tasks.service';
import { UserStoreService } from '../../../shared/stores/user-store.service';
import { TaskStoreService } from '../../../shared/stores/task-store.service';
import { API_URL } from '../../../shared/constants/constants';

type Columns = Record<StatusEnum, Task[]>;

@Component({
  standalone: true,
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  imports: [CommonModule, DragDropModule, RouterModule],
})
export class BoardComponent implements OnInit {
  StatusEnum = StatusEnum;
  apiUrl = API_URL; 

  orderedStatuses: StatusEnum[] = [
    StatusEnum.TODO,
    StatusEnum.IN_PROGRESS,
    StatusEnum.IN_REVIEW,
    StatusEnum.DONE,
    StatusEnum.POSTPONED,
  ];

  columns: Columns = {
    [StatusEnum.TODO]: [],
    [StatusEnum.IN_PROGRESS]: [],
    [StatusEnum.IN_REVIEW]: [],
    [StatusEnum.DONE]: [],
    [StatusEnum.POSTPONED]: [],
  };

  private usersMap: Record<string, User> = {};

  constructor(
    private tasksService: TasksService,
    private router: Router,
    private userStore: UserStoreService,
    private taskStore: TaskStoreService,
  ) {}

  ngOnInit(): void {
    /* подписываемся на список задач */
    this.taskStore.list$.subscribe((tasks) => {
      /* очищаем колонки и раскладываем заново */
      for (const key of this.orderedStatuses) this.columns[key] = [];
      tasks.forEach((t) => this.columns[t.status].push(t));
    });

    /* если стор ещё пуст – загрузим с сервера */
    this.taskStore.load();

    /* подписка на пользователей */
    this.userStore.users$.subscribe((list) => {
      this.usersMap = list.reduce<Record<string, User>>((acc, u) => ((acc[u._id] = u), acc), {});
    });
  }

  userBy(id?: string): User | null {
    return id ? (this.usersMap[id] ?? null) : null;
  }

  navigateTo(id: string): void {
    this.router.navigate(['/tasks', id]);
  }

  /* drag-and-drop */
  drop(evt: CdkDragDrop<Task[]>, status: StatusEnum): void {
    if (evt.previousContainer === evt.container) {
      moveItemInArray(evt.container.data, evt.previousIndex, evt.currentIndex);
      return;
    }

    transferArrayItem(evt.previousContainer.data, evt.container.data, evt.previousIndex, evt.currentIndex);

    const task = evt.container.data[evt.currentIndex];
    if (task.status === status) return;

    const oldStatus = task.status;
    task.status = status; // optimistic locally

    this.tasksService.update(task._id!, { status }).subscribe({
      next: (updated) => this.taskStore.updateLocal(updated), // sync стор
      error: () => {
        // rollback UI & стор
        task.status = oldStatus;
        transferArrayItem(evt.container.data, evt.previousContainer.data, evt.currentIndex, evt.previousIndex);
      },
    });
  }
}
