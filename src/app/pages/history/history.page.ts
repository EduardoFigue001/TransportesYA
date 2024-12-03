import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

interface Trip {
  id: string;
  origen: string;
  destino: string;
  fecha: string;
  estado: string;
  camiones: { tipo: string; capacidad: number };
}

interface Service {
  id: string;
  tipo: string;
  fecha: string;
  estado: string;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  trips: Trip[] = [];
  services: Service[] = [];
  loadingTrips: boolean = true;
  loadingServices: boolean = true;

  constructor(private readonly supabaseService: SupabaseService) {}

  async ngOnInit() {
    try {
      const session = await this.supabaseService.getSession();
      if (session?.user) {
        const rol = await this.getUserRole(session.user.id);

        this.loadingTrips = true;
        const tripsResponse = await this.supabaseService.getUserTrips(session.user.id, rol);
        this.trips = tripsResponse?.data || [];
        this.loadingTrips = false;

        this.loadingServices = true;
        const servicesResponse = await this.supabaseService.getUserServices(session.user.id, rol);
        this.services = servicesResponse?.data || [];
        this.loadingServices = false;
      }
    } catch (error) {
      console.error('Error al cargar la página de historial:', error);
    }
  }

  private async getUserRole(userId: string): Promise<'chofer' | 'cliente'> {
    try {
      const response = await this.supabaseService.getUserProfile(userId, 'cliente');
      return response.data?.rol || 'cliente';
    } catch (error) {
      console.warn('Error al obtener el rol. Asignando "cliente" por defecto:', error);
      return 'cliente';
    }
  }
}
