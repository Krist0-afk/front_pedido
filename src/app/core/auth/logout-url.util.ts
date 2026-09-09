/**
 * Al cerrar sesión, Entra ID devuelve a la `postLogoutRedirectUri` con el
 * `state` que MSAL adjuntó a la petición de logout: `https://host/?state=...`.
 *
 * Ese `state` no es una respuesta de autorización —no trae `code` ni `error`—,
 * así que `handleRedirectObservable()` lo rechaza y deja marcada la
 * interacción como en curso. A partir de ahí `loginRedirect()` no hace nada:
 * la única salida es borrar el parámetro a mano y recargar.
 *
 * Se limpia antes de arrancar MSAL. Las respuestas reales del Authorization
 * Code Flow viajan en el fragmento (`#code=...`), por lo que no se tocan.
 */
export function limpiarStateDeLogout(ubicacion: Location = window.location): void {
  const url = new URL(ubicacion.href);

  const esRespuestaDeAuth =
    url.searchParams.has('code') ||
    url.searchParams.has('error') ||
    url.hash.includes('code=') ||
    url.hash.includes('error=');

  if (!url.searchParams.has('state') || esRespuestaDeAuth) {
    return;
  }

  url.searchParams.delete('state');
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}
