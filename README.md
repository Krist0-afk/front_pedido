# Pedidos360 - Frontend Angular

Frontend del sistema **Pedidos360** construido en **Angular 21** con
autenticación contra **Azure Entra ID** mediante **MSAL**. Los tokens emitidos
por el tenant se envían al **AWS API Gateway**, que valida el JWT antes de
enrutar hacia los microservicios **Spring Boot** desplegados en EC2.

```
Angular + MSAL  ──JWT──>  AWS API Gateway  ──>  EC2 / Spring Boot
     │                     (valida JWT)          (valida JWT de nuevo)
     └── Azure Entra ID (Authorization Code + PKCE)
```

## Requisitos

- Node.js **20.19+**, **22.12+** o **24+**
- npm 10+

## Puesta en marcha

```bash
npm install
npm start          # http://localhost:4200
```

Otros comandos:

```bash
npm run build      # build de producción en dist/
npm test           # pruebas unitarias (Vitest)
```

## Docker

La imagen se construye en dos etapas: `node:22-alpine` compila el bundle y
`nginx:stable-alpine` sirve los estáticos resultantes. La imagen final no
lleva Node ni `node_modules`.

```bash
docker build -t pedidos360-front:1.0.0 .
docker run --rm -p 8080:80 pedidos360-front:1.0.0   # http://localhost:8080
```

`nginx.conf` resuelve dos cosas que un servidor de estáticos por defecto no
hace bien con Angular:

- **Fallback de rutas.** `/carrito` y `/perfil` no existen como archivos: se
  devuelve `index.html` para que el router los resuelva. Sin esto, recargar en
  esas rutas o volver del redirect de Entra ID daría 404.
- **Caché.** Los bundles llevan hash en el nombre y se cachean un año;
  `index.html` no se cachea nunca, para que un despliegue nuevo se vea de
  inmediato.

La configuración del `environment.ts` (URL del API Gateway, `clientId`,
`redirectUri`) se compila **dentro** del bundle. Cambiarla exige reconstruir la
imagen; no se puede inyectar por variable de entorno en tiempo de ejecución.

El contenedor expone **HTTP en el puerto 80**. Entra ID solo acepta redirect
URIs `https` fuera de `localhost`, así que en el despliegue real el TLS tiene
que terminar delante del contenedor y el origen resultante debe coincidir
exactamente con `msal.redirectUri`.

## Configuración

Toda la configuración vive en `src/environments/`:

| Archivo | Uso |
| --- | --- |
| `environment.development.ts` | `ng serve` y `ng build --configuration development` |
| `environment.ts` | build de producción (por defecto) |

Valores a revisar antes de la demo:

| Clave | Qué es |
| --- | --- |
| `msal.clientId` | Application (client) ID del registro de aplicación |
| `msal.tenantId` | Directory (tenant) ID |
| `msal.authority` | `https://login.microsoftonline.com/<tenantId>` |
| `msal.redirectUri` | Debe coincidir **exactamente** con la Redirect URI registrada |
| `api.baseUrl` | **Invoke URL del stage de API Gateway** (pendiente de reemplazar) |
| `api.scopes` | Scope expuesto por la API; define el `aud` del access token |
| `rolCompras` | App Role que exige el microservicio de compras |


### Lo que debe estar configurado en Entra ID

1. **Registro de aplicación** con una plataforma **Single-page application**
   (no «Web») cuya Redirect URI sea `http://localhost:4200` en desarrollo.
   Si se registra como «Web», el flujo falla porque MSAL usa PKCE sin secreto.
2. **Expose an API** → un scope (`desarrollo`), cuyo Application ID URI
   (`api://<clientId>`) es el `aud` que validan los microservicios.
3. **App roles** → un rol con value `User`, asignado al usuario de prueba en
   *Enterprise applications → Users and groups*. Sin él, el microservicio de
   compras responde 403.

### Lo que debe estar configurado en API Gateway

Los tres microservicios exponen rutas disjuntas, así que el gateway enruta por
prefijo sin necesidad de reescribir la ruta:

| Recurso en API Gateway | Integración | Microservicio |
| --- | --- | --- |
| `/api/v1/catalogo/{proxy+}` | `http://<ip-ec2>:8081/api/v1/catalogo/{proxy}` | catálogo |
| `/api/v1/compras/{proxy+}` | `http://<ip-ec2>:8082/api/v1/compras/{proxy}` | compras |
| `/api/v1/auth/{proxy+}` | `http://<ip-ec2>:8080/api/v1/auth/{proxy}` | auth |

Endpoints que consume el frontend, relativos a `api.baseUrl`:

| Método | Ruta | Protección en el backend |
| --- | --- | --- |
| GET | `/api/v1/catalogo/public` | `permitAll` |
| GET | `/api/v1/catalogo/privado` | JWT válido |
| GET | `/api/v1/compras/carrito` | JWT + App Role `User` |
| POST | `/api/v1/compras/carrito` | JWT + App Role `User` |

CORS debe permitir el origen del frontend y los headers `Authorization` y
`Content-Type`, incluyendo el preflight `OPTIONS`.

## Estructura

```
src/app/
├── core/
│   ├── auth/
│   │   ├── msal.config.ts      Factories de MSAL (instancia, guard, interceptor)
│   │   ├── auth.service.ts     Estado de sesión, roles y scopes como signals
│   │   ├── guards.ts           autenticacionGuard y rolGuard
│   │   └── jwt.util.ts         Decodificador de claims (solo lectura, para la UI)
│   ├── data/catalogo-demo.ts   Catálogo local de respaldo (14 productos)
│   ├── models/                 Entidades del backend + modelo de presentación
│   ├── services/               CatalogoService y ComprasService
│   └── state/                  CarritoStore y UiStore (signals)
├── features/
│   ├── catalogo/               Marketplace público: comida y supermercado
│   ├── carrito/                Checkout (protegido + App Role)
│   ├── perfil/                 Inspector del token: claims, roles, scopes
│   └── no-autorizado/          Explica un 403 por falta de rol
└── shared/                     header, footer, cart-drawer, avisos, icon
```

Rutas:

| Ruta | Acceso |
| --- | --- |
| `/` | Pública. Catálogo de restaurantes y supermercado |
| `/carrito` | Sesión iniciada **y** App Role `User` |
| `/perfil` | Sesión iniciada |
| `/no-autorizado` | Pública. Explica el 403 por falta de rol |

## Interfaz

El marketplace es el del prototipo original de Pedidos 360, reconstruido en
Angular con **Tailwind CSS 4**: conmutador Restaurantes / Supermercado, banners
promocionales con cupón, filtro por categoría, buscador en el header, tarjetas
de producto con rating y tiempo de preparación, canasta fija con barra de
progreso hacia el envío gratis, panel lateral del carrito y checkout con
dirección y medio de pago. Los iconos son SVG propios (`shared/icon`), sin
dependencias de terceros.

### Catálogo de demostración

`core/data/catalogo-demo.ts` mantiene 14 productos locales. Se usan cuando el
microservicio no está accesible — API Gateway sin configurar, EC2 apagada o
error de red — para que la interfaz siga siendo demostrable. La pantalla dice
siempre de dónde salieron los datos:

- banner ámbar «Catálogo de demostración» si `api.baseUrl` sigue en `REEMPLAZAR`;
- banner rojo con el error y botón de reintento si el backend falló;
- banner verde con el endpoint (`/catalogo/public` o `/catalogo/privado`) cuando
  los datos vinieron del microservicio.

Los productos servidos por la API llevan además una insignia `API` en la tarjeta.
Solo esos pueden comprarse: el checkout necesita el id numérico del backend para
crear el pedido en el microservicio de compras.

## Cómo funciona la autenticación

- **Flujo OIDC.** MSAL Browser v3+ usa siempre *Authorization Code con PKCE*
  para SPAs: genera `code_verifier` y `code_challenge`, y valida `state` y
  `nonce`. No hay flujo implícito que desactivar.
- **Guards.** `autenticacionGuard` delega en el `MsalGuard` de MSAL y protege
  `/catalogo`, `/carrito` y `/perfil`. `rolGuard('User')` añade la comprobación
  del App Role sobre `/carrito`, leyéndolo de los claims.
- **Interceptor.** El `MsalInterceptor` adjunta
  `Authorization: Bearer <access_token>` a toda petición cuya URL haga match con
  el `protectedResourceMap` (las rutas del API Gateway), obteniendo el token de
  forma silenciosa y renovándolo cuando expira.
- **Roles y scopes.** `AuthService` los expone desde los claims `roles` y `scp`
  del token, los mismos que Spring Security mapea a `ROLE_*` y `SCOPE_*`.

La vista **/perfil** muestra los claims del ID token y del access token
(`aud`, `iss`, `exp`, `roles`, `scp`) y permite copiar el access token para
reutilizarlo en Postman o curl.

## Seguridad

La validación de tokens del lado del cliente es solo para la interfaz. Las
decisiones de seguridad reales las toman el API Gateway y cada microservicio,
que verifican firma, `iss`, `aud` y `exp` contra el JWKS del tenant.
