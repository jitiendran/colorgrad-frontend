import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColorsComponent } from './colors/colors.component';
import { ContributedcolorsComponent } from './contributedcolors/contributedcolors.component';
import { ContributedgradientsComponent } from './contributedgradients/contributedgradients.component';
import { FavouritecolorComponent } from './favouritecolor/favouritecolor.component';
import { FavouritegradientComponent } from './favouritegradient/favouritegradient.component';
import { GradientsComponent } from './gradients/gradients.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'colors', component: ColorsComponent },
  { path: 'gradients', component: GradientsComponent },
  { path: 'favourite/colors', component: FavouritecolorComponent },
  { path: 'favourite/gradients', component: FavouritegradientComponent },
  { path: 'contributions/colors', component: ContributedcolorsComponent },
  { path: 'contributions/gradients', component: ContributedgradientsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
