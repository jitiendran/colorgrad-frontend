import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './auth/auth-guard.guard';
import { ColorsComponent } from './colors/colors.component';
import { ContributedcolorsComponent } from './contributedcolors/contributedcolors.component';
import { ContributedgradientsComponent } from './contributedgradients/contributedgradients.component';
import { FavouritecolorComponent } from './favouritecolor/favouritecolor.component';
import { FavouritegradientComponent } from './favouritegradient/favouritegradient.component';
import { GradientsComponent } from './gradients/gradients.component';
import { HomeComponent } from './home/home.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { LoginModelComponent } from './nav/login-model/login-model.component';
import { SignupModelComponent } from './nav/signup-model/signup-model.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'colors', component: ColorsComponent, canActivate: [AuthGuardGuard] },
  {
    path: 'gradients',
    component: GradientsComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'favourite/colors',
    component: FavouritecolorComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'favourite/gradients',
    component: FavouritegradientComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'contributions/colors',
    component: ContributedcolorsComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'contributions/gradients',
    component: ContributedgradientsComponent,
    canActivate: [AuthGuardGuard],
  },
  { path: 'login', component: LoginModelComponent },
  { path: 'signup', component: SignupModelComponent },
  {
    path: 'leaderboard',
    component: LeaderboardComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'profile/:id',
    component: UserProfileComponent,
    canActivate: [AuthGuardGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
