import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SupabaseService } from '../services/supabase.service';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  profilePhoto: string | undefined;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly router: Router
  ) {}

  async login(): Promise<void> {
    try {
      if (!this.email || !this.password) {
        throw new Error('Por favor, ingresa un correo y una contraseña.');
      }

      const { data: usuario, error } = await this.supabaseService.supabase
        .from('usuarios')
        .select('id, nombre, rol, correo, clave')
        .eq('correo', this.email)
        .maybeSingle();

      if (error || !usuario) {
        console.error('Usuario no encontrado o error:', error);
        throw new Error('Credenciales incorrectas.');
      }

      const passwordMatch = await bcrypt.compare(this.password, usuario.clave);

      if (!passwordMatch) {
        throw new Error('Credenciales incorrectas.');
      }

      if (usuario.rol === 'cliente') {
        await this.redirectToRole('clientes', usuario.id, '/home-cliente');
      } else if (usuario.rol === 'chofer') {
        await this.redirectToRole('choferes', usuario.id, '/home-chofer');
      } else {
        throw new Error('Rol desconocido. Contacte al soporte.');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al iniciar sesión:', errorMessage);
      alert(errorMessage);
    }
  }

  private async redirectToRole(
    tableName: string,
    userId: string,
    redirectUrl: string
  ): Promise<void> {
    const { data, error } = await this.supabaseService.supabase
      .from(tableName)
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      throw new Error(`No se encontró información adicional para el ${tableName}.`);
    }

    console.log(`Autenticado como ${tableName}:`, data);
    await this.router.navigate([redirectUrl]);
  }

  async takePicture(): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      this.profilePhoto = image.dataUrl;

      if (this.profilePhoto) {
        await this.uploadProfilePhoto(this.profilePhoto);
      }
    } catch (error) {
      console.error('Error al capturar la foto:', error);
      alert('No se pudo capturar la foto. Inténtalo nuevamente.');
    }
  }

  private async uploadProfilePhoto(photoDataUrl: string): Promise<void> {
    try {
      const blob = this.dataUrlToBlob(photoDataUrl);
      const fileName = `profile_${Date.now()}.png`;

      const { data, error } = await this.supabaseService.supabase.storage
        .from('profile-photos')
        .upload(fileName, blob, { contentType: 'image/png' });

      if (error) {
        throw new Error('No se pudo subir la foto de perfil.');
      }

      console.log('Foto subida correctamente:', data);
    } catch (error) {
      console.error('Error al subir la foto:', error);
      alert('No se pudo guardar la foto de perfil.');
    }
  }

  private dataUrlToBlob(dataUrl: string): Blob {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  }
}
