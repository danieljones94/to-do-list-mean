import { Component, OnInit } from '@angular/core';
import { ListService } from '../../list.service';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Task } from '../../../../../api/db/models/task.model';
import { List } from '../../../../../api/db/models/list.model';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  lists: List[];
  tasks: Task[];
  constructor(
    private listService: ListService,
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log(params.listId);
      this.taskService.getTasks(params.listId).subscribe((rec: Task[]) => {
        this.tasks = rec;
      });
    });

    this.listService.getLists().subscribe((lists: List[]) => {
      this.lists = lists;
    });
  }

  onTaskClick(task: Task) {
    this.taskService.complete(task).subscribe(() => {
      console.log('Completed succesfully');
      task.completed = !task.completed;
    });
  }
}
