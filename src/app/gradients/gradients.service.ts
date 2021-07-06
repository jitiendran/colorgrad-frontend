import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { GradientModel } from '../models/gradient.model';

@Injectable({
  providedIn: 'root',
})
export class GradientsService {
  constructor(private apollo: Apollo) {}

  private COPY_GRADIENT_QUERY = gql`
    mutation copyGradient($data: copyGradientInput!) {
      copyGradient(data: $data)
    }
  `;

  private FAVOURITE_GRADIENT_QUERY = gql`
    mutation add_favouriteGradient($data: add_favouriteGradientInput!) {
      add_favouriteGradient(data: $data)
    }
  `;

  private REMOVE_GRADIENT_QUERY = gql`
    mutation remove_favouriteGradient($data: remove_favouriteGradientInput!) {
      remove_favouriteGradient(data: $data)
    }
  `;

  private GET_FAVOURITE_GRADIENT = gql`
    query getFavouriteGradients {
      getFavouriteGradients {
        _id
        Colors
        Type
        Direction
        UsedBy
        UserId
      }
    }
  `;

  copyGradient(GradientId: String, UserId: String) {
    return this.apollo.mutate<Boolean>({
      mutation: this.COPY_GRADIENT_QUERY,
      variables: {
        data: {
          GradientId,
          UserId,
        },
      },
    });
  }

  addFavourite(gradient: GradientModel) {
    return this.apollo.mutate<Boolean>({
      mutation: this.FAVOURITE_GRADIENT_QUERY,
      variables: {
        data: {
          GradientId: gradient._id,
          Colors: gradient.Colors,
          Type: gradient.Type,
          Direction: gradient.Direction,
          UsedBy: gradient.UsedBy,
        },
      },
    });
  }

  removeFavourite(GradientId: String) {
    return this.apollo.mutate<Boolean>({
      mutation: this.REMOVE_GRADIENT_QUERY,
      variables: {
        data: {
          GradientId,
        },
      },
    });
  }

  getFavouriteGradients() {
    return this.apollo.watchQuery<GradientModel>({
      query: this.GET_FAVOURITE_GRADIENT,
    });
  }
}
