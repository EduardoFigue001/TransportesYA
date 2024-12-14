import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { AlertController } from '@ionic/angular';
// Quitar la línea de import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  nombre: string = '';
  correo: string = '';
  clave: string = '';
  rolSeleccionado: 'cliente' | 'chofer' = 'cliente';
  direccion: string = '';
  paisSeleccionado: string = '';
  regionSeleccionada: string = '';
  ciudadSeleccionada: string = '';
  tipoCamion: string = '';
  patente: string = '';
  modelo: string = '';
  anio: number | undefined = undefined;

  paises = [
    { nombre: 'Argentina', bandera: 'https://flagcdn.com/w320/ar.png', regiones: ['Buenos Aires', 'Córdoba', 'Santa Fe'] },
    { nombre: 'Chile', bandera: 'https://flagcdn.com/w320/cl.png', regiones: ['Santiago', 'Valparaíso', 'Antofagasta'] },
    { nombre: 'México', bandera: 'https://flagcdn.com/w320/mx.png', regiones: ['Ciudad de México', 'Jalisco', 'Nuevo León'] },
    { nombre: 'Perú', bandera: 'https://flagcdn.com/w320/pe.png', regiones: ['Lima', 'Cusco', 'Arequipa'] },
  ];

  regiones: string[] = [];
  ciudadesDisponibles: string[] = [];
  ciudades: { [key: string]: string[] } = {
    'Buenos Aires': ['La Plata', 'Mar del Plata', 'Bahía Blanca'],
    'Santiago': ['Providencia', 'Las Condes', 'Maipú'],
    'Valparaíso': ['Viña del Mar', 'Valparaíso', 'Quilpué'],
  };
  tipoCamiones = ['S', 'M', 'L', 'XL'];

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private alertController: AlertController
  ) {}

  actualizarRegiones() {
    const pais = this.paises.find((p) => p.nombre === this.paisSeleccionado);
    this.regiones = pais ? pais.regiones : [];
  }

  actualizarCiudades() {
    this.ciudadesDisponibles = this.ciudades[this.regionSeleccionada] || [];
  }

  async mostrarAlerta(header: string, mensaje: string) {
    const alert = await this.alertController.create({
      header,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async registrarUsuario() {
    try {
      if (!this.nombre || !this.correo || !this.clave || !this.rolSeleccionado) {
        await this.mostrarAlerta('Error', 'Todos los campos obligatorios deben ser completados.');
        return;
      }

      /**
       * Ya NO usamos bcrypt. La contraseña se manda "tal cual" al back-end
       * o a tu servicio Supabase, donde debe ocurrir el hashing.
       */
      const datos: {
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
      } = {
        nombre: this.nombre,
        correo: this.correo,
        clave: this.clave,  // Se envía sin hashear, delegamos el hash al back-end
        rol: this.rolSeleccionado,
        direccion: this.direccion || '',
        pais: this.paisSeleccionado || '',
        region: this.regionSeleccionada || '',
        ciudad: this.ciudadSeleccionada || '',
        tipo_camion: this.rolSeleccionado === 'chofer' ? this.tipoCamion : undefined,
        patente: this.rolSeleccionado === 'chofer' ? this.patente : undefined,
        modelo: this.rolSeleccionado === 'chofer' ? this.modelo : undefined,
        anio: this.rolSeleccionado === 'chofer' ? this.anio : undefined,
      };

      const { error } = await this.supabaseService.registrarUsuario(datos);

      if (error) {
        throw new Error(error.message);
      }

      await this.mostrarAlerta('Éxito', 'Usuario registrado correctamente.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      await this.mostrarAlerta('Error', error.message || 'Error inesperado al registrar el usuario.');
    }
  }
}
