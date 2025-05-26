import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TasksService } from '../../services/tasks.service';
import { Task } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TaskStoreService {
  private tasks$ = new BehaviorSubject<Task[]>([]);

  /** Публичный observable, на который подписываются компоненты */
  readonly list$ = this.tasks$.asObservable();

  constructor(private tasksService: TasksService) {}

  /** Однократная загрузка с сервера */
  load(): void {
    this.tasksService.findAll().subscribe({
      next: (tasks) => this.tasks$.next(tasks),
      error: (err) => console.error('Task load error:', err),
    });
  }

  /** Добавить новую задачу локально */
  add(task: Task): void {
    this.tasks$.next([...this.tasks$.getValue(), task]);
  }

  /** Обновить задачу локально */
  updateLocal(updated: Task): void {
    const list = this.tasks$.getValue().map((t) => (t._id === updated._id ? updated : t));
    this.tasks$.next(list);
  }

  /** Удалить задачу локально */
  remove(id: string): void {
    this.tasks$.next(this.tasks$.getValue().filter((t) => t._id !== id));
  }
}
