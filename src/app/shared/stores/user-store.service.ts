import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/models';
import { UsersService } from '../../services/users.service';

@Injectable({ providedIn: 'root' })
export class UserStoreService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(private usersService: UsersService) {}

  load(): void {
    this.usersService.getAll().subscribe({
      next: (users) => this.usersSubject.next(users),
      error: (err) => console.error('User load error:', err),
    });
  }

  set(users: User[]): void {
    this.usersSubject.next(users);
  }

  get value(): User[] {
    return this.usersSubject.getValue();
  }
}
