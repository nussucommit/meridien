import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemsService } from '../model-service/items/items.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Component for the item form.
 */
@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {

  item: any;

  itemForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ItemDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public itemData: any,
    private formBuilder: FormBuilder,
    private itemsService: ItemsService,
    private snackbar: MatSnackBar
  ) { }

  /**
   * Initializes the item form.
   */
  ngOnInit(): void {
    this.item = this.itemData.item;

    const choice = this.item.item_status === 'Active'

    this.itemForm = this.formBuilder.group({
      name: [this.item ? this.item.name : '', Validators.required],
      category: [this.item ? this.item.category : '', Validators.required],
      quantity: [this.item ? this.item.quantity : '', [Validators.required, Validators.min(0)]],
      deposit: [this.item ? this.item.deposit : '', [Validators.required, Validators.min(0)]],
      item_status: [this.item? this.item.item_status : true, ''],
      remarks: [this.item ? this.item.remarks : '', '']
    });
  }

  nonNegativeNumberCheck(control: AbstractControl): any{
    return new RegExp('^\d+$').test(control.value) ? null : { number: true };
  }

  /**
   * Returns data based on the user's intention on whether to edit or create an item
   */
  getDialogTitle() {
    if (this.itemData.mode === 'create') {
      return 'Create Item';
    } else if (this.itemData.mode === 'edit') {
      return 'Edit Item';
    }
  }

  /**
   * Process the user input once the submit button is clicked.
   */
  onSubmit() {
    this.dialogRef.close();
    const data = this.itemForm.value;
    data.item_status = data.item_status ? 'Active' : 'Inactive';
    if (data.remarks.length === 0) {
      data.remarks = 'N/A';
    }
    if (this.itemData.mode === 'create') {
      this.itemsService.createItem(data).subscribe();
      this.snackbar.open('New item created', 'OK', { duration: 5000 });
    } else if (this.itemData.mode === 'edit') {
      this.itemsService.updateItem(this.itemData.item.id, data).subscribe();
      this.snackbar.open('Item ' + this.itemData.item.id + ' edited', 'OK', { duration: 5000 });
    }
  }
}
