import { Component, Input } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Observable, Subject, map, tap } from 'rxjs';
import { Task } from '../models/Task';

@Component({
  selector: 'app-timer-component',
  templateUrl: './timer-component.html',
  styleUrls: ['./timer-component.scss']
})

export class TimerComponent {

  @Input() id: number = 0;

  maxTime: number = 30;
  everyMinute: number = 60 * 1000;

  progressBar: string = "";
  fullBar: string = "█ ".repeat(this.maxTime);
  buttonClass: string = "button";

  task$: Observable<Task|undefined> = new Observable<Task|undefined>; 
  
  constructor(private taskService: TaskService) {}

  ngOnInit(){
    this.task$ = this.taskService.tasks$.pipe(map(tasks => tasks.find(task => task.id == this.id)));
  }
  
  onButtonMouseOver(id: number){
    var task = this.taskService.getTasks.find(x => x.id == id) as Task;
    if (task.started) 
      this.buttonClass = "button paused";
  }

  onDeleteTask(id: number){
    this.taskService
      .deleteTaskAsync(id)
      .pipe(tap(() => 
        this.taskService.getTasksAsync()
          .subscribe(tasks => this.taskService.setTasks(tasks))))
      .subscribe(() => console.log('Task has been deleted'));
  }

  onCompleteTask(id: number){
    var task = this.taskService.getTasks.find(x => x.id == id) as Task;
    task.isDone = true;

    this.taskService
      .updateTaskAsync(id, task)
      .pipe(tap(() => 
        this.taskService.getTasksAsync()
          .subscribe(tasks => this.taskService.setTasks(tasks))))
      .subscribe(() => console.log('Task has been set to done'));
  }
  
  onStart(id: number, started: boolean | undefined){

    var task = this.taskService.getTasks.find(task => task.id == id) as Task;
    task.started = started == undefined ? !task.started : started;

    this.taskService
      .updateTaskAsync(id, task)
      .pipe(tap(() => 
        this.taskService.getTasksAsync()
          .subscribe(tasks => this.taskService.setTasks(tasks))))
      .subscribe(() => console.log('Task has been set to done'));

    this.progressBar = this.calculateProgressBar(task.timeSpent);
    var timer = setTimeout(() => this.runTaskTimer(id, task), this.everyMinute);

    if (!task.started){
      clearTimeout(timer);
      return;
    }
  }

  runTaskTimer(id:number, task: Task) {
    task.timeSpent = task.timeSpent + 1;
    task.progressBar = this.calculateProgressBar(task.timeSpent);

    this.taskService
      .updateTaskAsync(id, task)
      .pipe(tap(() => 
        this.taskService.getTasksAsync()
          .subscribe(tasks => this.taskService.setTasks(tasks))))
      .subscribe(() => console.log('task time spent updated'));
  }

  calculateProgressBar(timeSpent: number): string {
    return timeSpent >= 30 ?
      "More than 30 minutes... 👀" :
      this.fullBar.substring(0, this.fullBar.length - (timeSpent * 2));
  }

  onEnterDescription(id:number, $event: any){
    let input = ($event.srcElement.value);
    if (input.trim() === '')
      return;
      
    var task = this.taskService.getTasks.find(x => x.id == id) as Task;
    task.description = input;
    this.taskService
      .updateTaskAsync(id, task)
      .pipe(tap(() => 
        this.taskService.getTasksAsync()
          .subscribe(tasks => this.taskService.setTasks(tasks))))
      .subscribe(() => console.log('Task name updated'));
  }
}