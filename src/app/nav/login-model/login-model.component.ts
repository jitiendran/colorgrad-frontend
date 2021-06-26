import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-model',
  templateUrl: './login-model.component.html',
  styleUrls: ['./login-model.component.scss'],
})
export class LoginModelComponent implements OnInit {
  constructor() {}

  loginForm: FormGroup = new FormGroup({
    Username: new FormControl(null, Validators.required),
    Password: new FormControl(null, Validators.required),
  });

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.loginForm.value);
  }
}
