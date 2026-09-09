import { limpiarStateDeLogout } from './logout-url.util';

/** `location` real de jsdom, manipulada con la History API. */
function ubicar(url: string): void {
  history.replaceState(null, '', url);
}

describe('limpiarStateDeLogout', () => {
  it('quita el state que deja Entra ID al cerrar sesión', () => {
    ubicar('/?state=eyJpZCI6IjAxYTA4NDk4In0%3D');

    limpiarStateDeLogout();

    expect(location.search).toBe('');
    expect(location.pathname).toBe('/');
  });

  it('conserva la respuesta del Authorization Code Flow', () => {
    ubicar('/#code=abc&state=eyJpZCI6IjAxYTA4NDk4In0%3D');

    limpiarStateDeLogout();

    expect(location.hash).toContain('code=abc');
    expect(location.hash).toContain('state=');
  });

  it('respeta el resto de los parámetros de la URL', () => {
    ubicar('/carrito?modo=supermercado&state=abc');

    limpiarStateDeLogout();

    expect(location.pathname).toBe('/carrito');
    expect(location.search).toBe('?modo=supermercado');
  });

  it('no toca una URL sin state', () => {
    ubicar('/perfil');

    limpiarStateDeLogout();

    expect(location.pathname).toBe('/perfil');
    expect(location.search).toBe('');
  });
});
