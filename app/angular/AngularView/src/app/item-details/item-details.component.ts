import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemsService } from '../model-service/items/items.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {

  item: any;

  itemForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ItemDetailsComponent>, 
    @Inject(MAT_DIALOG_DATA) public item_data: any, 
    private formBuilder: FormBuilder,
    private itemsService: ItemsService
    ) { }

  ngOnInit(): void {
    this.item = this.item_data['item'];

    this.itemForm = this.formBuilder.group({
      name: [this.item?this.item['name']:'',''],
      category: [this.item?this.item['category']:'',''],
      quantity: [this.item?this.item['quantity']:'',''],
      deposit: [this.item?this.item['deposit']:'',''],
      item_status: [this.item?this.item['item_status']:'',''],
      remarks: [this.item?this.item['remarks']:'','']
    });
  }

  getDialogTitle(){
    if(this.item_data.mode==="create"){
      return "Create Item";
    }else if(this.item_data.mode==="edit"){
      return "Edit Item";
    }
  }

  onSubmit(){
    this.dialogRef.close();
    if(this.item_data.mode==="create"){
      this.itemsService.createItem(this.itemForm.value).subscribe();
    }else if(this.item_data.mode==="edit"){
      this.itemsService.updateItem(this.item_data['item']['id'], this.itemForm.value).subscribe();
    }
  }
}
