import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { GradientModel } from 'src/app/models/gradient.model';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { filter, map } from 'rxjs/operators';
import { GradientsService } from 'src/app/gradients/gradients.service';
import { Subscription } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-gradient',
  templateUrl: './gradient.component.html',
  styleUrls: ['./gradient.component.scss'],
  animations: [
    trigger('SlideRight', [
      transition('void => *', [
        style({ marginRight: '-10em' }),
        animate('1.3s ease-out'),
      ]),
    ]),
  ],
})
export class GradientComponent implements OnInit {
  constructor(
    private Router: Router,
    private apollo: Apollo,
    private clipborad: ClipboardService,
    private snack: MatSnackBar,
    private gradientServie: GradientsService
  ) {}

  Gradients: GradientModel[];
  FavouriteGradients: GradientModel[];
  queryRef1: QueryRef<GradientModel>;
  queryRef2: QueryRef<GradientModel>;
  subscription1: Subscription;
  subscription2: Subscription;
  isLoggedIn: boolean = false;
  Empty: boolean = false;

  private GET_GRADIENT_QUERY = gql`
    query getGradients {
      getGradients {
        _id
        Colors
        Type
        Direction
        UsedBy
      }
    }
  `;

  load() {
    this.queryRef1 = this.gradientServie.getFavouriteGradients();

    this.subscription1 = this.queryRef1.valueChanges
      .pipe(map((res: any) => res.data.getFavouriteGradients))
      .subscribe((data: GradientModel[]) => {
        this.FavouriteGradients = data;
        this.Empty = this.FavouriteGradients.length === 0;
      });

    this.queryRef2 = this.apollo.watchQuery<GradientModel>({
      query: this.GET_GRADIENT_QUERY,
    });

    this.subscription2 = this.queryRef2.valueChanges
      .pipe(
        map((res: any) => res.data.getGradients.slice().splice(0, 4)),
        map((data: GradientModel[]) =>
          data.slice().sort((a, b) => {
            return Number(b.UsedBy) - Number(a.UsedBy);
          })
        )
      )
      .subscribe((data: GradientModel[]) => {
        this.Gradients = data;
      });

    if (localStorage.getItem('token')) {
      this.isLoggedIn = true;
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

  onGo() {
    this.Router.navigateByUrl('/gradients');
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
