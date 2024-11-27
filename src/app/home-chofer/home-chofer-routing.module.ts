import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeChoferPage } from './home-chofer.page';

const routes: Routes = [
  {
    path: '',
    component: HomeChoferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeChoferPageRoutingModule {}
