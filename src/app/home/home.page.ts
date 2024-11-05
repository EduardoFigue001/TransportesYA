import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  scheduledService: any;

  constructor(private supabaseService: SupabaseService) {
    // Cargar el servicio agendado desde el almacenamiento local
    const service = localStorage.getItem('scheduledService');
    this.scheduledService = service ? JSON.parse(service) : null;
  }

  // Puedes agregar lógica adicional aquí si es necesario para obtener más información
}
