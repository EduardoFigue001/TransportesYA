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
      // Verificar si el usuario es cliente o chofer
      if (user.role === 'cliente') {
        this.router.navigate(['/home-cliente']);
      } else if (user.role === 'chofer') {
        this.router.navigate(['/home-chofer']);
      }
      return true;
    } else {
      this.router.navigate(['/login']); // Si no, redirigir a la página de login
      return false;
    }
  }
}
