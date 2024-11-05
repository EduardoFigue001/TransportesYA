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
  user: any = {};
  userId: string | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    // Obtener el ID de usuario de los parámetros de la ruta
    this.userId = this.route.snapshot.paramMap.get('id');

    // Cargar el perfil del usuario si se proporciona un ID
    if (this.userId) {
      this.user = await this.supabaseService.getUserProfile(this.userId);
    }
  }

  async ionViewWillEnter() {
    // Obtener la sesión actual del usuario
    const session: Session | null = await this.supabaseService.getSession();

    // Si hay una sesión activa, cargar los detalles del usuario
    if (session?.user?.id) {
      this.user = await this.supabaseService.getUserDetails(session.user.id);
    } else {
      console.error('No hay sesión activa o el usuario no está logueado.');
      this.router.navigate(['/login']); // Redirigir al login si no hay sesión activa
    }
  }

  async uploadProfileImage() {
    // Lógica para subir imagen de perfil (por implementar)
  }

  async logout() {
    try {
      await this.supabaseService.signOut();
      this.router.navigate(['/login']); // Redirigir al usuario a la página de inicio de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  getProfileImage(): string {
    // Retornar la imagen de perfil según el rol del usuario
    return this.user.role === 'chofer'
      ? this.user.profileImage || 'assets/icon/camion.png'
      : this.user.profileImage || 'assets/icon/cliente.png';
  }
}
