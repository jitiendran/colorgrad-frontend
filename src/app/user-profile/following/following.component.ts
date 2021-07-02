import { Component, OnInit } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { UserProfileService } from '../user-profile.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss'],
})
export class FollowingComponent implements OnInit {
  constructor(private service: UserProfileService) {}

  Following: any[] = [];

  queryref: any;

  ngOnInit(): void {
    this.queryref = this.service.getFollowing();
    this.queryref.valueChanges.subscribe(
      (res: any) => {
        this.Following = res.data.get_following;
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  onUnfollow(id: any) {
    this.service.unfollow(id).subscribe(
      (res) => {
        this.queryref.refetch();
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
