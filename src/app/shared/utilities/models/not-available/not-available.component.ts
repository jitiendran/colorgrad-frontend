import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'not-available',
  templateUrl: './not-available.component.html',
  styleUrls: ['./not-available.component.scss'],
})
export class NotAvailableComponent implements OnInit {
  @Input() text: String;
  @Input() condition: Boolean;

  constructor() {}

  ngOnInit(): void {}
}
