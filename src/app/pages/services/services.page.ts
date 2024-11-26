import { Component } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage {
  camiones: any[] = [];
  selectedCamion: any = null;
  ubicacionInicio: string = '';
  ubicacionFin: string = '';
  supabase: SupabaseClient;

  // Configuración del mapa
  center: google.maps.LatLngLiteral = { lat: 19.432608, lng: -99.133209 }; // Ubicación inicial (CDMX)
  zoom = 12;
  startMarker: google.maps.LatLngLiteral | null = null;
  endMarker: google.maps.LatLngLiteral | null = null;

  constructor() {
    this.supabase = new SupabaseClient(
      'https://tbttriwluxapxmukdgcj.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidHRyaXdsdXhhcHhtdWtkZ2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1ODMzNTMsImV4cCI6MjA0NTE1OTM1M30.IELjZnoWXXcBz6OJTF5JLYyKFBW5Op3yb0YCoe6cYoU'
    );
    this.getCamiones();
  }

  // Obtener lista de camiones desde Supabase
  async getCamiones() {
    const { data, error } = await this.supabase.from('camiones').select('*');
    if (!error) {
      this.camiones = data;
    } else {
      console.error(error);
    }
  }

  // Seleccionar camión
  seleccionarCamion(camion: any) {
    this.selectedCamion = camion;
  }

  // Obtener ubicación actual usando GPS
  async obtenerUbicacion() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Ubicación:', coordinates);
      this.ubicacionInicio = `${coordinates.coords.latitude} ${coordinates.coords.longitude}`;
      this.center = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
      };
      alert(`Ubicación actual obtenida: ${this.ubicacionInicio}`);
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      alert('No se pudo obtener la ubicación. Verifica los permisos.');
    }
  }

  // Manejar clics en el mapa para definir ubicaciones de inicio y destino
  onMapClick(event: google.maps.MapMouseEvent) {
    if (!this.startMarker) {
      this.startMarker = event.latLng?.toJSON() || null;
      this.ubicacionInicio = `${this.startMarker.lat}, ${this.startMarker.lng}`;
    } else if (!this.endMarker) {
      this.endMarker = event.latLng?.toJSON() || null;
      this.ubicacionFin = `${this.endMarker.lat}, ${this.endMarker.lng}`;
    }
  }

  // Guardar el viaje en Supabase
  async guardarViaje(event: Event) {
    event.preventDefault();

    const clienteId = 'ID_DEL_USUARIO'; // Reemplaza con el ID del cliente autenticado
    const { data, error } = await this.supabase.from('historial_viajes').insert({
      cliente_id: clienteId,
      camion_id: this.selectedCamion.id,
      ubicacion_inicio: `POINT(${this.ubicacionInicio})`,
      ubicacion_fin: `POINT(${this.ubicacionFin})`,
    });

    if (!error) {
      console.log('Viaje guardado:', data);
      alert('El servicio se guardó exitosamente.');
      this.resetFormulario();
    } else {
      console.error(error);
      alert('Hubo un error al guardar el servicio.');
    }
  }

  // Reiniciar el formulario
  resetFormulario() {
    this.selectedCamion = null;
    this.ubicacionInicio = '';
    this.ubicacionFin = '';
    this.startMarker = null;
    this.endMarker = null;
  }
}
