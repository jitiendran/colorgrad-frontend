import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { GradientModel } from 'src/app/models/gradient.model';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-gradient',
  templateUrl: './gradient.component.html',
  styleUrls: ['./gradient.component.scss'],
})
export class GradientComponent implements OnInit {
  constructor(
    private Router: Router,
    private apollo: Apollo,
    private clipborad: ClipboardService,
    private snack: MatSnackBar
  ) {}

  Gradients: GradientModel[] = [];
  queryRef: QueryRef<GradientModel>;

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

  ngOnInit(): void {
    this.Router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.queryRef.refetch();
      });

    this.queryRef = this.apollo.watchQuery<GradientModel>({
      query: this.GET_GRADIENT_QUERY,
    });

    this.queryRef.valueChanges.subscribe((result: any) => {
      this.Gradients = result.data.getGradients;
      this.Gradients = this.Gradients.slice().sort((a, b) => {
        return Number(b.UsedBy) - Number(a.UsedBy);
      });
      this.Gradients = this.Gradients.slice(0, 4);
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
