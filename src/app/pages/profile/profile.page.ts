import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '@supabase/supabase-js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any = {}; // Inicializamos como objeto vacío
  userId: string | null = null;
  profileImage: string = ''; // Para almacenar la imagen de perfil seleccionada

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  async ngOnInit() {
    try {
      const session: Session | null = await this.supabaseService.getSession();

      if (session?.user?.id) {
        this.userId = session.user.id;

        // Determinar el rol del usuario
        const rol = await this.getUserRole(this.userId);

        // Obtener el perfil del usuario con el rol
        const { data, error } = await this.supabaseService.getUserProfile(this.userId, rol);
        if (error) {
          console.error('Error al cargar el perfil del usuario:', error.message || error);
        } else {
          this.user = data || {}; // Asignar los datos del perfil o un objeto vacío
        }
      } else {
        console.error('No hay sesión activa o el usuario no está logueado.');
        this.router.navigate(['/login']); // Redirigir al login si no hay sesión activa
      }
    } catch (error: any) {
      console.error('Error al cargar el perfil del usuario:', error?.message || error);
      this.router.navigate(['/login']); // Redirigir en caso de error
    }
  }

  // Método para determinar el rol del usuario
  async getUserRole(userId: string): Promise<'chofer' | 'cliente'> {
    try {
      const { data, error } = await this.supabaseService.getUserProfile(userId, 'cliente');
      if (error || !data) {
        console.warn('No se pudo determinar el rol del usuario, asignando "cliente" por defecto');
        return 'cliente';
      }
      return data.rol as 'chofer' | 'cliente'; // Retornar el rol según los datos
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
      return 'cliente'; // Valor por defecto en caso de error
    }
  }

  // Método para manejar la selección de la imagen
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.previewImage(file);
      // Aquí puedes agregar la lógica para subir la imagen a Supabase o almacenarla en la base de datos
    }
  }

  // Este método genera una URL de la imagen seleccionada para previsualizarla
  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profileImage = e.target.result;
      // También podrías guardar la imagen en el perfil del usuario aquí
    };
    reader.readAsDataURL(file);
  }

  // Función para cargar la imagen de perfil actual (si se ha cargado una nueva imagen, usarla)
  getProfileImage(): string {
    return this.profileImage || this.user.profileImage || 'assets/icon/default-profile.png';
  }

  async uploadProfileImage() {
    console.log('Cambiar Imagen de Perfil: Funcionalidad pendiente.');
    // Aquí puedes implementar la lógica para subir la nueva imagen a tu servidor o almacenamiento en la nube
  }

  async logout() {
    try {
      await this.supabaseService.signOut();
      this.router.navigate(['/login']); // Redirigir al usuario a la página de inicio de sesión
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error?.message || error);
    }
  }
}
