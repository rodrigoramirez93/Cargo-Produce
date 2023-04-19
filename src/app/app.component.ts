import { Component } from '@angular/core';
import { TaskService } from './services/task.service';
import { Task } from './models/Task';
import { Observable, map, switchMap, tap, zip } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
    
  tasks$: Observable<Task[]> = new Observable<Task[]>; 
  tasksDone$: Observable<Task[]> = new Observable<Task[]>; 
  tasksActive$: Observable<Task[]> = new Observable<Task[]>; 
  tasksMinutesCount$: Observable<number> = new Observable<number>();

  constructor(private taskService: TaskService) {}

  ngOnInit(){
    this.taskService.getTasksAsync()
      .subscribe(tasks => this.taskService.setTasks(tasks))
    
    this.tasks$ = this.taskService.tasks$; 
    this.tasksDone$ = this.taskService.tasksDone$;
    this.tasksActive$ = this.taskService.tasksActive$;
    this.tasksMinutesCount$ = this.taskService.tasksMinutesCount$;
  }

  onNewTask(){

    var arr = this.taskService.getTasks.map(element => element.id);
    var max = Math.max(...arr);

    var task: Task = {
      id: max + 1,
      description: "",
      isDone: false,
      timeSpent: 0,
      started: false,
      progressBar: "█ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █",
    };

    this.taskService
      .createTaskAsync(task)
      .subscribe(() => 
        this.taskService.getTasksAsync()
          .subscribe(tasks => this.taskService.setTasks(tasks)));
  }
}
