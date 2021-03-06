import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapModule } from './shared/bootstrap/bootstrap.module';
import { MaterialModule } from './shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
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
import { GraphQLModule } from './graphql/graphql.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { HttpInterceptorInterceptor } from './interceptor/http-interceptor.interceptor';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { OverviewComponent } from './user-profile/overview/overview.component';
import { UserColorsComponent } from './user-profile/user-colors/user-colors.component';
import { UserGradientsComponent } from './user-profile/user-gradients/user-gradients.component';
import { FollowersComponent } from './user-profile/followers/followers.component';
import { FollowingComponent } from './user-profile/following/following.component';
import { NotAvailableComponent } from './shared/utilities/models/not-available/not-available.component';
import { LoaderComponent } from './shared/utilities/models/loader/loader.component';
import { CommonModule } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
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
    UserProfileComponent,
    OverviewComponent,
    UserColorsComponent,
    UserGradientsComponent,
    FollowersComponent,
    FollowingComponent,
    NotAvailableComponent,
    LoaderComponent,
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
    GraphQLModule,
    HttpClientModule,
    BrowserAnimationsModule,
    Ng2SearchPipeModule,
    CommonModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httplink: HttpLink) => {
        return {
          cache: new InMemoryCache({
            typePolicies: {
              Query: {
                fields: {
                  get_following: {
                    merge(existing, incoming) {
                      return { ...incoming };
                    },
                  },
                },
              },
            },
          }),
          link: httplink.create({
            uri: 'https://colorgrad-backend.herokuapp.com/graphql',
          }),
        };
      },
      deps: [HttpLink],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
