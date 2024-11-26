import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from './services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService, private readonly router: Router) {}

  async canActivate(): Promise<boolean> {
    const session = await this.supabaseService.getSession();

    if (session) {
      return true; // Si el usuario tiene una sesión activa, permitir acceso
    } else {
      this.router.navigate(['/login']); // Si no, redirigir a la página de login
      return false;
    }
  }
}
