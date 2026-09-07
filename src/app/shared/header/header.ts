import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CarritoStore } from '../../core/state/carrito.store';
import { UiStore } from '../../core/state/ui.store';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, CurrencyPipe, Icon],
  templateUrl: './header.html',
})
export class Header {
  protected readonly auth = inject(AuthService);
  protected readonly carrito = inject(CarritoStore);
  protected readonly ui = inject(UiStore);
}
