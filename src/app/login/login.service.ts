import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly supabase: SupabaseClient;

  constructor(private readonly router: Router) {
    this.supabase = createClient(
      'https://tbttriwluxapxmukdgcj.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidHRyaXdsdXhhcHhtdWtkZ2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1ODMzNTMsImV4cCI6MjA0NTE1OTM1M30.IELjZnoWXXcBz6OJTF5JLYyKFBW5Op3yb0YCoe6cYoU'
    );
  }

  async login(email: string, password: string) {
    try {
      // Validación simple de que el correo y la contraseña no estén vacíos
      if (!email || !password) {
        throw new Error('Por favor ingrese un correo y una contraseña.');
      }

      const { data: cliente, error: clienteError } = await this.supabase
        .from('clientes')
        .select('id, nombre, rol, correo, clave')
        .eq('correo', email)
        .single();

      if (cliente && cliente.clave === password) { // Comparación de contraseñas
        console.log('Autenticado como cliente:', cliente);
        this.router.navigate(['/home-cliente']);
        return cliente;
      }

      const { data: chofer, error: choferError } = await this.supabase
        .from('choferes')
        .select('id, nombre, rol, correo, clave')
        .eq('correo', email)
        .single();

      if (chofer && chofer.clave === password) { // Comparación de contraseñas
        console.log('Autenticado como chofer:', chofer);
        this.router.navigate(['/home-chofer']);
        return chofer;
      }

      throw new Error('Credenciales incorrectas');
    } catch (error: any) {
      console.error('Error en login:', error.message);
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }

  async getUser() {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }
}
