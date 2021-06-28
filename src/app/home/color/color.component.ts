import { ColorModel } from './../../models/color.model';
import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
})
export class ColorComponent implements OnInit {
  popularColors: ColorModel[] = [];

  constructor(
    private Router: Router,
    private apollo: Apollo,
    private clipborad: ClipboardService,
    private snack: MatSnackBar
  ) {}

  private POPULAR_COLOR_QUERY = gql`
    query getPopularColors {
      getPopularColors {
        _id
        Colors
        Type
        UsedBy
      }
    }
  `;

  ngOnInit(): void {
    this.apollo
      .watchQuery({
        query: this.POPULAR_COLOR_QUERY,
      })
      .valueChanges.subscribe((result: any) => {
        console.log(result);
        this.popularColors = result.data.getPopularColors;

        this.popularColors = this.popularColors.slice().sort((a, b) => {
          return Number(b.UsedBy) - Number(a.UsedBy);
        });

        this.popularColors = this.popularColors.slice(0, 7);
      });
  }

  onCopy(color: String) {
    this.clipborad.copyFromContent(String(color));
    this.snack.open('Copied to Clipboard !', '', {
      duration: 1000,
      panelClass: ['green-snackbar'],
    });
  }

  onGo() {
    this.Router.navigateByUrl('/colors');
  }
}
