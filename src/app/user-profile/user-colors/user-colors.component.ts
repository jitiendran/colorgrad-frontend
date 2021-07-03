import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ColorModel } from 'src/app/models/color.model';
import { UserProfileService } from '../user-profile.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-colors',
  templateUrl: './user-colors.component.html',
  styleUrls: ['./user-colors.component.scss'],
})
export class UserColorsComponent implements OnInit {
  constructor(
    private Router: Router,
    private clipborad: ClipboardService,
    private snack: MatSnackBar,
    private service: UserProfileService,
    private route: ActivatedRoute
  ) {}

  Colors: ColorModel[] = [];
  Empty: boolean = false;

  ngOnInit(): void {
    this.Router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.refetch();
      });

    this.service
      .getColors(this.route.snapshot.params['id'])
      .valueChanges.subscribe(
        (result: any) => {
          console.log(result);

          this.Colors = result.data.get_color;

          this.Empty = this.Colors.length === 0 ? true : false;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  refetch() {
    this.service
      .getColors(this.route.snapshot.params['id'])
      .valueChanges.subscribe(
        (result: any) => {
          console.log(result);

          this.Colors = result.data.get_color;
          this.Empty = this.Colors.length === 0 ? true : false;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  onCopy(color: String) {
    this.clipborad.copyFromContent(String(color));
    this.snack.open('Copied to Clipboard !', '', {
      duration: 1000,
      panelClass: ['green-snackbar'],
    });
  }

  onGo() {
    this.Router.navigateByUrl('/colors');
  }
}
