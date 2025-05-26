import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { PriorityEnum, StatusEnum, Task, User } from '../../../shared/models/models';
import { AppModalComponent } from '../../../shared/components/app-modal/app-modal.component';
import { Subscription } from 'rxjs';
import { TasksService } from '../../../services/tasks.service';
import { UserStoreService } from '../../../shared/stores/user-store.service';
import { TaskStoreService } from '../../../shared/stores/task-store.service';

@Component({
  standalone: true,
  selector: 'app-task-create-modal',
  templateUrl: './task-create-modal.component.html',
  styleUrls: ['./task-create-modal.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    AppModalComponent,
  ],
})
export class TaskCreateModalComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loading = false;
  serverError: string | null = null;

  users: { _id: string; name: string }[] = [];
  statuses = Object.values(StatusEnum);
  priorities = Object.values(PriorityEnum);

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TaskCreateModalComponent, Task | null>);
  private tasksSrv = inject(TasksService);
  private userStore = inject(UserStoreService);
  private taskStore = inject(TaskStoreService);

  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.userStore.users$.subscribe((list: User[]) => {
      this.users = list.map(({ _id, name }) => ({ _id, name }));
    });

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      estimatedTime: [1, [Validators.required, Validators.min(1)]],
      status: [StatusEnum.TODO, Validators.required],
      priority: [PriorityEnum.MEDIUM, Validators.required],
      userId: [''],
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  submit(): void {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    this.serverError = null;

    const { userId, ...rest } = this.form.value;
    const payload = {
      ...rest,
      userId: userId || null,
    };

    this.tasksSrv.create(payload).subscribe({
      next: (created) => {
        this.taskStore.add(created);
        this.loading = false;
        this.dialogRef.close(created);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.serverError = 'Failed to create task. Try again.';
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
