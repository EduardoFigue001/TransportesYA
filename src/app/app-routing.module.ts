import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Importa el guard

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard], // Protege esta ruta
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard], // Protege esta ruta
  },
  {
    path: 'history',
    loadChildren: () => import('./pages/history/history.module').then((m) => m.HistoryPageModule),
    canActivate: [AuthGuard], // Protege esta ruta
  },
  {
    path: 'services',
    loadChildren: () => import('./services/services.module').then((m) => m.ServicesPageModule),
    canActivate: [AuthGuard], // Protege esta ruta
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then((m) => m.RegisterPageModule), // Ruta para registrarse
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule), // Ruta para iniciar sesión
  },
  {
    path: '',
    redirectTo: 'login', // Redirige a login por defecto
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
