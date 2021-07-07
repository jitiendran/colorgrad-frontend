import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { GradientModel } from '../models/gradient.model';
import { GradientsService } from '../gradients/gradients.service';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-favouritegradient',
  templateUrl: './favouritegradient.component.html',
  styleUrls: ['./favouritegradient.component.scss'],
  animations: [
    trigger('FadeIn', [
      transition('void => *', [
        style({ marginTop: '-7em' }),
        animate('1.6s ease-out'),
      ]),
    ]),
  ],
})
export class FavouritegradientComponent implements OnInit, OnDestroy {
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

  queryRef: QueryRef<GradientModel>;
  subscription: Subscription;

  load(): void {
    this.loaded = true;
    this.queryRef = this.gradientServie.getFavouriteGradients();

    this.subscription = this.queryRef.valueChanges
      .pipe(map((res: any) => res.data.getFavouriteGradients))
      .subscribe((data: GradientModel[]) => {
        this.Gradients = data;
        this.Empty = this.Gradients.length === 0;
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
        this.queryRef.refetch();
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
