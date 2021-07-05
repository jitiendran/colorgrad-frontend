import { Component, OnInit } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GradientModel } from '../models/gradient.model';
import { GradientsService } from './gradients.service';

@Component({
  selector: 'app-gradients',
  templateUrl: './gradients.component.html',
  styleUrls: ['./gradients.component.scss'],
})
export class GradientsComponent implements OnInit {
  constructor(
    private Router: Router,
    private clipborad: ClipboardService,
    private snack: MatSnackBar,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private gradientServie: GradientsService
  ) {}

  Gradients: GradientModel[] = [];
  FavouriteGradients: GradientModel[] = [];
  queryRef1: QueryRef<GradientModel>;
  queryRef2: QueryRef<GradientModel>;
  Empty: boolean = false;
  gEmpty: boolean = false;

  ngOnInit(): void {
    this.Router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.reload());

    this.queryRef1 = this.gradientServie.getFavouriteGradients();

    this.queryRef1.valueChanges.subscribe((res: any) => {
      this.FavouriteGradients = res.data.getFavouriteGradients;
      this.gEmpty =
        this.FavouriteGradients && this.FavouriteGradients.length === 0
          ? true
          : false;
    });
    const req = gql`
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

    this.queryRef2 = this.apollo.watchQuery<GradientModel>({
      query: req,
    });

    this.queryRef2.valueChanges.subscribe((res: any) => {
      const arr: GradientModel[] = res.data.getGradients;
      this.Gradients = arr.slice().sort((a, b) => {
        return Number(b.UsedBy) - Number(a.UsedBy);
      });
      this.Empty = this.Gradients.length === 0 ? true : false;
    });
  }

  reload() {
    this.queryRef1 = this.gradientServie.getFavouriteGradients();

    this.queryRef1.valueChanges.subscribe((res: any) => {
      this.FavouriteGradients = res.data.getFavouriteGradients;
      this.gEmpty =
        this.FavouriteGradients && this.FavouriteGradients.length === 0
          ? true
          : false;
    });
    const req = gql`
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

    this.queryRef2 = this.apollo.watchQuery<GradientModel>({
      query: req,
    });

    this.queryRef2.valueChanges.subscribe((res: any) => {
      this.Gradients = res.data.getGradients;
      this.Empty = this.Gradients.length === 0 ? true : false;
    });
  }

  onCopy(color: String, id: String, userId: String) {
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

  getBg(direction: any, colors: any[]) {
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

  addFavourite(gradient: GradientModel) {
    this.gradientServie.addFavourite(gradient).subscribe((res: any) => {
      if (res.data.add_favouriteGradient) {
        this.queryRef1.refetch();
        this.queryRef2.refetch();
      }
    });
  }

  removeFavourite(id: String) {
    this.gradientServie.removeFavourite(id).subscribe((res: any) => {
      if (res.data.remove_favouriteGradient) {
        this.queryRef1.refetch();
        this.queryRef2.refetch();
      }
    });
  }

  checkFavourite(Colors: any) {
    return this.FavouriteGradients &&
      this.FavouriteGradients.find(
        (gradient) => String(gradient.Colors) === String(Colors)
      )
      ? true
      : false;
  }
}
