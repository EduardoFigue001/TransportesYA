import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { SupabaseService } from './services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    try {
      const session = await this.supabaseService.getSession();

      if (session?.user) {
        const { data: userData, error } = await this.supabaseService.supabase
          .from('usuarios')
          .select('rol')
          .eq('id', session.user.id)
          .single();

        if (error || !userData) {
          console.error('Error al obtener el rol del usuario:', error);
          this.router.navigate(['/login']);
          return false;
        }

        const requiredRole = route.data?.['role'];
        if (requiredRole && userData.rol !== requiredRole) {
          console.warn('Acceso denegado: Rol no autorizado.');
          this.router.navigate(['/login']);
          return false;
        }

        return true;
      }

      this.router.navigate(['/login']);
      return false;
    } catch (error) {
      console.error('Error en AuthGuard:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
