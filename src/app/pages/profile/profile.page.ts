import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  user: any = {
    name: 'Nombre de Usuario',
    email: 'usuario@ejemplo.com',
    role: 'cliente',
  };

  // Definir la propiedad profilePhoto
  profilePhoto: string = 'assets/icon/default-profile.png';

  constructor() {}

  takePicture() {
    console.log('Función para cambiar la imagen de perfil.');
  }
}
