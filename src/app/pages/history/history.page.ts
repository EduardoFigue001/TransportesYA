import { Component, OnInit } from '@angular/core';

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
  trips: Trip[] = [
    {
      id: '1',
      origen: 'Ciudad de México',
      destino: 'Guadalajara',
      fecha: '2024-01-10',
      estado: 'Activo',
      camiones: { tipo: 'Trailer', capacidad: 20 },
    },
    {
      id: '2',
      origen: 'Monterrey',
      destino: 'Tampico',
      fecha: '2024-02-15',
      estado: 'Finalizado',
      camiones: { tipo: 'Camión ligero', capacidad: 10 },
    },
  ];

  services: Service[] = [
    {
      id: '1',
      tipo: 'Carga Express',
      fecha: '2024-03-12',
      estado: 'Activo',
    },
    {
      id: '2',
      tipo: 'Paquetería',
      fecha: '2024-04-01',
      estado: 'Pendiente',
    },
  ];

  loadingTrips: boolean = false;
  loadingServices: boolean = false;

  constructor() {
    // Ya no inyectamos SupabaseService
  }

  ngOnInit() {
    // No se hace nada adicional; ya no se consultan datos externos
    // Mostramos el contenido estático que está en trips y services
  }
}
