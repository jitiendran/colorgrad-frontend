import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-login-model',
  templateUrl: './login-model.component.html',
  styleUrls: ['./login-model.component.scss'],
  animations: [
    trigger('Above', [
      transition('void => *', [
        style({ marginTop: '-7em' }),
        animate('1.2s ease-in-out'),
      ]),
    ]),
  ],
})
export class LoginModelComponent implements OnInit {
  constructor(private apollo: Apollo, private router: Router) {}

  loginForm: FormGroup = new FormGroup({
    Username: new FormControl(null, Validators.required),
    Password: new FormControl(null, Validators.required),
  });

  loading: boolean = false;
  Error: String;
  UsernameError: String;
  PasswordError: String;

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
          this.loading = true;
          this.apollo.client.clearStore();

          localStorage.setItem('token', result.data.user_login.Token);
          localStorage.setItem(
            'refreshToken',
            result.data.user_login.RefreshToken
          );
          setTimeout(() => {
            this.loading = result.loading;
            this.router.navigateByUrl('/');
          }, 4000);
        },
        (err) => {
          this.UsernameError = '';
          this.PasswordError = '';
          const inst1: String[] = String(err).split('\n');
          const inst2: String[] = inst1[0].split(':');
          this.Error = inst2[1].trim();

          this.Error.match('Username')
            ? (this.UsernameError = this.Error)
            : (this.PasswordError = this.Error);
        }
      );
  }
}
