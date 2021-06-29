import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private apollo: Apollo
  ) {}
  Token: any;
  User: any;
  tokenAvailable = false;

  ngOnInit(): void {
    this.Token = localStorage.getItem('token');

    if (!this.Token) {
      this.tokenAvailable = false;
    } else {
      this.User = jwt_decode(this.Token);
      this.tokenAvailable = true;
    }
  }

  onLogin() {
    this.router.navigateByUrl('/login');
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }

  goHome() {
    this.router.navigateByUrl('/');
  }

  goFavouriteColors() {
    this.router.navigateByUrl('/favourite/colors');
  }

  goFavouriteGradients() {
    this.router.navigateByUrl('/favourite/gradients');
  }

  goContributedColors() {
    this.router.navigateByUrl('/contributions/colors');
  }

  goContributedGradients() {
    this.router.navigateByUrl('/contributions/gradients');
  }

  onProfile() {}

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.apollo.client.clearStore();
    this.tokenAvailable = false;
    window.location.replace('');
  }
}
