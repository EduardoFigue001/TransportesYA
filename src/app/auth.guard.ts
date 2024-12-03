import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './login/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly loginService: LoginService, private readonly router: Router) {}

  async canActivate(): Promise<boolean> {
    const user = await this.loginService.getUser();

    if (user) {
      // Verificar si el usuario tiene rol válido
      if (user.role === 'cliente' || user.role === 'chofer') {
        return true; // Permitir el acceso a la ruta
      }
    }

    // Si no hay usuario o el rol no es válido, redirigir al login
    this.router.navigate(['/login']);
    return false;
  }
}
