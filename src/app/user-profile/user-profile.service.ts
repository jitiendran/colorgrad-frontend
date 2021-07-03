import jwt_decode from 'jwt-decode';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ColorModel } from '../models/color.model';
import { GradientModel } from '../models/gradient.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(private apollo: Apollo) {}

  private token = String(localStorage.getItem('token'));

  private Following: any[] = [];

  private GET_USER_QUERY = gql`
    query get_user($data: get_userInput!) {
      get_user(data: $data) {
        _id
        Username
        Email
        Password
        LinkedinProfile
        GithubProfile
        Colors {
          _id
          Colors
          Type
          UsedBy
        }
        Gradients {
          _id
          Colors
          Type
          Direction
          UsedBy
        }
        Followers {
          _id
          Username
        }
        Following {
          _id
          Username
        }
        No_Of_Colors
        No_Of_Gradients
        Rating
        Profile
      }
    }
  `;

  private GET_COLOR_QUERY = gql`
    query get_color($data: get_userInput!) {
      get_color(data: $data) {
        _id
        Colors
        Type
        UsedBy
      }
    }
  `;

  private GET_GRADIENT_QUERY = gql`
    query get_gradient($data: get_userInput!) {
      get_gradient(data: $data) {
        _id
        Colors
        Type
        Direction
        UsedBy
      }
    }
  `;

  private GET_FOLLOWERS_QUERY = gql`
    query get_followers($data: friendInput!) {
      get_followers(data: $data) {
        _id
        Username
        Email
        Profile
      }
    }
  `;

  private GET_FOLLOWING_QUERY = gql`
    query get_following($data: friendInput!) {
      get_following(data: $data) {
        _id
        Username
        Email
        Profile
      }
    }
  `;

  private REMOVE_FRIEND_QUERY = gql`
    mutation remove_friend($data: remove_friendInput!) {
      remove_friend(data: $data)
    }
  `;

  private FOLLOW_FRIEND_QUERY = gql`
    mutation add_friend($data: add_friendInput!) {
      add_friend(data: $data)
    }
  `;

  getUser(id: any) {
    return this.apollo.watchQuery<any>({
      query: this.GET_USER_QUERY,
      variables: {
        data: {
          UserId: id,
        },
      },
    });
  }

  getColors(id: any) {
    return this.apollo.watchQuery<ColorModel>({
      query: this.GET_COLOR_QUERY,
      variables: {
        data: {
          UserId: id,
        },
      },
    });
  }

  getGradients(id: any) {
    return this.apollo.watchQuery<GradientModel>({
      query: this.GET_GRADIENT_QUERY,
      variables: {
        data: {
          UserId: id,
        },
      },
    });
  }

  getFollowers(id: any) {
    return this.apollo.watchQuery<any>({
      query: this.GET_FOLLOWERS_QUERY,
      variables: {
        data: {
          Id: id,
        },
      },
    });
  }

  getFollowing(id: any) {
    return this.apollo.watchQuery<any>({
      query: this.GET_FOLLOWING_QUERY,
      variables: {
        data: {
          Id: id,
        },
      },
    });
  }

  unfollow(id: any) {
    return this.apollo.mutate<any>({
      mutation: this.REMOVE_FRIEND_QUERY,
      variables: {
        data: {
          FriendId: id,
        },
      },
    });
  }

  follow(id: any) {
    return this.apollo.mutate<any>({
      mutation: this.FOLLOW_FRIEND_QUERY,
      variables: {
        data: {
          UserId: id,
        },
      },
    });
  }

  getId() {
    const user: any = jwt_decode(this.token);
    return user._id;
  }
}
