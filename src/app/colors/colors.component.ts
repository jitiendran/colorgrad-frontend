import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { ColorModel } from '../models/color.model';
import gql from 'graphql-tag';
import { Apollo, QueryRef } from 'apollo-angular';
import { ColorsService } from './colors.service';
import { Subscription } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
  animations: [
    trigger('FadeIn', [
      transition('void => *', [
        style({ marginTop: '-15em' }),
        animate('1.6s ease-out'),
      ]),
    ]),
  ],
})
export class ColorsComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private clipborad: ClipboardService,
    private snack: MatSnackBar,
    private apollo: Apollo,
    private colorService: ColorsService
  ) {}

  Colors: ColorModel[] = [];
  Empty: boolean = false;
  loaded: boolean = false;
  Searched: string = '';

  type = ['All', 'red', 'blue', 'green', 'yellow', 'violet', 'pink', 'orange'];

  private FavouriteColors: ColorModel[] = [];
  private queryRef: QueryRef<ColorModel>;
  private queryRef1: QueryRef<ColorModel>;
  private subscription: Subscription;
  private subscription1: Subscription;

  private GET_COLORS_QUERY = gql`
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

  load(): void {
    this.loaded = true;
    this.queryRef1 = this.colorService.getFavouriteColors();

    this.subscription1 = this.queryRef1.valueChanges
      .pipe(map((res: any) => res.data.getFavouriteColors))
      .subscribe((data: ColorModel[]) => {
        this.FavouriteColors = data;
      });

    this.queryRef = this.apollo.watchQuery<ColorModel>({
      query: this.GET_COLORS_QUERY,
    });

    this.subscription = this.queryRef.valueChanges
      .pipe(
        map((res: any) => res.data.getColors),
        map(
          (data: ColorModel[]) =>
            (data = data.slice().sort((a, b) => {
              return Number(b.UsedBy) - Number(a.UsedBy);
            }))
        )
      )
      .subscribe((data: ColorModel[]) => {
        this.Colors = data;
        setTimeout(() => {
          this.loaded = false;
        }, 1000);
        this.Empty = this.Colors.length === 0;
      });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.load());

    this.load();
  }

  onCopy(color: String, id: String, userId: String): void {
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

  addFavourite(color: ColorModel): void {
    this.colorService.addFavourite(color).subscribe((res: any) => {
      if (res.data.add_favouriteColor) {
        this.queryRef.refetch();
        this.queryRef1.refetch();
      }
    });
  }

  removeFavourite(id: String): void {
    this.colorService.removeFavourite(id).subscribe((res: any) => {
      if (res.data.remove_favouriteColor) {
        this.queryRef.refetch();
        this.queryRef1.refetch();
      }
    });
  }

  checkFavourite(colors: String): Boolean {
    return this.FavouriteColors &&
      this.FavouriteColors.find((color) => color.Colors === colors)
      ? true
      : false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription1.unsubscribe();
  }
}
