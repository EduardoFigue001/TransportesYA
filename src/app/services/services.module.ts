import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ServicesPageRoutingModule } from './services-routing.module'; // Importar el módulo de rutas

import { ServiceService } from '../services/service.service'; // Importar el servicio

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesPageRoutingModule // Asegurar la importación del módulo de rutas
  ],
  
  providers: [ServiceService]  // Registrar el servicio en los proveedores
})
export class ServicesPageModule {}
