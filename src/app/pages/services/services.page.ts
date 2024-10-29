import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-integrated-page',
  templateUrl: './integrated.page.html',
  styleUrls: ['./integrated.page.scss'],
})
export class IntegratedPage implements OnInit {
  // Variables relacionadas con los servicios
  selectedTruck: string = '';
  selectedDate: string = '';
  selectedTime: string = '';
  services: any[] = [];

  // Variables relacionadas con el perfil del usuario
  user: any = {};
  userId: string | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    // Obtener userId desde las rutas para la parte de perfil
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.user = await this.supabaseService.getUserProfile(this.userId);
    }

    // Cargar servicios disponibles al inicializar la página
    this.services = await this.supabaseService.getServices();
  }

  async ionViewWillEnter() {
    // Cargar la información del perfil basado en la sesión activa
    const session = await this.supabaseService.getSession();
    if (session?.user?.id) {
      this.user = await this.supabaseService.getUserProfile(session.user.id);
    }

    // Cargar servicios nuevamente al entrar a la vista
    this.services = await this.supabaseService.getServices();
  }

  async scheduleService() {
    // Lógica para agendar un servicio
    if (!this.selectedTruck || !this.selectedDate || !this.selectedTime) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Suponiendo que tienes un método para obtener el ID del usuario actual
const userId = "el-id-del-usuario-actual"; // Debes reemplazar esto con la lógica para obtener el ID del usuario actual
const user = await this.supabaseService.getUserProfile(userId);
const serviceData = {
  user_id: user.id,  // Asegúrate de que 'user' tenga la propiedad 'id'
  truck_type: this.selectedTruck,
  date: this.selectedDate,
  time: this.selectedTime,
};

    try {
      const { error } = await this.supabaseService.createService(serviceData);
      if (error) throw error;
      alert('Servicio agendado con éxito');
      this.router.navigate(['/historial']);
    } catch (error: any) {
      alert('Error al agendar el servicio: ' + error.message);
    }
  }

  bookService(service: any) {
    // Lógica para reservar el servicio seleccionado
    console.log('Servicio reservado:', service);
  }

  async uploadProfileImage() {
    // Lógica para subir imagen de perfil
  }
}
