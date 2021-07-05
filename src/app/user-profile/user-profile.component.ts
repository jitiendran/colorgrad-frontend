import { QueryRef } from 'apollo-angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserProfileService } from './user-profile.service';
import { UserModel } from '../models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private navigationSunscription: any;
  private queryRef: QueryRef<UserModel>;
  itsMe: boolean = false;

  constructor(
    private service: UserProfileService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  User: UserModel;

  ngOnInit(): void {
    if (this.route.snapshot.params['id'] === this.service.getId()) {
      this.itsMe = true;
    }
    this.queryRef = this.service.getUser(this.route.snapshot.params['id']);

    this.queryRef.valueChanges.subscribe(
      (res: any) => {
        console.log(res);
        this.User = res.data.get_user;
      },
      (err: any) => {
        console.error(err);
      }
    );
    this.navigationSunscription = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.refetch();
      });
  }

  refetch() {
    if (this.route.snapshot.params['id'] === this.service.getId()) {
      this.itsMe = true;
    } else {
      this.itsMe = false;
    }
    this.queryRef = this.service.getUser(this.route.snapshot.params['id']);

    this.queryRef.valueChanges.subscribe(
      (res: any) => {
        console.log(res);

        this.User = res.data.get_user;
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.navigationSunscription) {
      this.navigationSunscription.unsubscribe();
    }
  }

  getBackground(rating: any) {
    rating = Number(rating);
    if (rating > 0)
      return 'linear-gradient(to bottom right, #e0e0e0 0%, #bdbdbd 100%)';
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

  getTitle(rating: any) {
    rating = Number(rating);
    if (rating > 0) return 'Silver';
    else if (rating > 200) return 'Gold';
    else if (rating > 400) return 'Ocean';
    else if (rating > 600) return 'Emerald';
    else if (rating > 800) return 'Master';
    else if (rating > 1000) return 'Legendary Master';
    else if (rating > 1200) return 'Grand Master';

    return 'Unrated';
  }
}
