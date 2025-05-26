import { API_URL } from './../../../shared/constants/constants';
import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../shared/models/models';
import { UsersService } from '../../../services/users.service';
import { AppModalComponent } from '../../../shared/components/app-modal/app-modal.component';

@Component({
  standalone: true,
  selector: 'app-user-info-modal',
  templateUrl: './user-info-modal.component.html',
  styleUrls: ['./user-info-modal.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatIconModule, AppModalComponent],
})
export class UserInfoModalComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  apiUrl = API_URL;
  form: FormGroup;
  avatarPreview: string | null;
  loading = false;
  serverError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserInfoModalComponent, Partial<User> | null>,
    @Inject(MAT_DIALOG_DATA) public user: User,
    private usersService: UsersService,
  ) {
    this.avatarPreview = user.avatar ?? null;

    this.form = this.fb.group({
      email: [user.email, [Validators.required, Validators.email, Validators.minLength(5)]],
      name: [user.name, [Validators.required, Validators.minLength(2)]],
      avatar: [null],
    });
  }

  pickAvatar(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(evt: Event): void {
    const file = (evt.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.form.patchValue({ avatar: file });
    this.form.get('avatar')!.markAsDirty();
    this.form.markAsDirty();

    const reader = new FileReader();
    reader.onload = () => (this.avatarPreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  deleteUser(): void {
    if (this.loading) return;

    if (!confirm(`Delete user “${this.user.name}”?`)) return;

    this.loading = true;
    this.serverError = null;

    this.usersService.delete(this.user._id!).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close({ deleted: true, _id: this.user._id });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.serverError = 'Failed to delete user. Try again.';
      },
    });
  }

  submit(): void {
    if (this.form.invalid || !this.form.dirty || this.loading) return;

    this.loading = true;
    this.serverError = null;

    const fd = new FormData();
    fd.append('email', this.form.value.email);
    fd.append('name', this.form.value.name);
    if (this.form.value.avatar) fd.append('avatar', this.form.value.avatar);

    this.usersService.update(this.user._id!, fd).subscribe({
      next: (updated) => {
        this.loading = false;
        this.dialogRef.close(updated);
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
        this.serverError = 'Failed to update user. Try again.';
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
