import { ColorModel } from './color.model';
import { FriendModel } from './friend.model';
import { GradientModel } from './gradient.model';

export interface UserModel {
  _id: String;
  Username: String;
  Email: String;
  Password: String;
  LinkedinProfile: String;
  GithubProfile: String;
  Colors: [ColorModel];
  Gradients: [GradientModel];
  Followers: [FriendModel];
  Following: [FriendModel];
  No_Of_Colors: Number;
  No_Of_Gradients: Number;
  Rating: Number;
  Profile: String;
}
