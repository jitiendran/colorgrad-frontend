import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-signup-model',
  templateUrl: './signup-model.component.html',
  styleUrls: ['./signup-model.component.scss'],
  animations: [
    trigger('Above', [
      transition('void => *', [
        style({ marginTop: '-7em' }),
        animate('1.2s ease-in-out'),
      ]),
    ]),
  ],
})
export class SignupModelComponent implements OnInit {
  signupForm: FormGroup = new FormGroup({
    Username: new FormControl(null, Validators.required),
    Email: new FormControl(null, [Validators.required, Validators.email]),
    Password: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
    ]),
  });

  loading: boolean = false;
  Error: boolean = false;

  constructor(private apollo: Apollo, private router: Router) {}

  private ADD_USER_QUERY: DocumentNode = gql`
    mutation user_register($data: user_registerInput!) {
      user_register(data: $data) {
        Token
        RefreshToken
      }
    }
  `;

  private CHECK_USERNAME_QUERY: DocumentNode = gql`
    query check_username($data: check_usernameInput!) {
      check_username(data: $data)
    }
  `;

  check(Username: String) {
    return this.apollo.watchQuery<Boolean>({
      query: this.CHECK_USERNAME_QUERY,
      variables: {
        data: {
          Username,
        },
      },
    });
  }

  ngOnInit(): void {}

  onChange(event: any) {
    this.Error = false;
    const Username = event.target.value;
    this.check(Username)
      .valueChanges.pipe(map((res: any) => res.data.check_username))
      .subscribe((data) => (this.Error = data));
  }

  onSubmit() {
    const { Username, Password, Email } = this.signupForm.value;

    this.loading = true;

    this.apollo
      .mutate<any>({
        mutation: this.ADD_USER_QUERY,
        variables: {
          data: {
            Username,
            Password,
            Email,
          },
        },
      })
      .pipe(map((res) => res.data.user_register))
      .subscribe((data) => {
        this.apollo.client.clearStore();
        localStorage.setItem('token', data.Token);
        localStorage.setItem('refreshToken', data.RefreshToken);
        setTimeout(() => {
          this.loading = false;
          this.router.navigateByUrl('/');
        }, 2500);
      });
  }
}
