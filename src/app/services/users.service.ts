// src/app/services/users.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly API_URL = 'http://localhost:5000/users'; // или твой production backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  create(payload: FormData | Partial<User>): Observable<User> {
    return this.http.post<User>(this.API_URL, payload);
  }

  update(id: string, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/${id}`, user);
  }

  delete(id: string): Observable<User> {
    return this.http.delete<User>(`${this.API_URL}/${id}`);
  }

  assignTask(userId: string, taskId: string): Observable<User> {
    return this.http.patch<User>(
      `${this.API_URL}/${userId}/tasks/${taskId}`,
      {}
    );
  }
}
