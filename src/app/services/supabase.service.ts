import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://tbttriwluxapxmukdgcj.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InTidHRyaXdsdXhhcHhtdWtkZ2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1ODMzNTMsImV4cCI6MjA0NTE1OTM1M30.IELjZnoWXXcBz6OJTF5JLYyKFBW5Op3yb0YCoe6cYoU'
    );
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  // Registra un usuario en auth y devuelve su UUID
  async signUp(email: string, password: string): Promise<string | null> {
    if (!email || !password) {
      throw new Error('El correo y la contraseña son campos obligatorios.');
    }

    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Error al registrar usuario en auth:', error);
      throw new Error('Error al registrar el usuario en el sistema de autenticación.');
    }

    return data.user?.id || null; // Retorna el UUID del usuario creado
  }

  // Verifica si el correo ya existe en las tablas 'clientes' o 'choferes'
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

    return !!clienteData || !!choferData; // Devuelve true si el correo ya está registrado
  }

  // Registra un usuario en la tabla correspondiente ('clientes' o 'choferes')
  async registrarUsuario(datos: any): Promise<void> {
    const { correo, clave, rol, ...extraData } = datos;

    // Verificar si el correo ya está registrado
    const emailExists = await this.checkEmailExists(correo);
    if (emailExists) {
      throw new Error('El correo electrónico ya está registrado.');
    }

    // Crear usuario en auth y obtener UUID
    const userUuid = await this.signUp(correo, clave);
    if (!userUuid) {
      throw new Error('No se pudo obtener el UUID del usuario registrado.');
    }

    try {
      // Insertar datos adicionales según el rol
      const tabla = rol === 'chofer' ? 'choferes' : 'clientes';
      const dataToInsert = { user_uuid: userUuid, correo, ...extraData };

      const { error } = await this.supabase.from(tabla).insert(dataToInsert);
      if (error) {
        throw error; // Lanza un error para ser capturado en el catch
      }

      console.log(`Usuario registrado con éxito en ${tabla}`);
    } catch (error) {
      console.error(`Error al insertar datos en la tabla correspondiente:`, error);

      // Intentar eliminar el usuario de auth.users en caso de error
      const { error: deleteUserError } = await this.supabase.auth.admin.deleteUser(userUuid);
      if (deleteUserError) {
        console.error(`Error al eliminar usuario de auth.users:`, deleteUserError);
      }

      throw new Error('Error al registrar el usuario en la tabla personalizada.');
    }
  }

  // Método para obtener la sesión actual del usuario
  async getSession(): Promise<Session | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }
}
