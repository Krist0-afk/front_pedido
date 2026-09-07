import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly anio = new Date().getFullYear();
  protected readonly comunas = [
    'Providencia',
    'Las Condes',
    'Santiago Centro',
    'Ñuñoa',
    'Vitacura / Lo Barnechea',
  ];
  protected readonly mediosDePago = ['WebPay Plus', 'Redcompra', 'Mach', 'Mercado Pago', 'Efectivo'];
}
