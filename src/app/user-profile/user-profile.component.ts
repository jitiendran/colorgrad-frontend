import { gql, QueryRef } from 'apollo-angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { UserProfileService } from './user-profile.service';
import { UserModel } from '../models/user.model';
import { Subscription } from 'rxjs';
import { FriendModel } from '../models/friend.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  itsMe: boolean = false;
  loaded: boolean = false;
  edit: boolean = false;
  pedit: boolean = false;
  fileToUpload: any;
  filePresent: boolean = false;
  typeValid: boolean = false;
  User: UserModel;
  updateform: FormGroup = new FormGroup({
    LinkedinProfile: new FormControl(null, Validators.required),
    GithubProfile: new FormControl(null, Validators.required),
  });

  fileform: FormGroup = new FormGroup({
    file: new FormControl(null, Validators.required),
  });

  private navigationSunscription: Subscription;
  private queryRef: QueryRef<UserModel>;
  private subscription: Subscription;
  private Following: FriendModel[] = [];
  private queryRef2: QueryRef<FriendModel>;
  private subscription2: Subscription;

  constructor(
    private service: UserProfileService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  load(): void {
    this.loaded = true;
    if (this.route.snapshot.params['id'] === this.service.getId()) {
      this.itsMe = true;
    } else {
      this.itsMe = false;
    }

    this.queryRef2 = this.service.getFollowing(this.service.getId());

    this.subscription2 = this.queryRef2.valueChanges
      .pipe(map((res: any) => res.data.get_following))
      .subscribe((data: FriendModel[]) => {
        this.Following = data;
      });

    this.queryRef = this.service.getUser(this.route.snapshot.params['id']);

    this.subscription = this.queryRef.valueChanges
      .pipe(map((res: any) => res.data.get_user))
      .subscribe((data: UserModel) => {
        this.User = data;
        setTimeout(() => (this.loaded = false), 1000);
      });
  }

  ngOnInit(): void {
    this.navigationSunscription = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.load();
      });
    this.load();
  }

  refetch() {
    this.queryRef.refetch();
    this.queryRef2.refetch();
  }

  checkMe(id: any): Boolean {
    return this.service.getId() === id;
  }

  checkUser(id: any): Boolean {
    return this.Following.find((user) => user._id === id) ? true : false;
  }

  getBackground(rating: any): String {
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

  getTitle(rating: any): String {
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

  onEdit(): void {
    this.edit = true;
  }

  onEditProfile(): void {
    this.pedit = true;
  }

  onClose(): void {
    this.edit = false;
    this.pedit = false;
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.fileToUpload = event.target.files[0];

      const ftype = this.fileToUpload.type.split('/')[1];
      this.typeValid =
        ftype === 'jpg' || ftype === 'png' || ftype === 'jpeg' ? true : false;

      this.filePresent = this.typeValid ? true : false;
    } else {
      this.filePresent = false;
      this.fileToUpload = null;
    }
  }

  onUpload() {
    this.service
      .uploadImage(this.fileToUpload)
      .pipe(map((res: any) => res.data.upload_profile))
      .subscribe((data) => {
        if (data === true) {
          this.refetch();
          this.pedit = false;
        }
      });
  }

  filterProfile(url: String): String {
    const temp: String[] = url.split('/');
    return temp[temp.length - 1]
      ? temp[temp.length - 1]
      : temp[temp.length - 2];
  }

  onUpdate(): void {
    const { LinkedinProfile, GithubProfile } = this.updateform.value;
    this.service
      .updateUser(LinkedinProfile, GithubProfile)
      .pipe(map((res: any) => res.data.update_user))
      .subscribe((data) => {
        if (data === true) {
          this.queryRef.refetch();
          this.queryRef2.refetch();
          this.edit = false;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.navigationSunscription) {
      this.navigationSunscription.unsubscribe();
    }
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
