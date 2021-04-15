import { Component, OnInit } from '@angular/core';
import { ListService } from '../../list.service';
import { Router } from '@angular/router';
import { List } from 'src/app/models/list.model';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss'],
})
export class NewListComponent implements OnInit {
  list = {
    title: '',
  };
  constructor(private listService: ListService, private router: Router) {}

  ngOnInit(): void {}

  createNewList(title) {
    return this.listService.createNewList(title).subscribe((response: List) => {
      console.log(response);
      this.list.title = '';
      this.router.navigate(['/lists', response._id]);
    });
  }
}
