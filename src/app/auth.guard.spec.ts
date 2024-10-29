import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { SupabaseService } from './services/supabase.service';
import { Session } from '@supabase/supabase-js'; // Asegúrate de que esta importación esté presente
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let supabaseServiceSpy: jasmine.SpyObj<SupabaseService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const supabaseSpy = jasmine.createSpyObj('SupabaseService', ['getSession']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: SupabaseService, useValue: supabaseSpy },
        { provide: Router, useValue: routerMock },
      ],
    });

    authGuard = TestBed.inject(AuthGuard);
    supabaseServiceSpy = TestBed.inject(SupabaseService) as jasmine.SpyObj<SupabaseService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow activation when session exists', async () => {
    // Simulando una sesión activa con todas las propiedades necesarias
    const mockSession: Session = {
      access_token: 'mockAccessToken',
      refresh_token: 'mockRefreshToken',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: 'mockUserId',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'mock@example.com',
        email_confirmed_at: '2023-01-01T00:00:00.000Z',
        created_at: '2023-01-01T00:00:00.000Z',
        confirmed_at: '2023-01-01T00:00:00.000Z',
        last_sign_in_at: '2023-01-01T00:00:00.000Z',
        app_metadata: {},
        user_metadata: {},
        identities: [],
        updated_at: '2023-01-01T00:00:00.000Z',
      },
    };

    supabaseServiceSpy.getSession.and.returnValue(Promise.resolve(mockSession));

    const result = await authGuard.canActivate();
    expect(result).toBe(true);  // Debe permitir el acceso
    expect(routerSpy.navigate).not.toHaveBeenCalled();  // No debe redirigir
  });

  it('should redirect to login when session does not exist', async () => {
    // Simulando la ausencia de sesión
    supabaseServiceSpy.getSession.and.returnValue(Promise.resolve(null));

    const result = await authGuard.canActivate();
    expect(result).toBe(false);  // No debe permitir el acceso
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);  // Debe redirigir al login
  });
});
