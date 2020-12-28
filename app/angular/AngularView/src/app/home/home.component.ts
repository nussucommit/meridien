import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IssueService } from '../model-service/issue/issue.service';
import { FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
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
      email: ['', [Validators.required, this.emailCheck]],
      detail: ['', Validators.required]
    });
  }

  @ViewChild('target') private myScrollContainer: ElementRef;

  emailCheck(control: AbstractControl): any {
    return new RegExp('e[0-9]{7}@u\.nus\.edu').test(control.value) ? null : { email: true };
  }

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
