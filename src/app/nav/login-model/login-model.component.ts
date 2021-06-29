import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-login-model',
  templateUrl: './login-model.component.html',
  styleUrls: ['./login-model.component.scss'],
})
export class LoginModelComponent implements OnInit {
  constructor(private apollo: Apollo, private router: Router) {}

  loginForm: FormGroup = new FormGroup({
    Username: new FormControl(null, Validators.required),
    Password: new FormControl(null, Validators.required),
  });

  ngOnInit(): void {}

  private LOGIN_QUERY = gql`
    query user_login($data: user_loginInput!) {
      user_login(data: $data) {
        Token
        RefreshToken
      }
    }
  `;

  onSubmit() {
    this.apollo
      .watchQuery<any>({
        query: this.LOGIN_QUERY,
        variables: {
          data: {
            Username: String(this.loginForm.value['Username']),
            Password: this.loginForm.value['Password'],
          },
        },
      })
      .valueChanges.subscribe(
        (result) => {
          console.log(result);
          this.router.navigateByUrl('/');
          this.apollo.client.clearStore();
          localStorage.setItem('token', result.data.user_login.Token);
          localStorage.setItem(
            'refreshToken',
            result.data.user_login.RefreshToken
          );
        },
        (err) => {
          console.error(err);
        }
      );
  }
}
