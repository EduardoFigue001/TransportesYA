import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly router: Router
  ) {}

  async login(): Promise<void> {
    try {
      if (!this.email || !this.password) {
        throw new Error('Por favor, ingresa un correo y una contraseña.');
      }

      // Consultamos la tabla 'usuarios'
      const { data: usuario, error } = await this.supabaseService.supabase
        .from('usuarios')
        .select('id, nombre, rol, correo, clave')
        .eq('correo', this.email)
        .maybeSingle();

      if (error || !usuario) {
        console.error('Usuario no encontrado o error:', error);
        throw new Error('Credenciales incorrectas.');
      }

      /**
       * SIN bcrypt: asumiendo que el back-end o la configuración 
       * de Supabase debe validar las credenciales.
       * 
       * Si tu tabla 'usuarios' guarda la contraseña hasheada en 'clave',
       * no puedes verificarla correctamente desde el front sin bcrypt.
       * Lo ideal: hacer un request a tu back-end/Supabase Auth 
       * que valide el usuario y la contraseña.
       * 
       * EJEMPLO BÁSICO: solo verifica que password = usuario.clave (inseguro).
       * */
      if (this.password !== usuario.clave) {
        throw new Error('Credenciales incorrectas.');
      }

      // Redirección en base al rol
      if (usuario.rol === 'cliente') {
        await this.redirectToRole('clientes', usuario.id, '/home-cliente');
      } else if (usuario.rol === 'chofer') {
        await this.redirectToRole('choferes', usuario.id, '/home-chofer');
      } else {
        throw new Error('Rol desconocido. Contacte al soporte.');
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al iniciar sesión:', errorMessage);
      alert(errorMessage);
    }
  }

  private async redirectToRole(
    tableName: string,
    userId: string,
    redirectUrl: string
  ): Promise<void> {
    try {
      const { data, error } = await this.supabaseService.supabase
        .from(tableName)
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) {
        console.error(`Error al obtener datos de ${tableName}:`, error);
        throw new Error(`No se encontró información adicional para el rol ${tableName}.`);
      }

      console.log(`Autenticado como ${tableName}:`, data);
      console.log(`Redirigiendo a ${redirectUrl}`);
      await this.router.navigateByUrl(redirectUrl);
    } catch (error) {
      console.error('Error en la redirección:', error);
      alert('No se pudo redirigir al rol correspondiente. Contacte al soporte.');
    }
  }
}
