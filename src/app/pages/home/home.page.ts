import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  constructor(private supabaseService: SupabaseService) {}

  // Puedes agregar lógica aquí para obtener información adicional si es necesario
}
