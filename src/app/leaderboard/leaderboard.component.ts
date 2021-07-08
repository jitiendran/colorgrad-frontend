import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user.model';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: MatTableDataSource<UserModel>;
  Users: UserModel[] = [];
  displayedColumns: string[] = ['S.No', 'Username', 'Email', 'Rating'];

  private userRef: QueryRef<UserModel>;
  private userSubscription: Subscription;

  private GET_ALLUSERS: DocumentNode = gql`
    query get_allusers {
      get_allusers {
        _id
        Username
        Email
        Rating
      }
    }
  `;

  constructor(private apollo: Apollo, private router: Router) {}

  ngOnInit(): void {
    this.userRef = this.apollo.watchQuery<UserModel>({
      query: this.GET_ALLUSERS,
    });

    this.userSubscription = this.userRef.valueChanges
      .pipe(map((res: any) => res.data.get_allusers))
      .subscribe((data: UserModel[]) => {
        this.Users = data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onProfile(id: String): void {
    this.router.navigateByUrl(`/profile/${id}`);
  }

  getColor(rating: Number) {
    rating = Number(rating);
    if (rating > 0)
      return 'linear-gradient(to bottom right, #bdc3c7 0%, #2c3e50 100%)';
    else if (rating > 200)
      return 'linear-gradient(to bottom right, #ffeb3b 0%, #fbc02d 100%)';
    else if (rating > 400)
      return 'linear-gradient(to bottom right, #4fc3f7 0%, #2196f3 100%)';
    else if (rating > 600)
      return 'linear-gradient(to bottom right, #4db6ac 0%, #00796b 100%)';
    else if (rating > 800)
      return 'linear-gradient(to bottom right, #f48fb1 0%, #d81b60 100%)';
    else if (rating > 1000)
      return 'linear-gradient(to bottom right, #ab47bc 0%, #4527a0 100%)';
    else if (rating > 1200)
      return 'linear-gradient(to bottom right, #f4511e 0%, #b71c1c 100%)';

    return 'black';
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
