import { Component } from '@angular/core';
import { SupabaseService } from './services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async logout() {
    try {
      await this.supabaseService.signOut();
      alert('Sesión cerrada con éxito');
      this.router.navigate(['/login']);  // Redirige al usuario a la página de login
    } catch (error: any) {
      alert('Error al cerrar sesión: ' + error.message);
    }
  }
}
