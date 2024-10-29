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

  // Crear un nuevo servicio en la base de datos
  async createService(serviceData: { user_id: string; truck_type: string; date: string; time: string; }) {
    const { data, error } = await this.supabase
      .from('services')
      .insert([serviceData]);
    return { data, error };
  }

  // Registro de usuario en la base de datos
  async createUser(userData: { user_id: string; role: string; email: string; password: string; name: string | null; birth_date: string | null; address: string | null; truck_model: string | null; truck_year: number | null; truck_license_plate: string | null; }) {
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email: userData.email,
      password: userData.password
    });

    if (authError) throw authError;

    const { data, error } = await this.supabase
      .from('profiles')
      .insert([{
        user_id: authData.user?.id,
        role: userData.role,
        name: userData.name,
        birth_date: userData.birth_date,
        address: userData.address,
        truck_model: userData.truck_model,
        truck_year: userData.truck_year,
        truck_license_plate: userData.truck_license_plate
      }]);

    if (error) throw error;
    return data;
  }

  // Crear un nuevo usuario en la tabla users
  async createUserInUsersTable(userData: any) {
    const { data, error } = await this.supabase
      .from('users')
      .insert([userData]);
    if (error) throw error;
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

  // Obtener perfil del usuario actual desde 'profiles' (tabla personalizada)
  async getUserProfile(userId: string) {
    // Llamamos a getUserDetails para obtener los detalles del usuario
    return this.getUserDetails(userId);
  }

  // Obtener servicios del usuario
  async getUserServices(id: string) {
    const { data, error } = await this.supabase
      .from('services')
      .select('*')
      .eq('user_id', id);

    if (error) throw error;
    return { data, error };
  }

  // Obtener los viajes del usuario
  async getUserTrips(userId: string) {
    const { data, error } = await this.supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error al obtener el historial de viajes:', error);
      return [];
    }

    return data;
  }

  // Obtener la sesión
  async getSession(): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data.session || null;  // Retorna la sesión actual o null si no hay sesión
  }
}
