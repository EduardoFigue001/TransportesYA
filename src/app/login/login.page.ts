import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = ''; // Propiedad para el email del usuario
  password: string = ''; // Propiedad para la contraseña del usuario

  constructor(private readonly loginService: LoginService, private readonly router: Router) {}

  async login() {
    try {
      console.log('Intentando iniciar sesión con:', this.email, this.password); // Debugging
      const user = await this.loginService.login(this.email, this.password);

      if (user) {
        console.log('Usuario autenticado:', user);

        // Redirecciona según el rol del usuario
        if (user.rol === 'cliente') {
          this.router.navigate(['/home-cliente']); // Página de cliente
        } else if (user.rol === 'chofer') {
          this.router.navigate(['/home-chofer']); // Página de chofer
        } else {
          console.error('Rol desconocido:', user.rol);
          alert('Error: rol desconocido. Contacte al soporte.');
        }
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error.message);
      alert('Credenciales incorrectas. Por favor, verifica tu correo y contraseña.');
    }
  }
}
