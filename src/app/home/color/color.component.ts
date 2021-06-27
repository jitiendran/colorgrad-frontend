import { ColorModel } from './../../models/color.model';
import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
})
export class ColorComponent implements OnInit {
  popularColors: ColorModel[] = [];
  test: any[] = [1, 2, 3, 4, 5, 6, 7];

  constructor(
    private Router: Router,
    private clipborad: ClipboardService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onCopy(color: string) {
    this.clipborad.copyFromContent(color);
    this.snack.open('Copied to Clipboard !', '', {
      duration: 1000,
      panelClass: ['green-snackbar'],
    });
  }

  onGo() {
    this.Router.navigateByUrl('/colors');
  }
}
