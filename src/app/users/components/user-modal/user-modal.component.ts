import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../services/users.service';
import { MatIconModule } from '@angular/material/icon';
import { AppModalComponent } from '../../../shared/components/app-modal/app-modal.component';

@Component({
  standalone: true,
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatIconModule, AppModalComponent],
})
export class UserModalComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  form: FormGroup;
  avatarPreview: string | null = null;
  loading = false;
  serverError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usersService: UsersService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      name: ['', Validators.required],
      avatar: [null],
    });
  }

  pickAvatar() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.form.patchValue({ avatar: file });
    this.form.get('avatar')!.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => (this.avatarPreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  submit() {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    this.serverError = null;

    const fd = new FormData();
    fd.append('email', this.form.value.email);
    fd.append('name', this.form.value.name);
    if (this.form.value.avatar) fd.append('avatar', this.form.value.avatar);

    this.usersService.create(fd).subscribe({
      next: (createdUser) => {
        this.loading = false;
        this.dialogRef.close(createdUser);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.serverError = 'Failed to create user. Try again.';
      },
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
