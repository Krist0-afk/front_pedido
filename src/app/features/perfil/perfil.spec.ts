import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { of, throwError } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { AuthService } from '../../core/auth/auth.service';
import { UsuarioBackend } from '../../core/models/usuario.model';
import { UsuarioService } from '../../core/services/usuario.service';
import { Perfil } from './perfil';

class AuthServiceFalso {
  autenticado = () => true;
  nombre = () => 'Gustavo Cloud';
  email = () => 'gustavo@cloudnative.cl';
  roles = () => ['User'];
  logout = () => {};
}

function configurar(usuarioRespuesta: UsuarioBackend | Error) {
  const usuarioMock = {
    sincronizar: () =>
      usuarioRespuesta instanceof Error
        ? throwError(() => usuarioRespuesta)
        : of(usuarioRespuesta),
  };

  TestBed.configureTestingModule({
    imports: [Perfil],
    providers: [
      provideZonelessChangeDetection(),
      provideRouter([]),
      { provide: AuthService, useClass: AuthServiceFalso },
      { provide: MsalBroadcastService, useValue: { inProgress$: of(InteractionStatus.None) } },
      { provide: UsuarioService, useValue: usuarioMock },
    ],
  });

  const fixture: ComponentFixture<Perfil> = TestBed.createComponent(Perfil);
  fixture.detectChanges();
  return fixture;
}

describe('Perfil', () => {
  it('renderiza datos sincronizados del microservicio de usuario', () => {
    const fixture = configurar({
      id: 77,
      nombre: 'Gustavo Cloud',
      correo: 'gustavo@cloudnative.cl',
    });

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('#77');
    expect(texto).toContain('Gustavo Cloud');
    expect(texto).toContain('gustavo@cloudnative.cl');
    expect(texto).toContain('Microservicio de Usuario');
    expect(texto).toContain('usuarios_db');
  });

  it('muestra aviso amigable si la sincronización con el microservicio falla', () => {
    const fixture = configurar(new Error('Servicio de usuarios no disponible'));
    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(texto).toContain('No se pudo sincronizar automáticamente');
    expect(texto).toContain('Reintentar sincronización');
  });
});
