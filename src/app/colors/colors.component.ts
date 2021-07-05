import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ColorModel } from '../models/color.model';
import gql from 'graphql-tag';
import { Apollo, QueryRef } from 'apollo-angular';
import { ColorsService } from './colors.service';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
})
export class ColorsComponent implements OnInit {
  constructor(
    private router: Router,
    private clipborad: ClipboardService,
    private snack: MatSnackBar,
    private apollo: Apollo,
    private colorService: ColorsService
  ) {}

  Colors: ColorModel[] = [];
  FavouriteColors: ColorModel[] = [];
  queryRef: QueryRef<ColorModel>;
  queryRef1: QueryRef<ColorModel>;
  Empty: boolean = false;
  fEmpty: boolean = false;

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.reload());

    this.queryRef1 = this.colorService.getFavouriteColors();

    this.queryRef1.valueChanges.subscribe((res: any) => {
      console.log(res);
      this.FavouriteColors = res.data.getFavouriteColors;
      this.fEmpty =
        this.FavouriteColors && this.FavouriteColors.length === 0
          ? true
          : false;
    });

    const req = gql`
      query getColors {
        getColors {
          _id
          Colors
          Type
          UsedBy
          UserId
        }
      }
    `;

    this.queryRef = this.apollo.watchQuery<ColorModel>({
      query: req,
    });

    this.queryRef.valueChanges.subscribe((res: any) => {
      const arr: ColorModel[] = res.data.getColors;
      this.Colors = arr.slice().sort((a, b) => {
        return Number(b.UsedBy) - Number(a.UsedBy);
      });
      this.Empty = this.Colors.length === 0 ? true : false;
    });
  }

  reload() {
    this.queryRef1 = this.colorService.getFavouriteColors();

    this.queryRef1.valueChanges.subscribe((res: any) => {
      console.log(res);
      this.FavouriteColors = res.data.getFavouriteColors;
      this.fEmpty =
        this.FavouriteColors && this.FavouriteColors.length === 0
          ? true
          : false;
    });
    const req = gql`
      query getColors {
        getColors {
          _id
          Colors
          Type
          UsedBy
          UserId
        }
      }
    `;

    this.queryRef = this.apollo.watchQuery<ColorModel>({
      query: req,
    });

    this.queryRef.valueChanges.subscribe((res: any) => {
      const arr: ColorModel[] = res.data.getColors;
      this.Colors = arr.slice().sort((a, b) => {
        return Number(b.UsedBy) - Number(a.UsedBy);
      });
      this.Empty = this.Colors.length === 0 ? true : false;
    });
  }

  onCopy(color: String, id: String, userId: String) {
    this.clipborad.copyFromContent(String(color));
    this.snack.open('Copied to Clipboard !', '', {
      duration: 1000,
      panelClass: ['green-snackbar'],
    });

    this.colorService.copyColor(id, userId).subscribe((res: any) => {
      if (res.data.copyColors) {
        this.queryRef.refetch();
      }
    });
  }

  addFavourite(color: ColorModel) {
    this.colorService.addFavourite(color).subscribe((res: any) => {
      if (res.data.add_favouriteColor) {
        this.queryRef.refetch();
        this.queryRef1.refetch();
      }
    });
  }

  removeFavourite(id: String) {
    this.colorService.removeFavourite(id).subscribe((res: any) => {
      if (res.data.remove_favouriteColor) {
        this.queryRef.refetch();
        this.queryRef1.refetch();
      }
    });
  }

  checkFavourite(colors: String) {
    return this.FavouriteColors &&
      this.FavouriteColors.find((color) => color.Colors === colors)
      ? true
      : false;
  }
}
