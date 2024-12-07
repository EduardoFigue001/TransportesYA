import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../app/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService, private readonly router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const session = await this.supabaseService.getSession();

      if (session?.user) {
        const { data: userData, error } = await this.supabaseService.supabase
          .from('usuarios')
          .select('rol')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error al obtener el rol del usuario:', error.message);
          this.router.navigate(['/login']);
          return false;
        }

        if (userData && ['cliente', 'chofer'].includes(userData.rol)) {
          return true; // Permitir acceso
        }
      }

      this.router.navigate(['/login']);
      return false;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error en AuthGuard:', errorMessage);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
