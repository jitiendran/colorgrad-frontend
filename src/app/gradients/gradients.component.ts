import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GradientModel } from '../models/gradient.model';

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
    private route: ActivatedRoute
  ) {}

  Gradients: GradientModel[] = [];
  Empty: boolean = false;

  ngOnInit(): void {
    const req = gql`
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

    this.apollo
      .watchQuery<GradientModel>({
        query: req,
      })
      .valueChanges.subscribe((res: any) => {
        this.Gradients = res.data.getGradients;
        this.Empty = this.Gradients.length === 0 ? true : false;
      });
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
