import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from './core/auth/auth.service';
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

  ngOnInit(): void {
    // Procesa la respuesta del Authorization Code Flow cuando Entra ID
    // devuelve al usuario a la redirectUri. Debe ejecutarse en cada carga,
    // antes de leer la cuenta activa.
    this.msal.handleRedirectObservable().subscribe({
      error: (error: unknown) => console.error('[MSAL] Error en el redirect', error),
    });
    this.auth.inicializar();
  }
}
