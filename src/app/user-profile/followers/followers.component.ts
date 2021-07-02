import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserProfileService } from '../user-profile.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
})
export class FollowersComponent implements OnInit {
  Followers = [];

  constructor(private service: UserProfileService) {}

  ngOnInit(): void {
    this.service.getFollowers().valueChanges.subscribe(
      (res) => {
        this.Followers = res.data.get_followers;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
