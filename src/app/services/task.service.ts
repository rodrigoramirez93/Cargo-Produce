import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject, filter, map, tap } from 'rxjs';
import { Task } from '../models/Task';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl

  constructor(private httpClient: HttpClient) {
    this.baseUrl = "http://localhost:3000/tasks";
  }
 
  private tasksSource$:BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  tasks$ = this.tasksSource$.asObservable();

  tasksDone$ = this.tasks$.pipe(map(tasks => tasks.filter(task => task.isDone)));
  tasksActive$ = this.tasks$.pipe(map(tasks => tasks.filter(task => !task.isDone)));
  tasksMinutesCount$ = this.tasks$.pipe(map(tasks => tasks.reduce((sum, current) => sum + current.timeSpent, 0)));

  public get getTasks(){
    return this.tasksSource$.value;
  }

  setTasks(tasks: Task[]){
    this.tasksSource$.next(tasks);
  }

  createTaskAsync(task: Task) {
    return this.httpClient.post<Task>(this.baseUrl, task);
  }

  getTasksAsync() {
    return this.httpClient.get<Task[]>(this.baseUrl);
  }

  getTaskAsync(id: number) {
    return this.httpClient.get<Task>(this.baseUrl + `/${id}`);
  }

  deleteTaskAsync(id: number) {
    console.log(this.baseUrl + `/${id}`);
    return this.httpClient.delete<Task>(this.baseUrl + `/${id}`);
  }

  updateTaskAsync(id: number, task: Task){
    return this.httpClient.put<Task>(this.baseUrl + `/${id}`, task);
  }
}
