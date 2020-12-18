import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IssueService } from '../model-service/issue/issue.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  issue: any;

  issueForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private issueService: IssueService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.issueForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      detail: ['', Validators.required]
    });
  }

  @ViewChild('target') private myScrollContainer: ElementRef;

  goToBottom(){
    window.scrollTo(0, document.body.scrollHeight);
  }

  onSubmit() {
    const data = this.issueForm.value;
    console.log(data);
    this.issueService.createIssue(data).subscribe();
    this.snackbar.open('New issue submitted', 'OK', { duration: 5000 });
  }
}
