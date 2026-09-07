import { Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { autenticacionGuard, rolGuard } from './core/auth/guards';

export const routes: Routes = [
  {
    path: '',
    title: 'Pedidos360 · Delivery & Market',
    loadComponent: () => import('./features/catalogo/catalogo').then((m) => m.Catalogo),
  },
  {
    path: 'carrito',
    title: 'Mi carrito | Pedidos360',
    // Sesión iniciada + App Role exigido por el microservicio de compras.
    canActivate: [autenticacionGuard, rolGuard(environment.rolCompras)],
    loadComponent: () => import('./features/carrito/carrito').then((m) => m.Carrito),
  },
  {
    path: 'perfil',
    title: 'Mi token | Pedidos360',
    canActivate: [autenticacionGuard],
    loadComponent: () => import('./features/perfil/perfil').then((m) => m.Perfil),
  },
  {
    path: 'no-autorizado',
    title: 'Sin permisos | Pedidos360',
    loadComponent: () =>
      import('./features/no-autorizado/no-autorizado').then((m) => m.NoAutorizado),
  },
  { path: 'catalogo', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
