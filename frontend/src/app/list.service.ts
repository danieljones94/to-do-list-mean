import { Injectable } from '@angular/core';

import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  constructor(private webReqService: WebRequestService) {}

  createNewList(title: string) {
    return this.webReqService.post('lists', { title });
  }

  getLists() {
    return this.webReqService.get('lists');
  }
}
