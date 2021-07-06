import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { FriendModel } from 'src/app/models/friend.model';
import { UserProfileService } from '../user-profile.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
})
export class FollowersComponent implements OnInit, OnDestroy {
  Followers: FriendModel[] = [];
  Empty: boolean = false;
  itsMe: boolean = false;

  private Following: FriendModel[] = [];
  private queryRef1: QueryRef<FriendModel>;
  private queryRef2: QueryRef<FriendModel>;
  private subscription1: Subscription;
  private subscription2: Subscription;

  constructor(
    private service: UserProfileService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  load(): void {
    this.queryRef1 = this.service.getFollowers(
      this.route.snapshot.params['id']
    );

    this.subscription1 = this.queryRef1.valueChanges
      .pipe(map((res: any) => res.data.get_followers))
      .subscribe((data: FriendModel[]) => {
        this.Followers = data;
        this.Empty = this.Followers.length === 0;
      });

    this.queryRef2 = this.service.getFollowing(this.service.getId());

    this.subscription2 = this.queryRef2.valueChanges
      .pipe(map((res: any) => res.data.get_following))
      .subscribe((data: FriendModel[]) => {
        this.Following = data;
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

  onUser(id: any): void {
    this.router.navigateByUrl(`/profile/${id}`);
  }

  checkMe(id: any): Boolean {
    return this.service.getId() === id;
  }

  checkUser(id: any): Boolean {
    return this.Following.find((user) => user._id === id) ? true : false;
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

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
