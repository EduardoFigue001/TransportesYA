import { Component } from '@angular/core';
// Importa las clases necesarias de Capacitor Camera
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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

  // Foto de perfil por defecto; se puede reemplazar al tomar la foto.
  profilePhoto: string = 'assets/icon/default-profile.png';

  constructor() {}

  async takePicture() {
    try {
      // Abre la cámara y toma la foto
      const image = await Camera.getPhoto({
        quality: 80,                 // Ajusta la calidad de la foto (0-100)
        allowEditing: false,         // Permitir o no recorte/edición previa
        resultType: CameraResultType.DataUrl, // Devuelve la foto como base64 (dataURL)
        source: CameraSource.Camera  // Fuerza a usar la cámara del dispositivo
      });

      // Asigna la foto tomada a la variable profilePhoto
      this.profilePhoto = image.dataUrl ?? this.profilePhoto;
      console.log('Foto tomada exitosamente');

    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }
}
