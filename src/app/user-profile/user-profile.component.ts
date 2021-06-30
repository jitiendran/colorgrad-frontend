import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from './user-profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  constructor(
    private service: UserProfileService,
    private route: ActivatedRoute
  ) {}

  User: any;

  ngOnInit(): void {
    this.service
      .getUser(this.route.snapshot.params['id'])
      .valueChanges.subscribe(
        (res) => {
          console.log(res);

          this.User = res.data.get_user;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  getBackground(rating: Number) {
    if (rating < 200)
      return 'linear-gradient(to bottom right, #e0e0e0 0%, #bdbdbd 100%)';
    else if (rating < 400)
      return 'linear-gradient(to bottom right, #ffeb3b 0%, #fbc02d 100%)';
    else if (rating < 600)
      return 'linear-gradient(to bottom right, #4fc3f7 0%, #2196f3 100%)';
    else if (rating < 800)
      return 'linear-gradient(to bottom right, #4db6ac 0%, #00796b 100%)';
    else if (rating < 1000)
      return 'linear-gradient(to bottom right, #f48fb1 0%, #d81b60 100%)';
    else if (rating < 1200)
      return 'linear-gradient(to bottom right, #ab47bc 0%, #4527a0 100%)';
    else if (rating <= 1400)
      return 'linear-gradient(to bottom right, #f4511e 0%, #b71c1c 100%)';

    return 'black';
  }

  getTitle(rating: Number) {
    if (rating < 200) return 'Silver';
    else if (rating < 400) return 'Gold';
    else if (rating < 600) return 'Ocean';
    else if (rating < 800) return 'Emerald';
    else if (rating < 1000) return 'Master';
    else if (rating < 1200) return 'Legendary Master';
    else if (rating <= 1400) return 'Grand Master';

    return 'Unrated';
  }
}
