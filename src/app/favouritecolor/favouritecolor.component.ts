import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { ColorModel } from '../models/color.model';
import { Apollo, QueryRef } from 'apollo-angular';
import { ColorsService } from '../colors/colors.service';
import { Subscription } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'favouritecolors',
  templateUrl: './favouritecolor.component.html',
  styleUrls: ['./favouritecolor.component.scss'],
  animations: [
    trigger('FadeIn', [
      transition('void => *', [
        style({ marginTop: '-7em' }),
        animate('1.6s ease-out'),
      ]),
    ]),
  ],
})
export class FavouritecolorComponent implements OnInit, OnDestroy {
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

  private queryRef: QueryRef<ColorModel>;
  private subscription: Subscription;

  load(): void {
    this.loaded = true;
    this.queryRef = this.colorService.getFavouriteColors();

    this.subscription = this.queryRef.valueChanges
      .pipe(map((res: any) => res.data.getFavouriteColors))
      .subscribe((data: ColorModel[]) => {
        this.Colors = data;
        this.Empty = this.Colors.length === 0;
        setTimeout(() => (this.loaded = false), 1000);
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
