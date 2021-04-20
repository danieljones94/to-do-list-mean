import { Component, OnInit } from '@angular/core';
import { ListService } from '../../list.service';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
  selectedListId: string;
  constructor(
    private listService: ListService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params.listId) {
        this.selectedListId = params.listId;
        this.taskService.getTasks(params.listId).subscribe((rec: Task[]) => {
          this.tasks = rec;
        });
      } else {
        this.tasks = undefined;
      }
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

  onDeleteListClick() {
    this.listService.deleteList(this.selectedListId).subscribe(() => {
      console.log('Deleted succesfully');
      this.router.navigate(['lists/']);
    });
  }

  onDeleteTaskClick(id: string) {
    this.taskService.deleteTask(this.selectedListId, id).subscribe(() => {
      this.tasks = this.tasks.filter((value) => value._id !== id);
      console.log('Deleted succesfully');
    });
  }
}
