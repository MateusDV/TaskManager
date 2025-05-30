import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {computed, Injectable, signal} from '@angular/core';
import { Task } from '../../models/task/task';
import {catchError, tap, throwError} from 'rxjs';
import {ResponseUtils} from '../../utils/response.utils';
import TaskAdapter from '../../utils/adapters/task.adapter';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private tasksSignal = signal<Task[]>([]);
  private errorSignal = signal<string | null>(null);

  tasks = computed(() => this.tasksSignal());
  error = computed(() => this.errorSignal());

  constructor(private http: HttpClient) { }

  async getAll(){
    const request = this.http.get<Task[]>("http://localhost:3000/tasks")
      .pipe(
        tap(response => {
          this.tasksSignal.set(response);
        }),
        catchError((error: HttpErrorResponse) => {
          this.tasksSignal.set([]);
          return throwError(() => error);
        })
      );

    await ResponseUtils.didRequestCompleteSuccessfully(request);

    return this.tasks();
  }

  async add(task: Task){
    const dto = TaskAdapter.toTaskCreateDTO(task);
    const request = this.http.post("http://localhost:3000/tasks", dto);
    return ResponseUtils.didRequestCompleteSuccessfully(request);
  }

  async edit(task: Task){
    const request = this.http.put(`http://localhost:3000/tasks/${task.id}`, task);
    return ResponseUtils.didRequestCompleteSuccessfully(request);
  }

  async delete(task: Task){
    const request = this.http.delete(`http://localhost:3000/tasks/${task.id}`);
    return ResponseUtils.didRequestCompleteSuccessfully(request);
  }
}
