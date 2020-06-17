import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmailTemplatesService } from './../model-service/emailtemplates/emailtemplates.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EmailTemplate } from './../model-service/emailtemplates/emailtemplates';
import { Component, Inject } from '@angular/core';
import { apiKey } from '../settings';

@Component({
  selector: 'app-template-detail-dialog',
  templateUrl: './template-detail.dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class TemplateDetailDialog {
  updateForm: FormGroup;

  isEdit: boolean;
  template: EmailTemplate;
  templateParams: any;

  apiKey = apiKey;

  constructor(
    private emailTemplatesService: EmailTemplatesService,
    public dialogRef: MatDialogRef<TemplateDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public params: any,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar
  ) {
    this.isEdit = params.isEdit;
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
    } else {
      this.template = null;
    }
  }

  send_data(data: any){
    if (this.isEdit) {
      this.emailTemplatesService.updateTemplate(this.template.id, data).subscribe();
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
