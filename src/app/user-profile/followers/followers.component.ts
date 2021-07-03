import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { QueryRef } from 'apollo-angular';
import { filter } from 'rxjs/operators';
import { UserProfileService } from '../user-profile.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
})
export class FollowersComponent implements OnInit {
  Followers: any[] = [];
  Following: any[] = [];
  Empty: boolean = false;
  itsMe: boolean = false;
  queryRef1: QueryRef<any>;
  queryRef2: QueryRef<any>;

  constructor(
    private service: UserProfileService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.reloading());

    this.queryRef1 = this.service.getFollowers(
      this.route.snapshot.params['id']
    );

    this.queryRef1.valueChanges.subscribe(
      (res) => {
        this.Followers = res.data.get_followers;
        this.Empty = this.Followers.length === 0 ? true : false;
      },
      (err) => {
        console.error(err);
      }
    );

    this.queryRef2 = this.service.getFollowing(this.service.getId());

    this.queryRef2.valueChanges.subscribe((res) => {
      this.Following = res.data.get_following;
    });
  }

  reloading() {
    this.queryRef1 = this.service.getFollowers(
      this.route.snapshot.params['id']
    );

    this.queryRef1.valueChanges.subscribe(
      (res) => {
        this.Followers = res.data.get_followers;
        this.Empty = this.Followers.length === 0 ? true : false;
      },
      (err) => {
        console.error(err);
      }
    );

    this.queryRef2 = this.service.getFollowing(this.service.getId());

    this.queryRef2.valueChanges.subscribe((res) => {
      this.Following = res.data.get_following;
    });
  }

  refetch() {
    this.queryRef1.refetch();
    this.queryRef2.refetch();
  }

  onUser(id: any) {
    this.router.navigateByUrl(`/profile/${id}`);
  }

  checkMe(id: any) {
    return this.service.getId() === id ? true : false;
  }

  checkUser(id: any) {
    return this.Following.find((user) => user._id === id) ? true : false;
  }

  onUnfollow(id: any) {
    this.service.unfollow(id).subscribe(
      (res) => {
        this.refetch();
      },
      (err) => {
        console.error(err);
      }
    );
  }
  onFollow(id: any) {
    this.service.follow(id).subscribe(
      (res) => {
        this.refetch();
      },
      (err) => console.error(err)
    );
  }
}
