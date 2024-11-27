import { Component } from '@angular/core';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
})
export class HomeClientePage {
  scheduledService: any = null;  // Propiedad para el servicio agendado
  recentTrips: any[] = [];  // Propiedad para los viajes recientes

  constructor() {}

  // Método para cerrar sesión
  logout() {
    console.log('Cerrar sesión');
    // Aquí agregar la lógica para cerrar sesión (por ejemplo, redirigir a la página de login)
  }

  // Método para cancelar el servicio
  cancelService() {
    console.log('Cancelar servicio');
    // Lógica para cancelar el servicio (actualización de la base de datos o cancelación en el backend)
  }

  // Método para solicitar un nuevo servicio
  requestNewService() {
    console.log('Solicitar nuevo servicio');
    // Lógica para redirigir o mostrar un formulario para solicitar un nuevo servicio
  }

  // Método para ver los detalles de un viaje
  viewTripDetails(trip: any) {
    console.log('Ver detalles del viaje:', trip);
    // Lógica para mostrar los detalles del viaje seleccionado
  }
}
