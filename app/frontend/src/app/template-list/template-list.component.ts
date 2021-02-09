import { TemplateDetailDialog } from './template-detail.dialog';
import { MatDialog } from '@angular/material/dialog';
import { EmailTemplatesService } from './../model-service/emailtemplates/emailtemplates.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EmailTemplate } from './../model-service/emailtemplates/emailtemplates';
import { Component, OnInit, ViewChild } from '@angular/core';

import { ConfirmationDetailDialog } from './confirmation-detail.dialog';
import { ConfirmationTemplatesService } from './../model-service/confirmationtemplates/confirmationtemplates.service';
import { ConfirmationTemplate } from './../model-service/confirmationtemplates/confirmationtemplates';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit {

  templates = new MatTableDataSource<EmailTemplate>();
  tableColumns: string[] = ['id', 'name'];
  isSendingEmail = false;

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  sort: MatSort;

  isDialogOpen: boolean;

  confirmationTemplates = new MatTableDataSource<ConfirmationTemplate>();
  confirmationTableColumns: string[] = ['id', 'name'];

  constructor(
    public dialog: MatDialog,
    private emailTemplatesService: EmailTemplatesService,
    private confirmationTemplatesService: ConfirmationTemplatesService
  ) {
    this.isDialogOpen = false;
  }

  ngOnInit(): void {
    if (history.state.booking) {
      this.isSendingEmail = true;
    }
    this.reloadData();
    this.templates.paginator = this.paginator;
    this.templates.sort = this.sort;
    // Added here
    this.confirmationTemplates.paginator = this.paginator;
    this.confirmationTemplates.sort = this.sort;
  }

  openNew() {
    if (!this.isDialogOpen) {
      this.isDialogOpen = true;
      const dialogRef = this.dialog.open(TemplateDetailDialog,
        { width: '800px',
          data: {
            isNew: true
          }
        });
      dialogRef.afterClosed().subscribe(() => {
        this.reloadData();
        this.isDialogOpen = false;
      });
    }
  }

  openDetail(row: { [x: string]: number; }) {
    this.emailTemplatesService.getTemplateById(row.id)
      .subscribe(
        (data: EmailTemplate) => {
          if (!this.isDialogOpen) {
            this.isDialogOpen = true;
            if (this.isSendingEmail) {
              const dialogRef = this.dialog.open(TemplateDetailDialog,
                { width: '1200px',
                  data: {
                    isEdit: false,
                    isSendingEmail: this.isSendingEmail,
                    template: data,
                    booking: history.state.booking
                  }
                });
              dialogRef.afterClosed().subscribe(() => {
                this.reloadData();
                this.isDialogOpen = false;
              });
            } else {
              const dialogRef = this.dialog.open(TemplateDetailDialog,
                { width: '800px',
                  data: {
                    isEdit: true,
                    template: data
                  }
                });
              dialogRef.afterClosed().subscribe(() => {
                this.reloadData();
                this.isDialogOpen = false;
              });
            }
          }
        }
      );
  }

  openConfirmationDetail(row: { [x: string]: number; }) {
    this.confirmationTemplatesService.getConfirmationTemplateById(row.id)
      .subscribe(
        (data: ConfirmationTemplate) => {
          if (!this.isDialogOpen) {
            this.isDialogOpen = true;
            const dialogRef = this.dialog.open(ConfirmationDetailDialog,
              { width: '800px',
                data: {
                  isEdit: true,
                  confirmationTemplate: data
                }
              });
            dialogRef.afterClosed().subscribe(() => {
              this.reloadData();
              this.isDialogOpen = false;
            });
          }
        }
      );
  }

  reloadData() {
    this.emailTemplatesService.getTemplateList()
      .subscribe(
        (data: EmailTemplate[]) => {
          this.templates.data = data;
        }
      );
    this.confirmationTemplatesService.getConfirmationTemplateList()
        .subscribe(
          (data: ConfirmationTemplate[]) => {
            this.confirmationTemplates.data = data;
          }
        )
  }
}
