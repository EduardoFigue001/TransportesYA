import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  // Ruta principal redirige a login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Rutas de acceso general
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule) },
  
  // Rutas protegidas según rol
  { 
    path: 'home', 
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'profile', 
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'services', 
    loadChildren: () => import('./services/services.module').then(m => m.ServicesPageModule), 
    canActivate: [AuthGuard] 
  },
  
  // Rutas específicas para cada tipo de usuario
  { 
    path: 'home-cliente', 
    loadChildren: () => import('./home-cliente/home-cliente.module').then(m => m.HomeClientePageModule), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'home-chofer', 
    loadChildren: () => import('./home-chofer/home-chofer.module').then(m => m.HomeChoferPageModule), 
    canActivate: [AuthGuard] 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
