import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://tbttriwluxapxmukdgcj.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidHRyaXdsdXhhcHhtdWtkZ2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1ODMzNTMsImV4cCI6MjA0NTE1OTM1M30.IELjZnoWXXcBz6OJTF5JLYyKFBW5Op3yb0YCoe6cYoU'
    );
  }

  /**
   * Autentica al usuario verificando las credenciales en las tablas `clientes` y `choferes`.
   * @param email Correo electrónico del usuario
   * @param password Contraseña del usuario
   * @returns Datos del usuario si las credenciales son correctas; error en caso contrario.
   */
  async login(email: string, password: string) {
    try {
      // Verificar en la tabla de clientes
      const { data: cliente, error: clienteError } = await this.supabase
        .from('clientes')
        .select('id, nombre, rol, correo, clave')
        .eq('correo', email)
        .eq('clave', password) // Si las contraseñas no están cifradas
        .single();

      if (cliente) {
        console.log('Autenticado como cliente:', cliente);
        return cliente; // Retorna el cliente autenticado
      }

      // Verificar en la tabla de choferes
      const { data: chofer, error: choferError } = await this.supabase
        .from('choferes')
        .select('id, nombre, rol, correo, clave')
        .eq('correo', email)
        .eq('clave', password) // Si las contraseñas no están cifradas
        .single();

      if (chofer) {
        console.log('Autenticado como chofer:', chofer);
        return chofer; // Retorna el chofer autenticado
      }

      // Si no se encontró en ninguna tabla
      throw new Error('Credenciales incorrectas');
    } catch (error: any) {
      console.error('Error en login:', error.message);
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }

  /**
   * Obtiene el usuario actualmente autenticado.
   */
  async getUser() {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }
}
