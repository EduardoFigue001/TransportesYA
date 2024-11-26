import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  historialViajes: any[] = []; // Inicializa la propiedad con un array vacío
  trips: any[] = []; // Inicializa trips como un array vacío
  services: any[] = []; // Inicializa services como un array vacío

  constructor(private readonly supabaseService: SupabaseService) {}

  async ngOnInit() {
    try {
      const session = await this.supabaseService.getSession();
      if (session?.user) {
        // Determinar el rol del usuario
        const rol = await this.getUserRole(session.user.id);

        // Cargar los viajes del usuario
        const { data: tripsData, error: tripsError } = await this.supabaseService.getUserTrips(session.user.id, rol);
        if (tripsError) {
          console.error('Error fetching user trips:', tripsError.message || tripsError);
          this.trips = [];
        } else {
          this.trips = tripsData || [];
        }

        // Cargar los servicios del usuario
        const { data: servicesData, error: servicesError } = await this.supabaseService.getUserServices(session.user.id, rol);
        if (servicesError) {
          console.error('Error fetching user services:', servicesError.message || servicesError);
          this.services = [];
        } else {
          this.services = servicesData || [];
        }
      } else {
        console.error('No user session found');
      }
    } catch (error) {
      console.error('Error initializing history page:', error);
    }
  }

  async getUserRole(userId: string): Promise<'chofer' | 'cliente'> {
    try {
      const { data, error } = await this.supabaseService.getUserProfile(userId, 'cliente');
      if (error || !data) {
        console.warn('No se pudo determinar el rol del usuario, asignando "cliente" por defecto');
        return 'cliente';
      }
      return data.rol as 'chofer' | 'cliente';
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
      return 'cliente';
    }
  }

  async obtenerHistorial() {
    try {
      const session = await this.supabaseService.getSession();
      if (session?.user) {
        const { data, error } = await this.supabaseService.querySupabase(
          'historial_viajes',
          'cliente_id',
          session.user.id
        );

        if (error) {
          console.error('Error fetching travel history:', error.message || error);
          this.historialViajes = [];
        } else {
          this.historialViajes = data || []; // Asignar un arreglo vacío si `data` es `null`
        }
      } else {
        console.error('No user session found');
      }
    } catch (error) {
      console.error('Error fetching travel history:', error);
      this.historialViajes = []; // Asignar un arreglo vacío en caso de error
    }
  }
}
