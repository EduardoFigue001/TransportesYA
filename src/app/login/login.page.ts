import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async login() {
    try {
      // Intenta iniciar sesión con el correo y la contraseña proporcionados
      await this.supabaseService.signIn(this.email, this.password);
      console.log('Inicio de sesión exitoso');

      // Redirige al usuario a la página de inicio
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // Aquí podrías agregar lógica para mostrar un mensaje de error al usuario
    }
  }
}
