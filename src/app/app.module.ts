import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapModule } from './shared/bootstrap/bootstrap.module';
import { MaterialModule } from './shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { ColorsComponent } from './colors/colors.component';
import { GradientsComponent } from './gradients/gradients.component';
import { FavouritecolorComponent } from './favouritecolor/favouritecolor.component';
import { FavouritegradientComponent } from './favouritegradient/favouritegradient.component';
import { ContributedcolorsComponent } from './contributedcolors/contributedcolors.component';
import { ContributedgradientsComponent } from './contributedgradients/contributedgradients.component';
import { LoginModelComponent } from './nav/login-model/login-model.component';
import { SignupModelComponent } from './nav/signup-model/signup-model.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ColorComponent } from './home/color/color.component';
import { GradientComponent } from './home/gradient/gradient.component';
import { RatingComponent } from './home/rating/rating.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AuthComponent,
    HomeComponent,
    ColorsComponent,
    GradientsComponent,
    FavouritecolorComponent,
    FavouritegradientComponent,
    ContributedcolorsComponent,
    ContributedgradientsComponent,
    LoginModelComponent,
    SignupModelComponent,
    LeaderboardComponent,
    ColorComponent,
    GradientComponent,
    RatingComponent,
    FooterComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BootstrapModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
