import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public readonly supabase: SupabaseClient;

  constructor() {
    const { supabaseUrl, supabaseKey } = environment;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase URL o clave no están configuradas. Verifica el archivo environment.ts.'
      );
    }

    // Crear el cliente de Supabase con configuración adecuada
    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true, // Mantener la sesión persistente
        lock: undefined,      // Evita problemas con Navigator LockManager
      },
    });
  }

  /**
   * Cierra la sesión del usuario actual
   */
  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw new Error('Error al cerrar sesión: ' + error.message);
    }
  }

  /**
   * Verifica si un correo ya está registrado
   */
  async checkEmailExists(email: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('id')
      .eq('correo', email)
      .maybeSingle();

    if (error) {
      console.error('Error al verificar correo:', error.message);
      return false;
    }

    return !!data;
  }

  /**
   * Registra un usuario en `usuarios` y en la tabla correspondiente
   */
  async registrarUsuario(datos: {
    nombre: string;
    correo: string;
    clave: string;
    direccion: string;
    pais: string;
    region: string;
    ciudad: string;
    rol: 'cliente' | 'chofer';
    tipo_camion?: string;
    patente?: string;
    modelo?: string;
    anio?: number;
  }): Promise<{ data?: any; error?: any }> {
    const { rol, tipo_camion, patente, modelo, anio, ...usuarioData } = datos;

    if (await this.checkEmailExists(usuarioData.correo)) {
      throw new Error('El correo ya está registrado.');
    }

    // Hashear la contraseña antes de registrarla
    const hashedPassword = CryptoJS.SHA256(usuarioData.clave).toString();

    // Registrar en `usuarios`
    const { data: usuario, error: userError } = await this.supabase
      .from('usuarios')
      .insert({
        ...usuarioData,
        clave: hashedPassword, // Almacena la contraseña hasheada
        rol,
      })
      .select('*')
      .single();

    if (userError || !usuario) {
      throw new Error('Error al registrar en usuarios: ' + userError?.message);
    }

    // Registrar en tabla específica según el rol
    if (rol === 'chofer') {
      const { error } = await this.supabase.from('choferes').insert({
        user_id: usuario.id,
        tipo_camion,
        patente,
        modelo,
        anio,
      });

      if (error) {
        throw new Error('Error al registrar en choferes: ' + error.message);
      }
    } else if (rol === 'cliente') {
      const { error } = await this.supabase.from('clientes').insert({
        user_id: usuario.id,
      });

      if (error) {
        throw new Error('Error al registrar en clientes: ' + error.message);
      }
    } else {
      throw new Error('Rol desconocido. Solo se permite cliente o chofer.');
    }

    return { data: usuario };
  }

  /**
   * Obtiene la sesión actual del usuario
   */
  async getSession(): Promise<Session | null> {
    try {
      const { data, error } = await this.supabase.auth.getSession();
      if (error) {
        console.error('Error al obtener la sesión:', error);
        return null;
      }
      return data.session;
    } catch (error) {
      console.error('Error desconocido al obtener la sesión:', error);
      return null;
    }
  }

  /**
   * Obtiene un usuario por correo
   */
  async obtenerUsuarioPorCorreo(correo: string): Promise<{ data?: any; error?: any }> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*')
      .eq('correo', correo)
      .maybeSingle();
    return { data, error };
  }

  /**
   * Obtiene información del rol (cliente o chofer) según el user_id
   */
  async obtenerDatosRol(tabla: string, userId: string): Promise<{ data?: any; error?: any }> {
    const { data, error } = await this.supabase
      .from(tabla)
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    return { data, error };
  }

  /**
   * Sube una foto de perfil al almacenamiento de Supabase
   */
  async subirFotoPerfil(fileName: string, blob: Blob): Promise<{ data?: any; error?: any }> {
    const { data, error } = await this.supabase.storage
      .from('profile-photos')
      .upload(fileName, blob, { contentType: 'image/png' });
    return { data, error };
  }
}
