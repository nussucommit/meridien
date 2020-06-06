import { Injectable } from '@angular/core';
import { User } from './users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private user = null;

  constructor() { }

  getUser() {
    return this.user;
  }

  setUser(user: User) {
    this.user = user;
  }
}
