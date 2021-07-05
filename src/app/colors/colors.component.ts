import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ColorModel } from '../models/color.model';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
})
export class ColorsComponent implements OnInit {
  constructor(
    private Router: Router,
    private clipborad: ClipboardService,
    private snack: MatSnackBar,
    private apollo: Apollo
  ) {}

  Colors: ColorModel[] = [];
  Empty: boolean = false;

  ngOnInit(): void {
    const req = gql`
      query getColors {
        getColors {
          _id
          Colors
          Type
          UsedBy
        }
      }
    `;

    this.apollo
      .watchQuery<ColorModel>({
        query: req,
      })
      .valueChanges.subscribe((res: any) => {
        this.Colors = res.data.getColors;
        this.Empty = this.Colors.length === 0 ? true : false;
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
