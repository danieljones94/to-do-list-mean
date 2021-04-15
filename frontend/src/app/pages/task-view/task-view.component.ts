import { Component, OnInit } from '@angular/core';
import { ListService } from '../../list.service';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  lists: any[];
  tasks: any[];
  constructor(
    private listService: ListService,
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log(params.listId);
      this.taskService.getTasks(params.listId).subscribe((rec: any) => {
        this.tasks = rec;
      });
    });

    this.listService.getLists().subscribe((lists: any[]) => {
      this.lists = lists;
    });
  }
}
