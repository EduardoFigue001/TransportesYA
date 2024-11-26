import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Utiliza forChild para rutas dentro de un módulo hijo
  exports: [RouterModule], // Exporta RouterModule para que sea accesible en el módulo de la página
})
export class ProfilePageRoutingModule {}
