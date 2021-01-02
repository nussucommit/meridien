import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component for confirmation dialog.
 */
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogSource: any
  ) { }

  ngOnInit(): void {
  }

  /**
   * Closes the dialog and sends the user's response back to parent component.
   * @param result User's response.
   */
  closeDialog(result: string){
    this.dialogRef.close({event: result});
  }
}
