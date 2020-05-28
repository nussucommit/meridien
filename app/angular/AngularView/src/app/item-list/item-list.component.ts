import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ItemsService } from '../model-service/items/items.service';
import { Items } from '../model-service/items/items';

import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  
  items = new MatTableDataSource<Items>();
  tableColumns: string[] = ['id', 'name', 'category', 'quantity', 'deposit', 'status', 'remark'];

  constructor(private itemsService: ItemsService) { }

  ngOnInit() {
    this.reloadData();
  }
  
  deleteItems() {
    this.itemsService.deleteAll()
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log('ERROR: '+error));
  }
  
  reloadData() {
    this.itemsService.getItemsList()
      .subscribe(
        data => {
          this.items.data = data;
        });
  }
  
  applyFilter(filterValue: string) {
    this.items.filterPredicate = 
      (data: Items, filter: string) => data.name.indexOf(filter) != -1;
    this.items.filter = filterValue.trim().toLowerCase();
  }
}
