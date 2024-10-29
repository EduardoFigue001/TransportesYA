import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';
import { ActivatedRoute } from '@angular/router';
import { Session } from '@supabase/supabase-js';  // Importa el tipo Session

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any = {};  // Aquí almacenaremos los detalles del usuario
  userId: string | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    // Obtener el parámetro de la URL (si existe)
    this.userId = this.route.snapshot.paramMap.get('id');

    // Si el userId está presente en la URL, obtenemos el perfil del usuario
    if (this.userId) {
      this.user = await this.supabaseService.getUserProfile(this.userId);
    }
  }

  async ionViewWillEnter() {
    // Obtenemos la sesión activa
    const session: Session | null = await this.supabaseService.getSession();

    // Verificamos si hay una sesión activa y si hay un usuario logueado
    if (session?.user?.id) {
      // Obtenemos los detalles del usuario si hay sesión
      this.user = await this.supabaseService.getUserDetails(session.user.id);
    } else {
      // Manejar el caso cuando no hay usuario logueado o sesión activa
      console.error('No hay sesión activa o el usuario no está logueado.');
    }
  }

  async uploadProfileImage() {
    // Lógica para subir imagen de perfil
    // Podrías abrir el selector de archivos o usar la cámara si está disponible
  }
}
