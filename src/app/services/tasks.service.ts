import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../shared/constants/constants';
import { Task } from '../shared/models/models';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly ENDPOINT = `${API_URL}/tasks`;

  constructor(private http: HttpClient) {}

  create(data: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.ENDPOINT, data);
  }

  findAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.ENDPOINT);
  }

  findById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.ENDPOINT}/${id}`);
  }

  update(id: string, data: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.ENDPOINT}/${id}`, data);
  }

  delete(id: string): Observable<Task> {
    return this.http.delete<Task>(`${this.ENDPOINT}/${id}`);
  }
}
