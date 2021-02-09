import { environment } from './../../environments/environment';
import { Booking } from './../model-service/bookings/bookings';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmationTemplatesService } from './../model-service/confirmationtemplates/confirmationtemplates.service';
import { FormGroup, FormBuilder} from '@angular/forms';
import { ConfirmationTemplate } from './../model-service/confirmationtemplates/confirmationtemplates';
import { Component} from '@angular/core';

@Component({
  selector: 'app-confirmation-detail-dialog',
  templateUrl: './confirmation-detail.dialog.html',
})
export class ConfirmationDetailDialog {
  confirmationMailForm: FormGroup;
  
  isNew: boolean;
  isEdit: boolean;
  isSendingEmail: boolean;
  booking: Booking = null;
  template: ConfirmationTemplate;
  templateParams: any;

  apiKey = environment.apiKey;;

  constructor(
    public dialog: MatDialog,
    private confirmationTemplatesService: ConfirmationTemplatesService,
    public dialogRef: MatDialogRef<ConfirmationDetailDialog>,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar
  ) {
    this.confirmationMailForm = this.formBuilder.group({
      link_string: '',
      subject: '',
      template: ''
    });
    this.confirmationTemplatesService.getConfirmationTemplate()
      .subscribe(
        (template: ConfirmationTemplate) => {
          delete template.id;
          this.confirmationMailForm.setValue(template);
        },
        (err) => {
        }
      );
  }

  create_or_update(data: any) {
    this.confirmationTemplatesService.updateTemplate(data).subscribe();
    this.closeDialog();
    this.snackbar.open('Updated confirmation template', 'OK', {duration: 5000, });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
