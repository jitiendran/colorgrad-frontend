import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginModelComponent } from './login-model/login-model.component';
import { SignupModelComponent } from './signup-model/signup-model.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  constructor(public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {}

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
}
