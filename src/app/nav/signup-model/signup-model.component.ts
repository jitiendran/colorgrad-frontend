import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
    Password: new FormControl(null, Validators.required),
  });

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.signupForm.value);
  }
}
