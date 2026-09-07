import { describe, expect, it } from 'vitest';

import { claimAFecha, decodificarJwt } from './jwt.util';

/**
 * Arma un JWT de mentira (sin firma válida) solo para probar el decodificador.
 * Codifica el payload en UTF-8 antes de base64url, igual que un JWT real.
 */
function jwtDePrueba(payload: Record<string, unknown>): string {
  const base64url = (valor: object) => {
    const bytes = new TextEncoder().encode(JSON.stringify(valor));
    const binario = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
    return btoa(binario).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  return `${base64url({ alg: 'RS256' })}.${base64url(payload)}.firma`;
}

describe('decodificarJwt', () => {
  it('extrae los claims del payload', () => {
    const token = jwtDePrueba({
      aud: 'c6445b4c-7863-42ac-a620-2fa3b5ea58d8',
      iss: 'https://login.microsoftonline.com/8ea291c8/v2.0',
      roles: ['User'],
      scp: 'desarrollo',
    });

    const claims = decodificarJwt(token);

    expect(claims?.['aud']).toBe('c6445b4c-7863-42ac-a620-2fa3b5ea58d8');
    expect(claims?.['roles']).toEqual(['User']);
    expect(claims?.['scp']).toBe('desarrollo');
  });

  it('soporta caracteres no ASCII en los claims', () => {
    const claims = decodificarJwt(jwtDePrueba({ name: 'José Muñoz' }));

    expect(claims?.['name']).toBe('José Muñoz');
  });

  it('devuelve null si el token es nulo o está mal formado', () => {
    expect(decodificarJwt(null)).toBeNull();
    expect(decodificarJwt('esto-no-es-un-jwt')).toBeNull();
    expect(decodificarJwt('a.b.c')).toBeNull();
  });
});

describe('claimAFecha', () => {
  it('convierte un claim epoch en segundos a Date', () => {
    expect(claimAFecha(1_760_000_000)?.getTime()).toBe(1_760_000_000_000);
  });

  it('devuelve null si el claim no es numérico', () => {
    expect(claimAFecha('mañana')).toBeNull();
    expect(claimAFecha(undefined)).toBeNull();
  });
});
