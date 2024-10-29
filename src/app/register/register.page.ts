import { Component } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  role: string = ''; // cliente o chofer
  name: string = '';
  birthDate: string = '';
  address: string = '';
  truckModel: string = '';
  truckYear: number | null = null;
  truckLicensePlate: string = '';

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async register() {
    // Validación de campos
    if (!this.email || !this.password || !this.role) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (this.role === 'cliente') {
      if (!this.name || !this.birthDate || !this.address) {
        alert('Por favor, completa todos los datos del cliente.');
        return;
      }
    }

    if (this.role === 'chofer') {
      if (!this.truckModel || !this.truckYear || !this.truckLicensePlate) {
        alert('Por favor, completa todos los datos del camión.');
        return;
      }
    }

    try {
      // Registrar el usuario en el sistema de autenticación de Supabase
      const user = await this.supabaseService.signUp(this.email, this.password);

      // Datos adicionales que se guardarán dependiendo del rol
      const userData = {
        user_id: this.name, // Cambié esto para obtener el ID correcto del usuario registrado
        role: this.role,
        email: this.email,
        password: this.password, // o almacenar un hash
        name: this.role === 'cliente' ? this.name : null,
        birth_date: this.role === 'cliente' ? this.birthDate : null,
        address: this.role === 'cliente' ? this.address : null,
        truck_model: this.role === 'chofer' ? this.truckModel : null,
        truck_year: this.role === 'chofer' ? this.truckYear : null,
        truck_license_plate: this.role === 'chofer' ? this.truckLicensePlate : null,
      };

      // Guardar los datos del usuario en la tabla users de Supabase
      await this.supabaseService.createUser(userData);

      alert('Registro exitoso');
      this.router.navigate(['/login']);
    } catch (error: any) {
      alert('Error en el registro: ' + error.message);
    }
  }
}
