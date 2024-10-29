import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html', // Corregido el path para evitar problemas de enrutamiento
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  selectedTruck: string | undefined; // Para almacenar el tipo de camión seleccionado
  selectedDate: string | undefined; // Para almacenar la fecha seleccionada
  selectedTime: string | undefined; // Para almacenar la hora seleccionada
  services = [
    { truckType: 'Camión Pequeño', description: 'Servicio de camión pequeño' },
    { truckType: 'Camión Mediano', description: 'Servicio de camión mediano' },
    { truckType: 'Camión Grande', description: 'Servicio de camión grande' },
    { truckType: 'Camión Extra Grande', description: 'Servicio de camión extra grande' },
  ];

  constructor() { }

  ngOnInit() {
  }

  scheduleService() {
    // Lógica para agendar el servicio
    console.log('Servicio agendado:', {
      truck: this.selectedTruck,
      date: this.selectedDate,
      time: this.selectedTime,
    });
  }

  bookService(service: any) {
    // Lógica para reservar un servicio
    console.log('Servicio reservado:', service);
  }
}
