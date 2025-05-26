import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../shared/models/models';
import { Observable } from 'rxjs';
import { API_URL } from '../shared/constants/constants';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly API_URL = API_URL + '/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  create(payload: FormData): Observable<User> {
    return this.http.post<User>(this.API_URL, payload);
  }

  update(id: string, user: FormData): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/${id}`, user);
  }

  delete(id: string): Observable<User> {
    return this.http.delete<User>(`${this.API_URL}/${id}`);
  }

  assignTask(userId: string, taskId: string): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/${userId}/tasks/${taskId}`, {});
  }
}
