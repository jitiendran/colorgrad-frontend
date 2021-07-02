import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  @Input() UserDetails: any;

  constructor() {}

  ngOnInit(): void {
    console.log(this.UserDetails);
  }
}