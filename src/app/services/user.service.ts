import jwt_decode from 'jwt-decode';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}
  private token: string = String(localStorage.getItem('token'));

  getUser() {
    return jwt_decode(this.token);
  }
}
