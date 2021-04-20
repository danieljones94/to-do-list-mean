import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Task } from '../../../api/db/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private webReqService: WebRequestService) {}

  getTasks(listId: string) {
    return this.webReqService.get(`lists/${listId}/tasks`);
  }

  createNewTask(title: string, listId: string) {
    return this.webReqService.post(`lists/${listId}/tasks`, { title });
  }

  complete(task: Task) {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed,
    });
  }

  updateTask(listId: string, id: string, title: string) {
    return this.webReqService.patch(`lists/${listId}/tasks/${id}`, { title });
  }

  deleteTask(listId: string, id: string) {
    return this.webReqService.delete(`lists/${listId}/tasks/${id}`);
  }
}
