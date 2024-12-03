import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Asegúrate de importar IonicModule
import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // Importando IonicModule aquí
    ProfilePageRoutingModule, // Asegúrate de que ProfilePageRoutingModule esté correctamente importado
  ],
  declarations: [ProfilePage], // Declarando el componente ProfilePage aquí
})
export class ProfilePageModule {}
