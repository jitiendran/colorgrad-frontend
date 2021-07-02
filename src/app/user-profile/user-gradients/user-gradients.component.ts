import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GradientModel } from 'src/app/models/gradient.model';
import { Apollo, gql } from 'apollo-angular';
import { UserProfileService } from '../user-profile.service';
@Component({
  selector: 'app-user-gradients',
  templateUrl: './user-gradients.component.html',
  styleUrls: ['./user-gradients.component.scss'],
})
export class UserGradientsComponent implements OnInit {
  constructor(
    private Router: Router,
    private clipborad: ClipboardService,
    private snack: MatSnackBar,
    private service: UserProfileService,
    private route: ActivatedRoute
  ) {}

  Gradients: GradientModel[] = [];

  ngOnInit(): void {
    this.service
      .getGradients(this.route.snapshot.params['id'])
      .valueChanges.subscribe(
        (result: any) => {
          this.Gradients = result.data.get_gradient;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  onCopy(color: string) {
    this.clipborad.copyFromContent(color);
    this.snack.open('Copied to Clipboard !', '', {
      duration: 1000,
      panelClass: ['green-snackbar'],
    });
  }

  onGo() {
    this.Router.navigateByUrl('/gradients');
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
}
