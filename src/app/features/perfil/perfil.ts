import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { AuthService } from '../../core/auth/auth.service';

interface Claim {
  clave: string;
  valor: string;
}

/**
 * Inspector del token. Muestra qué emitió el tenant y qué claims usan el API
 * Gateway y los microservicios para autorizar. Es la vista que evidencia que
 * el flujo OIDC entrega los tokens esperados.
 */
@Component({
  selector: 'app-perfil',
  imports: [DatePipe],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  protected readonly auth = inject(AuthService);

  protected readonly copiado = signal(false);

  protected readonly claimsIdToken = computed(() => aClaims(this.auth.idTokenClaims()));
  protected readonly claimsAccessToken = computed(() => aClaims(this.auth.accessTokenClaims()));

  /** Copia el access token para reutilizarlo en Postman o curl. */
  protected async copiarToken(): Promise<void> {
    const token = this.auth.accessToken();
    if (!token) {
      return;
    }

    await navigator.clipboard.writeText(token);
    this.copiado.set(true);
    setTimeout(() => this.copiado.set(false), 2500);
  }

  protected refrescar(): void {
    this.auth.refrescarAccessToken();
  }
}

function aClaims(claims: Record<string, unknown>): Claim[] {
  return Object.entries(claims)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([clave, valor]) => ({ clave, valor: formatear(valor) }));
}

function formatear(valor: unknown): string {
  if (Array.isArray(valor)) {
    return valor.join(', ');
  }
  if (valor !== null && typeof valor === 'object') {
    return JSON.stringify(valor);
  }
  return String(valor);
}
