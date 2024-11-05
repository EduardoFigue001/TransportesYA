import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service'; // Ajusta la ruta según tu estructura
import { Service } from '../services/services.module';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  trips: any[] = [];
  services: Service[] = []; // Declarar services como un array de Service

  constructor(private readonly supabaseService: SupabaseService) {}

  async ngOnInit() {
    const session = await this.supabaseService.getSession();
    if (session?.user) {
      // Cargar los viajes del usuario
      this.trips = await this.supabaseService.getUserTrips(session.user.id);
      
      // Cargar los servicios del usuario
      const { data, error } = await this.supabaseService.getUserServices(session.user.id);
      if (error) {
        console.error('Error fetching user services:', error);
      } else {
        this.services = data; // Asegúrate de que data contenga objetos del tipo Service
      }
    } else {
      console.error('No user session found');
    }
  }
}
