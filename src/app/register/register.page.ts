import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { AlertController } from '@ionic/angular';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  nombre: string = '';
  correo: string = '';
  clave: string = '';
  rolSeleccionado: 'cliente' | 'chofer' = 'cliente'; // Tipo restringido a los valores permitidos
  direccion: string = '';
  paisSeleccionado: string = '';
  regionSeleccionada: string = '';
  ciudadSeleccionada: string = '';
  tipoCamion: string = '';
  patente: string = '';
  modelo: string = '';
  anio: number | null = null;

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
      const hashedPassword = await bcrypt.hash(this.clave, 10); // Hasheamos la contraseña

      // Ajustar las propiedades al formato esperado por el servicio
      const datos = {
        nombre: this.nombre,
        correo: this.correo,
        clave: hashedPassword, // Contraseña hasheada
        rol: this.rolSeleccionado, // Ahora es 'cliente' o 'chofer'
        direccion: this.direccion,
        pais: this.paisSeleccionado,
        region: this.regionSeleccionada,
        ciudad: this.ciudadSeleccionada,
        tipo_camion: this.tipoCamion || undefined, // Ajuste al nombre esperado
        patente: this.patente || undefined, // Ajuste al nombre esperado
        modelo: this.modelo || undefined, // Ajuste al nombre esperado
        anio: this.anio || undefined, // Manejo de valores nulos
      };

      // Registrar usuario
      await this.supabaseService.registrarUsuario(datos);
      await this.mostrarAlerta('Éxito', 'Usuario registrado correctamente.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      await this.mostrarAlerta('Error', error.message || 'Error inesperado al registrar el usuario.');
    }
  }
}
