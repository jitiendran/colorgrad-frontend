import { filter, map } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserProfileService } from '../user-profile.service';
import { QueryRef } from 'apollo-angular';
import { FriendModel } from 'src/app/models/friend.model';
import { Subscription } from 'rxjs';

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

  Following: FriendModel[] = [];
  itsMe: boolean = false;
  Empty: boolean = false;

  private Id: String;
  private FollowingMe: FriendModel[] = [];
  private queryRef1: QueryRef<FriendModel>;
  private queryRef2: QueryRef<FriendModel>;
  private subscription1: Subscription;
  private subscription2: Subscription;

  load(): void {
    if (this.route.snapshot.params['id'] === this.service.getId()) {
      this.itsMe = true;
    }

    this.Id = this.route.snapshot.params['id'];

    this.queryRef1 = this.service.getFollowing(this.Id);

    this.subscription1 = this.queryRef1.valueChanges
      .pipe(map((res: any) => res.data.get_following))
      .subscribe(
        (data: FriendModel[]) => {
          this.Following = data;
          this.Empty = this.Following.length === 0;
        },
        (err) => {
          console.error(err);
        }
      );

    this.queryRef2 = this.service.getFollowing(this.service.getId());

    this.subscription2 = this.queryRef2.valueChanges
      .pipe(map((res: any) => res.data.get_following))
      .subscribe((data: FriendModel[]) => {
        this.FollowingMe = data;
      });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.load());

    this.load();
  }

  refetch(): void {
    this.queryRef1.refetch();
    this.queryRef2.refetch();
  }

  checkUser(id: any): Boolean {
    return this.FollowingMe.find((user) => user._id === id) ? true : false;
  }

  checkMe(id: any): Boolean {
    return this.service.getId() === id ? true : false;
  }

  onUnfollow(id: any): void {
    this.service.unfollow(id).subscribe(
      () => {
        this.refetch();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  onFollow(id: any): void {
    this.service.follow(id).subscribe(
      () => {
        this.refetch();
      },
      (err) => console.error(err)
    );
  }

  onUser(id: any): void {
    this.router.navigateByUrl(`/profile/${id}`);
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
