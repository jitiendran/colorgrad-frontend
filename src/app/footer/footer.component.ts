import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  Date: any;
  constructor() {}

  ngOnInit(): void {
    this.Date = new Date().getFullYear();
  }
}
