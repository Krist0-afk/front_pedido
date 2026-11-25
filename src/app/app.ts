import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from './core/auth/auth.service';
import { ComprasService } from './core/services/compras.service';
import { CarritoStore } from './core/state/carrito.store';
import { Avisos } from './shared/avisos/avisos';
import { CartDrawer } from './shared/cart-drawer/cart-drawer';
import { Footer } from './shared/footer/footer';
import { Header } from './shared/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, CartDrawer, Avisos],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly msal = inject(MsalService);
  private readonly auth = inject(AuthService);
  private readonly carrito = inject(CarritoStore);
  private readonly compras = inject(ComprasService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Procesa la respuesta del Authorization Code Flow cuando Entra ID
    // devuelve al usuario a la redirectUri. Debe ejecutarse en cada carga,
    // antes de leer la cuenta activa.
    this.msal.handleRedirectObservable().subscribe({
      error: (error: unknown) => console.error('[MSAL] Error en el redirect', error),
    });
    this.auth.inicializar();
    this.publicarQuitados();
  }

  /**
   * Cada producto que el usuario saca de la canasta se informa a compras para
   * que publique CARRITO_QUITADO. Solo con sesión iniciada y productos del backend.
   */
  private publicarQuitados(): void {
    this.carrito.quitados.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((item) => {
      const productoId = item.product.productoId;
      if (!this.auth.autenticado() || productoId === undefined) return;
      this.compras
        .notificarQuitado(productoId, item.quantity, item.product.price * item.quantity)
        .subscribe({ error: () => undefined });
    });
  }
}
