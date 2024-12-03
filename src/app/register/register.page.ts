import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  // Variables para datos del formulario
  nombre: string = '';
  correo: string = '';
  clave: string = '';
  rolSeleccionado: string = 'cliente';
  direccion: string = '';
  paisSeleccionado: string = '';
  regionSeleccionada: string = '';
  ciudadSeleccionada: string = '';
  tipoCamion: string = '';
  patente: string = '';
  modelo: string = '';
  anio: number | null = null;

  // Datos estáticos para países, regiones y ciudades
  paises = [
    { nombre: 'Argentina', bandera: 'https://flagcdn.com/w320/ar.png', regiones: ['Buenos Aires', 'Córdoba', 'Santa Fe'] },
    { nombre: 'Chile', bandera: 'https://flagcdn.com/w320/cl.png', regiones: ['Santiago', 'Valparaíso', 'Antofagasta'] },
    { nombre: 'México', bandera: 'https://flagcdn.com/w320/mx.png', regiones: ['Ciudad de México', 'Jalisco', 'Nuevo León'] },
    { nombre: 'Perú', bandera: 'https://flagcdn.com/w320/pe.png', regiones: ['Lima', 'Cusco', 'Arequipa'] },
  ];

  regiones: string[] = [];
  ciudades: { [key: string]: string[] } = {
    'Buenos Aires': ['La Plata', 'Mar del Plata', 'Bahía Blanca'],
    Córdoba: ['Villa Carlos Paz', 'Alta Gracia', 'Río Cuarto'],
    'Santa Fe': ['Rosario', 'Santa Fe', 'Rafaela'],
    Santiago: ['Providencia', 'Las Condes', 'Maipú'],
    Valparaíso: ['Viña del Mar', 'Valparaíso', 'Quilpué'],
    Antofagasta: ['Antofagasta', 'Calama', 'Tocopilla'],
    'Ciudad de México': ['Coyoacán', 'Iztapalapa', 'Tlalpan'],
    Jalisco: ['Guadalajara', 'Zapopan', 'Puerto Vallarta'],
    'Nuevo León': ['Monterrey', 'San Pedro Garza García', 'Apodaca'],
    Lima: ['Miraflores', 'San Isidro', 'Surco'],
    Cusco: ['Cusco', 'Urubamba', 'Pisac'],
    Arequipa: ['Arequipa', 'Mollendo', 'Camaná'],
  };

  tipoCamiones = ['S', 'M', 'L', 'XL'];

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private alertController: AlertController
  ) {}

  // Actualizar regiones según el país seleccionado
  actualizarRegiones() {
    const pais = this.paises.find((p) => p.nombre === this.paisSeleccionado);
    this.regiones = pais ? pais.regiones : [];
    this.regionSeleccionada = '';
    this.ciudadSeleccionada = '';
  }

  // Actualizar ciudades según la región seleccionada
  actualizarCiudades() {
    this.ciudadSeleccionada = '';
  }

  // Función para mostrar alertas
  async mostrarAlerta(header: string, mensaje: string) {
    const alert = await this.alertController.create({
      header,
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }

  // Registro de usuarios
  async registrarUsuario(event: Event) {
    event.preventDefault();

    // Validación de campos requeridos
    if (!this.nombre || !this.correo || !this.clave || !this.direccion || !this.paisSeleccionado || !this.regionSeleccionada || !this.ciudadSeleccionada) {
      await this.mostrarAlerta('Campos requeridos', 'Todos los campos marcados son obligatorios.');
      return;
    }

    if (this.rolSeleccionado === 'chofer' && (!this.tipoCamion || !this.patente || !this.modelo || !this.anio)) {
      await this.mostrarAlerta('Campos requeridos', 'Todos los campos de chofer son obligatorios.');
      return;
    }

    // Preparar datos según el rol
    const datosComunes = {
      nombre: this.nombre,
      correo: this.correo,
      clave: this.clave,
      rol: this.rolSeleccionado,
      direccion: this.direccion,
      pais: this.paisSeleccionado,
      region: this.regionSeleccionada,
      ciudad: this.ciudadSeleccionada,
    };

    const datosRol = this.rolSeleccionado === 'chofer'
      ? { tipoCamion: this.tipoCamion, patente: this.patente, modelo: this.modelo, anio: this.anio }
      : {};

    try {
      // Registrar usuario
      await this.supabaseService.registrarUsuario({ ...datosComunes, ...datosRol });
      await this.mostrarAlerta('Éxito', `${this.rolSeleccionado === 'chofer' ? 'Chofer' : 'Cliente'} registrado con éxito.`);

      // Redirigir a la vista correspondiente
      this.router.navigate([this.rolSeleccionado === 'cliente' ? 'home-cliente' : 'home-chofer']);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      await this.mostrarAlerta('Error', 'Hubo un error al registrar el usuario. Por favor, intente nuevamente.');
    }
  }
}
