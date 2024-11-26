import { Component } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  private supabase: SupabaseClient;
  rolSeleccionado: string = '';
  nombre: string = '';
  correo: string = '';
  clave: string = '';
  direccion: string = '';
  pais: string = '';
  region: string = '';
  tipoCamion: string = '';
  patente: string = '';
  modeloCamion: string = '';
  anioCamion: number | null = null;

  constructor() {
    // Configura el cliente Supabase
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async registrarUsuario(event: Event) {
    event.preventDefault();

    if (!this.nombre || !this.correo || !this.clave || !this.direccion || !this.pais || !this.region) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      if (this.rolSeleccionado === 'cliente') {
        // Inserta un cliente en la tabla
        const { error } = await this.supabase.from('clientes').insert({
          nombre: this.nombre,
          correo: this.correo,
          clave: this.clave,
          direccion: this.direccion,
          pais: this.pais,
          region: this.region,
        });

        if (error) {
          console.error('Error al registrar cliente:', error);
          alert('Error al registrar cliente. Inténtalo de nuevo.');
        } else {
          alert('Cliente registrado exitosamente.');
        }
      } else if (this.rolSeleccionado === 'chofer') {
        // Inserta un chofer en la tabla
        if (!this.tipoCamion || !this.patente || !this.modeloCamion || !this.anioCamion) {
          alert('Por favor, completa todos los campos del chofer.');
          return;
        }

        const { error } = await this.supabase.from('choferes').insert({
          nombre: this.nombre,
          correo: this.correo,
          clave: this.clave,
          tipo_camion: this.tipoCamion,
          patente: this.patente,
          modelo: this.modeloCamion,
          anio: this.anioCamion,
          direccion: this.direccion,
          pais: this.pais,
          region: this.region,
        });

        if (error) {
          console.error('Error al registrar chofer:', error);
          alert('Error al registrar chofer. Inténtalo de nuevo.');
        } else {
          alert('Chofer registrado exitosamente.');
        }
      } else {
        alert('Por favor, selecciona un rol válido.');
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Ocurrió un error inesperado. Inténtalo de nuevo.');
    }
  }
}
