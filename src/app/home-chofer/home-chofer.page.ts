import { Component } from '@angular/core';

@Component({
  selector: 'app-home-chofer',
  templateUrl: './home-chofer.page.html',
  styleUrls: ['./home-chofer.page.scss'],
})
export class HomeChoferPage {
  scheduledService: any = null;  // Propiedad para el servicio agendado
  recentTrips: any[] = [];  // Propiedad para los viajes recientes

  constructor() {}

  // Método para cerrar sesión
  logout() {
    console.log('Cerrar sesión');
    // Aquí agregar la lógica para cerrar sesión (por ejemplo, redirigir a la página de login)
  }

  // Método para iniciar el servicio
  startService() {
    console.log('Iniciar servicio');
    // Lógica para iniciar el servicio (esto puede incluir actualizaciones en el backend)
  }

  // Método para ver los detalles de un viaje
  viewTripDetails(trip: any) {
    console.log('Ver detalles del viaje:', trip);
    // Lógica para mostrar los detalles del viaje seleccionado
  }
}
