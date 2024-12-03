import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = ''; // Propiedad para el email del usuario
  password: string = ''; // Propiedad para la contraseña del usuario
  profilePhoto: string | undefined; // Propiedad para almacenar la foto de perfil

  constructor(private readonly loginService: LoginService, private readonly router: Router) {}

  // Método para iniciar sesión
  async login() {
    try {
      console.log('Intentando iniciar sesión con:', this.email, this.password); // Debugging
      const user = await this.loginService.login(this.email, this.password);

      if (user) {
        console.log('Usuario autenticado:', user);

        // Redirecciona según el rol del usuario
        if (user.rol === 'cliente') {
          this.router.navigate(['/home-cliente']); // Página de cliente
        } else if (user.rol === 'chofer') {
          this.router.navigate(['/home-chofer']); // Página de chofer
        } else {
          console.error('Rol desconocido:', user.rol);
          alert('Error: rol desconocido. Contacte al soporte.');
        }
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error.message);
      alert('Credenciales incorrectas. Por favor, verifica tu correo y contraseña.');
    }
  }

  // Método para capturar una foto de perfil
  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl, // Devuelve la imagen como Data URL
        source: CameraSource.Camera, // Usa la cámara como fuente
      });

      // Guarda la foto capturada
      this.profilePhoto = image.dataUrl;
      console.log('Foto capturada con éxito');
    } catch (error) {
      console.error('Error al capturar la foto:', error);
      alert('No se pudo capturar la foto. Inténtalo de nuevo.');
    }
  }
}
