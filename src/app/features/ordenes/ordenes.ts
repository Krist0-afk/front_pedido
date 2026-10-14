import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { catchError, filter, forkJoin, of, take } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { Boleta } from '../../core/models/boleta.model';
import { Orden, OrdenItemVista, OrdenVista } from '../../core/models/orden.model';
import { ProductoVista } from '../../core/models/producto.model';
import { CatalogoService } from '../../core/services/catalogo.service';
import { FacturacionService } from '../../core/services/facturacion.service';
import { describirError } from '../../core/services/http-error.util';
import { OrdenesService } from '../../core/services/ordenes.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-ordenes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, RouterLink, Icon],
  templateUrl: './ordenes.html',
})
export class Ordenes implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly ordenesService = inject(OrdenesService);
  private readonly catalogoService = inject(CatalogoService);
  private readonly facturacionService = inject(FacturacionService);
  private readonly msalBroadcast = inject(MsalBroadcastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly ordenes = signal<OrdenVista[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly ordenExpandida = signal<number | null>(null);
  /** Facturación no respondió. */
  protected readonly facturacionCaida = signal(false);

  protected readonly totalGastado = computed(() =>
    this.ordenes().reduce((acc, orden) => acc + (orden.total ?? 0), 0),
  );

  protected readonly cantidadOrdenes = computed(() => this.ordenes().length);

  ngOnInit(): void {
    // Espera a que MSAL termine la adquisición/renovación del token antes de consultar el API Gateway
    this.msalBroadcast.inProgress$
      .pipe(
        filter((estado) => estado === InteractionStatus.None),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.cargarOrdenes();
      });
  }

  protected cargarOrdenes(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.facturacionCaida.set(false);

    forkJoin({
      ordenes: this.ordenesService.obtenerMisOrdenes(),
      catalogo: this.catalogoService.obtenerCatalogo().pipe(catchError(() => of([] as ProductoVista[]))),
      // Si facturación falla las órdenes se muestran igual
      boletas: this.facturacionService.obtenerMisBoletas().pipe(
        catchError(() => {
          this.facturacionCaida.set(true);
          return of([] as Boleta[]);
        }),
      ),
    }).subscribe({
      next: ({ ordenes, catalogo, boletas }) => {
        const boletaPorOrden = new Map<number, Boleta>(
          (boletas ?? []).map((boleta) => [boleta.ordenId, boleta]),
        );

        const mapaCatalogo = new Map<number, ProductoVista>();
        for (const prod of (catalogo ?? [])) {
          if (prod.productoId !== undefined) {
            mapaCatalogo.set(prod.productoId, prod);
          } else {
            // Mapeo de respaldo para CATALOGO_DEMO ('prod-1' -> 1)
            const idNumerico = Number(prod.id.replace('prod-', ''));
            if (!isNaN(idNumerico)) {
              mapaCatalogo.set(idNumerico, prod);
            }
          }
        }

        const ordenesEnriquecidas: OrdenVista[] = (ordenes ?? []).map((orden) => {
          const itemsEnriquecidos: OrdenItemVista[] = (orden.items ?? []).map((item) => ({
            ...item,
            producto: mapaCatalogo.get(item.productoId),
          }));

          return {
            ...orden,
            items: itemsEnriquecidos,
            boleta: orden.id !== undefined ? boletaPorOrden.get(orden.id) : undefined,
          };
        });

        // Ordenar descendentemente: la más reciente primero
        ordenesEnriquecidas.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

        this.ordenes.set(ordenesEnriquecidas);
        // Si hay órdenes, expandir por defecto la más reciente
        if (ordenesEnriquecidas.length > 0 && this.ordenExpandida() === null) {
          this.ordenExpandida.set(ordenesEnriquecidas[0].id ?? null);
        }
        this.cargando.set(false);
      },
      error: (e: unknown) => {
        this.cargando.set(false);
        this.error.set(describirError(e));
      },
    });
  }

  protected alternarExpansion(id: number | undefined): void {
    if (!id) return;
    this.ordenExpandida.update((actual) => (actual === id ? null : id));
  }
}
