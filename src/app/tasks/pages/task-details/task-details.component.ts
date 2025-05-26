import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Task, User, PriorityEnum, StatusEnum } from '../../../shared/models/models';
import { TasksService } from '../../../services/tasks.service';
import { TaskStoreService } from '../../../shared/stores/task-store.service';
import { UserStoreService } from '../../../shared/stores/user-store.service';
import { API_URL } from '../../../shared/constants/constants';

@Component({
  standalone: true,
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class TaskDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tasksSrv = inject(TasksService);
  private taskStore = inject(TaskStoreService);
  private userStore = inject(UserStoreService);
  private location = inject(Location);

  id = this.route.snapshot.paramMap.get('id')!;
  task!: Task;
  users: User[] = [];
  editMode = false;

  statuses = Object.values(StatusEnum);
  priorities = Object.values(PriorityEnum);

  ngOnInit(): void {
    this.tasksSrv.findById(this.id).subscribe((t) => (this.task = { ...t }));
    this.userStore.users$.subscribe((u) => (this.users = u));
  }

  get assignee(): User | null {
    return this.users.find((u) => u._id === this.task.userId) ?? null;
  }

  get fullAvatar(): (path: string) => string {
    return (path: string) => (path?.startsWith('http') ? path : API_URL + path);
  }

  get timeLeft(): string {
    const { estimatedTime, spentTime } = this.task || {};
    if (estimatedTime != null && spentTime != null) {
      return `${estimatedTime - spentTime}h`;
    }
    return '—';
  }

  get progressPercent(): number {
    const est = this.task.estimatedTime ?? 0;
    const spent = this.task.spentTime ?? 0;
    return est > 0 ? Math.min((spent / est) * 100, 100) : 0;
  }

  toggleEdit() {
    this.editMode = true;
  }

  cancel() {
    this.editMode = false;
    this.tasksSrv.findById(this.id).subscribe((t) => (this.task = { ...t }));
  }

  save() {
    if (this.task.completedOn != null) {
      this.task.completedOn = Math.max(0, Math.min(100, this.task.completedOn));
    }

    this.tasksSrv.update(this.id, this.task).subscribe((upd) => {
      this.task = upd;
      this.taskStore.updateLocal(upd);
      this.editMode = false;
    });
  }

  del() {
    if (!confirm('Delete this task?')) return;
    this.tasksSrv.delete(this.id).subscribe(() => {
      this.taskStore.remove(this.id);
      this.location.back();
    });
  }
}
