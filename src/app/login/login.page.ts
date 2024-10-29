import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string= '';
  password: string= '';

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  ngOnInit() {}

  async login() {
    try {
      await this.supabaseService.signIn(this.email, this.password);
      alert('Inicio de sesión exitoso');
      this.router.navigate(['/inicio']);
    } catch (error: any) {
      alert('Error en el inicio de sesión: ' + error.message);
    }
  }
}
