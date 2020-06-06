import { UsersService } from './../model-service/users/users.service';
import { LoginService } from './../model-service/users/login.service';
import { Token } from './../model-service/users/tokens';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private loginService: LoginService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.loginService.login({
      username: this.form.username.value,
      password: this.form.password.value
    })
      .subscribe((data: Token) => {
        this.usersService.setUser({
          username: this.form.username.value,
          token: data
        });
        console.log(this.usersService.getUser());
      });
  }

}
