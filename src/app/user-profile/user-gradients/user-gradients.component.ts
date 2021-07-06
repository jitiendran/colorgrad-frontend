import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { GradientModel } from 'src/app/models/gradient.model';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { UserProfileService } from '../user-profile.service';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-user-gradients',
  templateUrl: './user-gradients.component.html',
  styleUrls: ['./user-gradients.component.scss'],
})
export class UserGradientsComponent implements OnInit, OnDestroy {
  constructor(
    private Router: Router,
    private clipborad: ClipboardService,
    private snack: MatSnackBar,
    private service: UserProfileService,
    private route: ActivatedRoute
  ) {}

  Gradients: GradientModel[] = [];
  Empty: boolean = false;

  private queryRef: QueryRef<GradientModel>;
  private subscription: Subscription;

  load(): void {
    this.queryRef = this.service.getGradients(this.route.snapshot.params['id']);

    this.subscription = this.queryRef.valueChanges
      .pipe(map((res: any) => res.data.get_gradient))
      .subscribe(
        (data: GradientModel[]) => {
          this.Gradients = data;
          this.Empty = this.Gradients.length === 0;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  ngOnInit(): void {
    this.Router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.load());

    this.load();
  }

  onCopy(color: string): void {
    this.clipborad.copyFromContent(color);
    this.snack.open('Copied to Clipboard !', '', {
      duration: 1000,
      panelClass: ['green-snackbar'],
    });
  }

  getBg(direction: any, colors: any[]): string {
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
