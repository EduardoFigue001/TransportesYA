import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page'; // Cambiar 'Login' por 'LoginPage'

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // Necesario para el uso de ngModel
    IonicModule,
    LoginPageRoutingModule,
  ],
  declarations: [LoginPage], // Asegúrate de declarar la clase correcta
})
export class LoginPageModule {}
