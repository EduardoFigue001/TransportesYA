import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesPageRoutingModule } from './services-routing.module';

import { ServicesPage } from 'src/app/services/services.page'; // Reemplaza 'services.page' con el nombre de tu página
export interface Service {
  truck_type: string;
  date: string;
  time: string;
}
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesPageRoutingModule
  ],
  declarations: [ServicesPage]
})
export class ServicesPageModule {}
