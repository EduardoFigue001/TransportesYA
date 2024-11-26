import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Obtener servicios
  async getServices() {
    const { data, error } = await this.supabase
      .from('services')
      .select('*');

    if (error) {
      console.error('Error al obtener los servicios:', error);
      return [];
    }
    return data;
  }

  // Obtener detalles del usuario por ID
  async getUserDetails(userId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error al obtener los detalles del usuario:', error);
      return null;
    }
    return data;
  }

  // Registro de usuario
  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data.user;
  }

  // Login de usuario
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }

  // Logout
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  // Obtener la sesión
  async getSession(): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data.session || null;
  }

  // Obtener perfil del usuario actual desde 'profiles' (tabla personalizada)
  async getUserProfile(userId: string) {
    return this.getUserDetails(userId);
  }
}
