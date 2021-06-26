import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  constructor() {}

  favourite: Boolean = false;
  contribute: Boolean = false;

  ngOnInit(): void {}

  onFavourite() {
    this.contribute = false;
    this.favourite = !this.favourite;
  }

  onContribute() {
    this.favourite = false;
    this.contribute = !this.contribute;
  }
}
