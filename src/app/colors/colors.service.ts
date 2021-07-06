import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ColorModel } from '../models/color.model';

@Injectable({
  providedIn: 'root',
})
export class ColorsService {
  constructor(private apollo: Apollo) {}

  private FAOURITE_COLOR_QUERY = gql`
    mutation add_favouriteColor($data: add_favouriteColorInput!) {
      add_favouriteColor(data: $data)
    }
  `;

  private REMOVE_COLOR_QUERY = gql`
    mutation remove_favouriteColor($data: remove_favouriteColorInput!) {
      remove_favouriteColor(data: $data)
    }
  `;

  private COPY_COLOR_QUERY = gql`
    mutation copyColors($data: copyColorsInput!) {
      copyColors(data: $data)
    }
  `;

  private GET_FAVOURITECOLORS_QUERY = gql`
    query getFavouriteColors {
      getFavouriteColors {
        _id
        Colors
        Type
        UsedBy
        UserId
      }
    }
  `;

  addFavourite(color: ColorModel) {
    return this.apollo.mutate<Boolean>({
      mutation: this.FAOURITE_COLOR_QUERY,
      variables: {
        data: {
          ColorId: color._id,
          Colors: color.Colors,
          Type: color.Type,
          UsedBy: color.UsedBy,
        },
      },
    });
  }

  removeFavourite(ColorId: String) {
    return this.apollo.mutate<Boolean>({
      mutation: this.REMOVE_COLOR_QUERY,
      variables: {
        data: {
          ColorId,
        },
      },
    });
  }

  copyColor(ColorId: String, UserId: String) {
    return this.apollo.mutate<Boolean>({
      mutation: this.COPY_COLOR_QUERY,
      variables: {
        data: {
          ColorId,
          UserId,
        },
      },
    });
  }

  getFavouriteColors() {
    return this.apollo.watchQuery<ColorModel>({
      query: this.GET_FAVOURITECOLORS_QUERY,
    });
  }
}
