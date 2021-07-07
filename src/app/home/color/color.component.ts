import { ColorModel } from './../../models/color.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ColorsService } from 'src/app/colors/colors.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
  animations: [
    trigger('SlideLeft', [
      transition('void => *', [
        style({ marginLeft: '-5em' }),
        animate('1.3s ease-out'),
      ]),
    ]),
  ],
})
export class ColorComponent implements OnInit, OnDestroy {
  popularColors: ColorModel[] = [];
  isLoggedIn: boolean = false;

  private FavouriteColors: ColorModel[];
  private queryRef: QueryRef<ColorModel>;
  private queryRef1: QueryRef<ColorModel>;
  private subscription: Subscription;
  private subscription1: Subscription;

  constructor(
    private Router: Router,
    private apollo: Apollo,
    private clipborad: ClipboardService,
    private snack: MatSnackBar,
    private colorService: ColorsService
  ) {}

  private POPULAR_COLOR_QUERY = gql`
    query getPopularColors {
      getPopularColors {
        _id
        Colors
        Type
        UsedBy
        UserId
      }
    }
  `;

  load(): void {
    this.queryRef1 = this.colorService.getFavouriteColors();

    this.subscription1 = this.queryRef1.valueChanges
      .pipe(map((res: any) => res.data.getFavouriteColors))
      .subscribe((data: ColorModel[]) => (this.FavouriteColors = data));

    this.queryRef = this.apollo.watchQuery({
      query: this.POPULAR_COLOR_QUERY,
    });

    this.subscription = this.queryRef.valueChanges
      .pipe(
        map((res: any) => res.data.getPopularColors.slice().splice(0, 7)),
        map((data: ColorModel[]) =>
          data.slice().sort((a, b) => {
            return Number(b.UsedBy) - Number(a.UsedBy);
          })
        )
      )
      .subscribe((data) => {
        this.popularColors = data;
      });

    if (localStorage.getItem('token')) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  ngOnInit(): void {
    this.Router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.load();
      });
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

  onGo(): void {
    this.Router.navigateByUrl('/colors');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription1.unsubscribe();
  }
}
