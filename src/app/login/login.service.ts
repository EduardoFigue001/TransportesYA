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
      const { data: cliente, error: clienteError } = await this.supabase
        .from('clientes')
        .select('id, nombre, rol, correo, clave')
        .eq('correo', email)
        .eq('clave', password) // Si las contraseñas no están cifradas
        .single();

      if (cliente) {
        console.log('Autenticado como cliente:', cliente);
        // Redirigir según el rol
        this.router.navigate(['/home-cliente']);
        return cliente;
      }

      const { data: chofer, error: choferError } = await this.supabase
        .from('choferes')
        .select('id, nombre, rol, correo, clave')
        .eq('correo', email)
        .eq('clave', password) // Si las contraseñas no están cifradas
        .single();

      if (chofer) {
        console.log('Autenticado como chofer:', chofer);
        // Redirigir según el rol
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
