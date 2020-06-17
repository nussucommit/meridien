import { TemplateDetailDialog } from './template-detail.dialog';
import { MatDialog } from '@angular/material/dialog';
import { EmailTemplatesService } from './../model-service/emailtemplates/emailtemplates.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EmailTemplate } from './../model-service/emailtemplates/emailtemplates';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit {

  templates = new MatTableDataSource<EmailTemplate>();
  tableColumns: string[] = ['id', 'name'];

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  sort: MatSort;

  isDialogOpen: boolean;

  constructor(
    public dialog: MatDialog,
    private emailTemplatesService: EmailTemplatesService
  ) {
    this.isDialogOpen = false;
  }

  ngOnInit(): void {
    this.reloadData();
    this.templates.paginator = this.paginator;
    this.templates.sort = this.sort;
  }

  openNew() {
    if (!this.isDialogOpen) {
      this.isDialogOpen = true;
      const dialogRef = this.dialog.open(TemplateDetailDialog,
        { width: '600px',
          data: {
            isEdit: false
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
      );
  }

  reloadData() {
    this.emailTemplatesService.getTemplateList()
      .subscribe(
        (data: EmailTemplate[]) => {
          this.templates.data = data;
        }
      );
  }
}
