import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gradient',
  templateUrl: './gradient.component.html',
  styleUrls: ['./gradient.component.scss'],
})
export class GradientComponent implements OnInit {
  constructor(
    private Router: Router,
    private clipborad: ClipboardService,
    private snack: MatSnackBar
  ) {}

  test: any[] = [1, 2, 3, 4];

  ngOnInit(): void {}

  onCopy(color: string) {
    this.clipborad.copyFromContent(color);
    this.snack.open('Copied to Clipboard !', '', {
      duration: 1000,
      panelClass: ['green-snackbar'],
    });
  }

  onGo() {
    this.Router.navigateByUrl('/gradients');
  }

  setBackground() {
    return {
      'background-image': 'linear-gradient(to right, #fdc830, #f37335)',
    };
  }
}
