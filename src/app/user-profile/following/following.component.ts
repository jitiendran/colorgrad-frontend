import { filter } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserProfileService } from '../user-profile.service';
import { QueryRef } from 'apollo-angular';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss'],
})
export class FollowingComponent implements OnInit, OnDestroy {
  constructor(
    private service: UserProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  Following: any[] = [];
  FollowingMe: any[] = [];
  itsMe: boolean = false;
  Empty: boolean = false;
  queryRef1: QueryRef<any>;
  queryRef2: QueryRef<any>;

  navigationSubscription: any;
  Id: String;

  ngOnInit(): void {
    if (this.route.snapshot.params['id'] === this.service.getId()) {
      this.itsMe = true;
    }

    this.Id = this.route.snapshot.params['id'];

    this.queryRef1 = this.service.getFollowing(this.Id);

    this.queryRef1.valueChanges.subscribe(
      (res: any) => {
        this.Following = res.data.get_following;
        this.Empty = this.Following.length === 0 ? true : false;
      },
      (err: any) => {
        console.error(err);
      }
    );

    this.queryRef2 = this.service.getFollowing(this.service.getId());

    this.queryRef2.valueChanges.subscribe((res) => {
      this.FollowingMe = res.data.get_following;
    });

    this.navigationSubscription = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.reloading();
      });
  }

  reloading() {
    if (this.route.snapshot.params['id'] === this.service.getId()) {
      this.itsMe = true;
    }

    this.Id = this.route.snapshot.params['id'];

    this.queryRef1 = this.service.getFollowing(this.Id);

    this.queryRef1.valueChanges.subscribe(
      (res: any) => {
        this.Following = res.data.get_following;
        this.Empty = this.Following.length === 0 ? true : false;
      },
      (err: any) => {
        console.error(err);
      }
    );

    this.queryRef2 = this.service.getFollowing(this.service.getId());

    this.queryRef2.valueChanges.subscribe((res) => {
      this.FollowingMe = res.data.get_following;
    });
  }

  refetch() {
    this.queryRef1.refetch();
    this.queryRef2.refetch();
  }

  checkUser(id: any) {
    return this.FollowingMe.find((user) => user._id === id) ? true : false;
  }

  checkMe(id: any) {
    return this.service.getId() === id ? true : false;
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
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

  onUser(id: any) {
    this.router.navigateByUrl(`/profile/${id}`);
  }
}
