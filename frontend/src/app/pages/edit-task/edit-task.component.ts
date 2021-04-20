import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent implements OnInit {
  listId: string;
  task = {
    id: '',
    title: '',
  };
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.listId = params.listId;
      this.task.id = params.taskId;
    });
  }

  updateTask(title: string) {
    this.taskService
      .updateTask(this.listId, this.task.id, title)
      .subscribe(() => {
        this.router.navigate(['/lists', this.listId]);
      });
  }
}
