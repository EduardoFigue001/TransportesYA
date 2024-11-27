import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeChoferPageRoutingModule } from './home-chofer-routing.module';

import { HomeChoferPage } from './home-chofer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeChoferPageRoutingModule
  ],
  declarations: [HomeChoferPage]
})
export class HomeChoferPageModule {}
