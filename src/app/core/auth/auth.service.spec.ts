import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AccountInfo, EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { BehaviorSubject, Subject, defer, of } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { AuthService } from './auth.service';

const CUENTA = { username: 'user@pedidos360.cl', name: 'User' } as AccountInfo;

// MSAL falso: setActiveAccount() y acquireTokenSilent() emiten eventos al instante, como el real
function configurar(token = 'token-de-prueba') {
  const msalSubject$ = new Subject<EventMessage>();
  const inProgress$ = new BehaviorSubject<InteractionStatus>(InteractionStatus.Startup);
  const emitir = (eventType: EventType, payload: unknown = null) =>
    msalSubject$.next({ eventType, payload } as EventMessage);
  let llamadasSilent = 0;

  const msalFalso = {
    instance: {
      getActiveAccount: () => CUENTA,
      getAllAccounts: () => [CUENTA],
      setActiveAccount: () => emitir(EventType.ACTIVE_ACCOUNT_CHANGED),
    },
    acquireTokenSilent: () =>
      defer(() => {
        llamadasSilent++;
        emitir(EventType.ACQUIRE_TOKEN_START);
        const resultado = { accessToken: token };
        emitir(EventType.ACQUIRE_TOKEN_SUCCESS, resultado);
        return of(resultado);
      }),
  };

  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      { provide: MsalService, useValue: msalFalso },
      { provide: MsalBroadcastService, useValue: { msalSubject$, inProgress$ } },
    ],
  });

  const auth = TestBed.inject(AuthService);
  auth.inicializar();
  return { auth, inProgress$, emitir, silent: () => llamadasSilent };
}

describe('AuthService', () => {
  it('sincroniza la cuenta sin entrar en bucle con los eventos de MSAL', () => {
    const { auth, inProgress$, silent } = configurar();

    expect(() => inProgress$.next(InteractionStatus.None)).not.toThrow();

    expect(auth.autenticado()).toBe(true);
    expect(auth.accessToken()).toBe('token-de-prueba');
    expect(silent()).toBe(1);
  });

  it('toma el token renovado por el interceptor sin volver a pedirlo', () => {
    const { auth, inProgress$, emitir, silent } = configurar();
    inProgress$.next(InteractionStatus.None);

    emitir(EventType.ACQUIRE_TOKEN_SUCCESS, { accessToken: 'token-renovado' });

    expect(auth.accessToken()).toBe('token-renovado');
    expect(silent()).toBe(1);
  });

  it('asegurarRoles espera a que MSAL termine y lee los roles del access token', () => {
    const payload = btoa(JSON.stringify({ roles: ['User'] })).replace(/=+$/, '');
    const { auth, inProgress$ } = configurar(`cabecera.${payload}.firma`);
    let roles: string[] | undefined;

    auth.asegurarRoles().subscribe((r) => (roles = r));
    expect(roles).toBeUndefined(); // MSAL sigue procesando el redirect del login

    inProgress$.next(InteractionStatus.None);
    expect(roles).toEqual(['User']);
  });
});
