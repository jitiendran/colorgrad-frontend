import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ColorModel } from 'src/app/models/color.model';
import { UserProfileService } from '../user-profile.service';
import { filter, map } from 'rxjs/operators';
import { QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-colors',
  templateUrl: './user-colors.component.html',
  styleUrls: ['./user-colors.component.scss'],
})
export class UserColorsComponent implements OnInit, OnDestroy {
  constructor(
    private Router: Router,
    private clipborad: ClipboardService,
    private snack: MatSnackBar,
    private service: UserProfileService,
    private route: ActivatedRoute
  ) {}

  Colors: ColorModel[] = [];
  Empty: boolean = false;

  private queryRef: QueryRef<ColorModel>;
  private subscription: Subscription;

  load(): void {
    this.queryRef = this.service.getColors(this.route.snapshot.params['id']);

    this.subscription = this.queryRef.valueChanges
      .pipe(map((res: any) => res.data.get_color))
      .subscribe(
        (data: ColorModel[]) => {
          this.Colors = data;
          this.Empty = this.Colors.length === 0;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  ngOnInit(): void {
    this.Router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.load();
      });
    this.load();
  }

  onCopy(color: String): void {
    this.clipborad.copyFromContent(String(color));
    this.snack.open('Copied to Clipboard !', '', {
      duration: 1000,
      panelClass: ['green-snackbar'],
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
