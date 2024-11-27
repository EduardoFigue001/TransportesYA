import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly supabase: SupabaseClient;

  constructor(private readonly router: Router) {
    this.supabase = createClient(
      'https://tbttriwluxapxmukdgcj.supabase.co', // Reemplazar con variables de entorno
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Reemplazar con variables de entorno
    );
  }

  // Método para iniciar sesión y verificar rol en 'choferes' o 'clientes'
  async signIn(email: string, password: string): Promise<boolean> {
    try {
      // Verificar en ambas tablas (clientes y choferes)
      const tables = ['clientes', 'choferes'];
      for (const table of tables) {
        const { data, error } = await this.supabase
          .from(table)
          .select('id, nombre, rol')
          .eq('correo', email)
          .eq('clave', password)
          .single();

        if (data) {
          // Verificar que el rol sea válido
          if (data.rol === 'cliente') {
            console.log('Autenticado como cliente:', data.nombre);
            this.router.navigate(['./home-cliente']); // Vista de cliente
            return true;
          } else if (data.rol === 'chofer') {
            console.log('Autenticado como chofer:', data.nombre);
            this.router.navigate(['./home-chofer']); // Vista de chofer
            return true;
          } else {
            console.error(`El rol "${data.rol}" no tiene permiso para iniciar sesión.`);
            return false;
          }
        }

        if (error) {
          console.log(`Usuario no encontrado en la tabla ${table}:`, error.message);
        }
      }

      // Si no se encontró en ninguna tabla
      console.error('Credenciales incorrectas o usuario no permitido.');
      return false;
    } catch (err) {
      console.error('Error inesperado al iniciar sesión:', err);
      return false;
    }
  }

  // Obtener la sesión del usuario actual
  async getSession(): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      console.error('Error al obtener la sesión:', error.message);
      return null;
    }
    return data.session;
  }

  // Obtener perfil del usuario
  public async getUserProfile(
    userId: string,
    role: 'chofer' | 'cliente'
  ): Promise<{ data: any | null; error: any | null }> {
    const table = role === 'chofer' ? 'choferes' : 'clientes';
    return this.querySupabase(table, 'id', userId);
  }

  // Obtener viajes del usuario
  public async getUserTrips(userId: string, role: 'chofer' | 'cliente'): Promise<{ data: any[] | null; error: any | null }> {
    const column = role === 'chofer' ? 'chofer_id' : 'cliente_id';
    return this.querySupabase('viajes', column, userId);
  }

  // Obtener servicios del usuario
  public async getUserServices(userId: string, role: 'chofer' | 'cliente'): Promise<{ data: any[] | null; error: any | null }> {
    const column = role === 'chofer' ? 'chofer_id' : 'cliente_id';
    return this.querySupabase('services', column, userId);
  }

  // Método genérico para consultar Supabase
  public async querySupabase(
    table: string,
    filterColumn: string,
    filterValue: string
  ): Promise<{ data: any[] | null; error: any | null }> {
    try {
      const { data, error } = await this.supabase.from(table).select('*').eq(filterColumn, filterValue);

      if (error) {
        console.error(`Error al consultar la tabla ${table}:`, error.message);
        return { data: null, error };
      }
      return { data, error: null };
    } catch (err) {
      console.error('Error inesperado al consultar Supabase:', err);
      return { data: null, error: err };
    }
  }

  // Método para cerrar sesión
  public async signOut(): Promise<void> {
    try {
      await this.supabase.auth.signOut();
      console.log('Sesión cerrada correctamente');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  }
}
