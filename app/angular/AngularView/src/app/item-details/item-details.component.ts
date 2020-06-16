import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemsService } from '../model-service/items/items.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private itemsService: ItemsService,
    private _snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.item = this.item_data['item'];

    this.itemForm = this.formBuilder.group({
      name: [this.item ? this.item['name'] : '', Validators.required],
      category: [this.item ? this.item['category'] : '', Validators.required],
      quantity: [this.item ? this.item['quantity'] : '', Validators.required],
      deposit: [this.item ? this.item['deposit'] : '', Validators.required],
      item_status: [this.item ? this.item['item_status'] : '', Validators.required],
      remarks: [this.item ? this.item['remarks'] : '', '']
    });
  }

  getDialogTitle() {
    if (this.item_data.mode === "create") {
      return "Create Item";
    } else if (this.item_data.mode === "edit") {
      return "Edit Item";
    }
  }

  onSubmit() {
    this.dialogRef.close();
    var data = this.itemForm.value;
    if (data.remarks.length === 0) {
      data.remarks = 'N/A';
    }
    if (this.item_data.mode === "create") {
      this.itemsService.createItem(data).subscribe();
      this._snackbar.open("New item created", "OK", {duration: 5000});
    } else if (this.item_data.mode === "edit") {
      this.itemsService.updateItem(this.item_data['item']['id'], data).subscribe();
      this._snackbar.open("Item "+this.item_data['item']['id']+" edited", 'OK', {duration: 5000});
    }
  }
}
