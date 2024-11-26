import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Importa el módulo de Ionic

import { RouterModule } from '@angular/router';
import { ServicesPage } from 'src/app/services/services.page';

@NgModule({
  declarations: [ServicesPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // Asegúrate de incluir esto
    RouterModule.forChild([
      {
        path: '',
        component: ServicesPage,
      },
    ]),
  ],
})
export class ServicesPageModule {}
