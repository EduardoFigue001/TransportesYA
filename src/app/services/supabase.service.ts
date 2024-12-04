import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environment'; // Importa tu archivo de configuración

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly supabase: SupabaseClient;

  constructor() {
    // Usa las variables definidas en environment.ts
    const supabaseUrl = environment.supabaseUrl;
    const supabaseKey = environment.supabaseKey;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase URL o clave no están definidas. Asegúrate de que las configuraciones en environment.ts sean correctas.'
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
      throw new Error('Error al cerrar sesión.');
    }
  }

  async signUp(email: string, password: string): Promise<string | null> {
    if (!email || !password) {
      throw new Error('El correo y la contraseña son campos obligatorios.');
    }

    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Error al registrar usuario en auth:', error);
      throw new Error('Error al registrar el usuario en el sistema de autenticación.');
    }

    return data.user?.id || null;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const { data: clienteData } = await this.supabase
      .from('clientes')
      .select('id')
      .eq('correo', email)
      .single();

    const { data: choferData } = await this.supabase
      .from('choferes')
      .select('id')
      .eq('correo', email)
      .single();

    return !!clienteData || !!choferData;
  }

  async registrarUsuario(datos: any): Promise<void> {
    const { correo, clave, rol, ...restoDatos } = datos;

    const emailExists = await this.checkEmailExists(correo);
    if (emailExists) {
      throw new Error('El correo electrónico ya está registrado.');
    }

    if (!clave) {
      throw new Error('La contraseña (clave) es obligatoria.');
    }

    const userUuid = await this.signUp(correo, clave);
    if (!userUuid) {
      throw new Error('No se pudo obtener el UUID del usuario registrado.');
    }

    try {
      const tabla = rol === 'chofer' ? 'choferes' : 'clientes';
      const dataToInsert = {
        user_uuid: userUuid,
        correo,
        ...restoDatos,
      };

      const { error } = await this.supabase.from(tabla).insert(dataToInsert);
      if (error) {
        throw error;
      }

      console.log(`Usuario registrado con éxito en ${tabla}`);
    } catch (error) {
      console.error('Error al insertar datos en la tabla:', error);

      try {
        const { error: deleteUserError } = await this.supabase.auth.admin.deleteUser(userUuid);
        if (deleteUserError) {
          console.error('Error al eliminar usuario de auth.users:', deleteUserError);
        }
      } catch (deleteError) {
        console.error('Error al intentar eliminar al usuario de auth.users:', deleteError);
      }

      throw new Error('Error al registrar el usuario en la tabla personalizada.');
    }
  }

  async getSession(): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      console.error('Error al obtener la sesión actual:', error);
      throw new Error('No se pudo obtener la sesión actual.');
    }
    return data.session;
  }
}
