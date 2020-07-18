import { Booking } from './../model-service/bookings/bookings';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmailTemplatesService } from './../model-service/emailtemplates/emailtemplates.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EmailTemplate } from './../model-service/emailtemplates/emailtemplates';
import { Component, Inject } from '@angular/core';
import { apiKey } from '../settings';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template-detail-dialog',
  templateUrl: './template-detail.dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class TemplateDetailDialog {
  updateForm: FormGroup;

  isEdit: boolean;
  isSendingEmail: boolean;
  booking: Booking = null;
  template: EmailTemplate;
  templateParams: any;

  apiKey = apiKey;

  constructor(
    private emailTemplatesService: EmailTemplatesService,
    public dialogRef: MatDialogRef<TemplateDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public params: any,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.isEdit = params.isEdit;
    this.isSendingEmail = params.isSendingEmail;
    this.updateForm = this.formBuilder.group({
      name: '',
      subject: '',
      template: ''
    });
    if (this.isEdit) {
      this.template = params.template;
      this.templateParams = {...this.template};
      delete this.templateParams.id;
      this.updateForm.setValue(this.templateParams);
    } else if (this.isSendingEmail) {
      this.template = params.template;
      this.templateParams = {...this.template};
      this.booking = params.booking;

      delete this.templateParams.id;
      this.updateForm.setValue(this.templateParams);

      this.updateForm.get('name').disable();
      this.updateForm.get('subject').disable();
      this.updateForm.get('template').disable();
    } else {
      this.template = null;
    }
  }

  send_data(data: any){
    if (this.isEdit) {
      this.emailTemplatesService.updateTemplate(this.template.id, data).subscribe();
    } else if (this.isSendingEmail) {
      this.router.navigate(['/mailer'], { state: { booking: this.booking, template: data } });
    } else {
      this.emailTemplatesService.createTemplate(data).subscribe();
    }

    this.dialogRef.close();

    let snackbarString = '';
    if (this.isEdit) {
      snackbarString = 'Edited template';
    } else {
      snackbarString = 'Added template';
    }

    this.snackbar.open(snackbarString, 'OK', {duration: 5000, });
  }
}
