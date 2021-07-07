import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { GradientModel } from '../models/gradient.model';
import { GradientsService } from './gradients.service';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-gradients',
  templateUrl: './gradients.component.html',
  styleUrls: ['./gradients.component.scss'],
  animations: [
    trigger('FadeIn', [
      transition('void => *', [
        style({ marginTop: '-7em' }),
        animate('1.6s ease-out'),
      ]),
    ]),
  ],
})
export class GradientsComponent implements OnInit, OnDestroy {
  constructor(
    private Router: Router,
    private clipborad: ClipboardService,
    private snack: MatSnackBar,
    private apollo: Apollo,
    private gradientServie: GradientsService
  ) {}

  Gradients: GradientModel[] = [];
  Empty: boolean = false;
  loaded: boolean = false;
  Searched: string = '';

  type = ['All', 'red', 'blue', 'green', 'yellow', 'violet', 'pink', 'orange'];

  private FavouriteGradients: GradientModel[] = [];
  private queryRef1: QueryRef<GradientModel>;
  private queryRef2: QueryRef<GradientModel>;
  private subscription1: Subscription;
  private subscription2: Subscription;

  private GET_GRADIENTS_QUERY = gql`
    query getGradients {
      getGradients {
        _id
        Colors
        Type
        Direction
        UsedBy
        UserId
      }
    }
  `;

  load(): void {
    this.loaded = true;
    this.queryRef1 = this.gradientServie.getFavouriteGradients();

    this.subscription1 = this.queryRef1.valueChanges
      .pipe(map((res: any) => res.data.getFavouriteGradients))
      .subscribe((data: GradientModel[]) => {
        this.FavouriteGradients = data;
        this.Empty = this.FavouriteGradients.length === 0;
      });

    this.queryRef2 = this.apollo.watchQuery<GradientModel>({
      query: this.GET_GRADIENTS_QUERY,
    });

    this.subscription2 = this.queryRef2.valueChanges
      .pipe(
        map((res: any) => res.data.getGradients),
        map((data: GradientModel[]) =>
          data.slice().sort((a, b) => {
            return Number(b.UsedBy) - Number(a.UsedBy);
          })
        )
      )
      .subscribe((data: GradientModel[]) => {
        this.Gradients = data;
        setTimeout(() => (this.loaded = false), 1000);
      });
  }

  ngOnInit(): void {
    this.Router.events
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
    this.gradientServie.copyGradient(id, userId).subscribe((res: any) => {
      if (res.data.copyGradient) {
        this.queryRef1.refetch();
        this.queryRef2.refetch();
      }
    });
  }

  getBg(direction: any, colors: any[]): String {
    let res = '';
    for (let i = 0; i < colors.length; i++) {
      if (i !== colors.length - 1) {
        res += `${colors[i]},`;
      } else {
        res += `${colors[i]}`;
      }
    }
    return `linear-gradient(${direction},${res})`;
  }

  addFavourite(gradient: GradientModel): void {
    this.gradientServie.addFavourite(gradient).subscribe((res: any) => {
      if (res.data.add_favouriteGradient) {
        this.queryRef1.refetch();
        this.queryRef2.refetch();
      }
    });
  }

  removeFavourite(id: String): void {
    this.gradientServie.removeFavourite(id).subscribe((res: any) => {
      if (res.data.remove_favouriteGradient) {
        this.queryRef1.refetch();
        this.queryRef2.refetch();
      }
    });
  }

  checkFavourite(Colors: any): Boolean {
    return this.FavouriteGradients &&
      this.FavouriteGradients.find(
        (gradient) => String(gradient.Colors) === String(Colors)
      )
      ? true
      : false;
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
