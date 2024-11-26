import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = ''; // Define la propiedad email
  password: string = ''; // Define la propiedad password

  constructor(private readonly loginService: LoginService, private readonly router: Router) {}

  async login() {
    try {
      const user = await this.loginService.login(this.email, this.password);
      console.log('Usuario logueado:', user);

      // Redirigir al perfil del usuario después de un login exitoso
      if (user?.id) {
        this.router.navigate(['/profile', user.id]); // Redirigir con el ID del usuario
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error.message);
    }
  }
}
