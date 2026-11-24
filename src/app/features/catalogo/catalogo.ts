import { CurrencyPipe } from '@angular/common';
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
import { filter, take } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { CATALOGO_DEMO } from '../../core/data/catalogo-demo';
import { ModoCatalogo, ProductoVista } from '../../core/models/producto.model';
import { CatalogoService } from '../../core/services/catalogo.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { Recomendacion } from '../../core/models/analytics.model';
import { describirError } from '../../core/services/http-error.util';
import { CarritoStore } from '../../core/state/carrito.store';
import { UiStore } from '../../core/state/ui.store';
import { Icon } from '../../shared/icon/icon';

const CATEGORIAS_RESTAURANTES = [
  'Todas',
  'Hamburguesas',
  'Pizzas',
  'Sushi',
  'Saludable & Bowls',
  'Tacos & Burritos',
  'Pollo & Alitas',
  'Postres & Helados',
];

const CATEGORIAS_SUPERMERCADO = [
  'Todas',
  'Abarrotes & Fideos',
  'Lácteos & Quesos',
  'Higiene & Confort',
  'Bebidas & Snacks',
];

@Component({
  selector: 'app-catalogo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink, Icon],
  templateUrl: './catalogo.html',
})
export class Catalogo implements OnInit {
  private readonly catalogoApi = inject(CatalogoService);
  private readonly analytics = inject(AnalyticsService);
  private readonly msalBroadcast = inject(MsalBroadcastService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly auth = inject(AuthService);
  protected readonly carrito = inject(CarritoStore);
  protected readonly ui = inject(UiStore);

  protected readonly modo = signal<ModoCatalogo>('restaurantes');
  protected readonly categoria = signal('Todas');
  protected readonly cuponCopiado = signal<string | null>(null);

  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  /** Endpoint que sirvió los datos actuales, o `null` si son del catálogo local. */
  protected readonly endpointUsado = signal<string | null>(null);
  /** El microservicio respondió bien, pero sin productos cargados. */
  protected readonly catalogoVacio = signal(false);
  protected readonly productos = signal<ProductoVista[]>(CATALOGO_DEMO);
  /** Producto abierto en el detalle (al abrirlo se publica PRODUCTO_VISTO en Kafka). */
  protected readonly detalle = signal<ProductoVista | null>(null);
  protected readonly recomendaciones = signal<Recomendacion[]>([]);
  /** Sugerencias de analítica con la foto y los datos de su tarjeta del catálogo. */
  protected readonly sugeridos = computed(() =>
    this.recomendaciones()
      .map((r) => ({ r, p: this.productos().find((p) => p.productoId === r.productoId) }))
      .filter((x): x is { r: Recomendacion; p: ProductoVista } => !!x.p),
  );

  protected readonly apiSinConfigurar = this.catalogoApi.apiSinConfigurar;

  protected readonly categorias = computed(() =>
    this.modo() === 'restaurantes' ? CATEGORIAS_RESTAURANTES : CATEGORIAS_SUPERMERCADO,
  );

  protected readonly productosFiltrados = computed(() => {
    const modo = this.modo();
    const categoria = this.categoria();
    const busqueda = this.ui.busqueda().toLowerCase().trim();

    return this.productos().filter((p) => {
      const coincideModo = p.mode === modo;
      const coincideCategoria = categoria === 'Todas' || p.category === categoria;
      const coincideBusqueda =
        busqueda === '' ||
        p.name.toLowerCase().includes(busqueda) ||
        p.description.toLowerCase().includes(busqueda);
      return coincideModo && coincideCategoria && coincideBusqueda;
    });
  });

  ngOnInit(): void {
    // Esperar a que MSAL termine el arranque y el manejo del redirect antes de
    // pegarle al API Gateway. Si la petición sale antes, `auth.autenticado()`
    // todavía es false y el MsalInterceptor (InteractionType.Redirect) recurre
    // a acquireTokenRedirect en vez de acquireTokenSilent, reenviando a Entra
    // ID en bucle porque la redirectUri es esta misma pantalla.
    this.msalBroadcast.inProgress$
      .pipe(
        filter((estado) => estado === InteractionStatus.None),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.cargar());
  }

  protected cargar(): void {
    if (this.apiSinConfigurar) {
      this.endpointUsado.set(null);
      return;
    }

    this.cargando.set(true);
    this.error.set(null);
    this.catalogoVacio.set(false);

    // Con sesión iniciada se golpea el endpoint protegido: así la propia
    // pantalla demuestra que el JWT de Entra ID pasa la validación del backend.
    const autenticado = this.auth.autenticado();
    const peticion = autenticado
      ? this.catalogoApi.listarPrivado()
      : this.catalogoApi.listarPublico();

    peticion.subscribe({
      next: (productos) => {
        this.cargando.set(false);
        this.endpointUsado.set(autenticado ? '/catalogo/privado' : '/catalogo/public');
        // Un catálogo vacío no es un error, pero tampoco son datos reales: hay
        // que decirlo, o el aviso verde mentiría sobre productos de demostración.
        this.catalogoVacio.set(productos.length === 0);
        if (productos.length > 0) {
          this.productos.set(productos);
        }
        this.cargarRecomendaciones();
      },
      error: (e: unknown) => {
        this.cargando.set(false);
        this.endpointUsado.set(null);
        this.catalogoVacio.set(false);
        this.error.set(describirError(e));
        this.productos.set(CATALOGO_DEMO);
      },
    });
  }

  protected cargarRecomendaciones(): void {
    if (!this.auth.autenticado()) {
      return;
    }
    this.analytics.recomendaciones(4).subscribe({
      next: (r) => this.recomendaciones.set(r),
      error: () => this.recomendaciones.set([]),
    });
  }

  protected verDetalle(producto: ProductoVista): void {
    this.detalle.set(producto);
    if (producto.productoId === undefined || this.apiSinConfigurar) {
      return;
    }
    this.catalogoApi.verDetalle(producto.productoId, this.auth.autenticado()).subscribe({
      // Analítica procesa el evento en segundo plano; luego se refrescan las sugerencias
      next: () => setTimeout(() => this.cargarRecomendaciones(), 1500),
      error: () => undefined,
    });
  }

  protected cerrarDetalle(): void {
    this.detalle.set(null);
  }

  protected cambiarModo(modo: ModoCatalogo): void {
    this.modo.set(modo);
    this.categoria.set('Todas');
  }

  protected verHamburguesas(): void {
    this.modo.set('restaurantes');
    this.categoria.set('Hamburguesas');
  }

  protected agregar(producto: ProductoVista): void {
    this.carrito.agregar(producto);
    this.ui.avisar(`¡${producto.name} agregado a tu canasta!`);
  }

  protected quitar(producto: ProductoVista): void {
    this.carrito.quitar(producto.id);
    this.ui.avisar('Producto removido');
  }

  protected async copiarCupon(codigo: string): Promise<void> {
    await navigator.clipboard.writeText(codigo);
    this.cuponCopiado.set(codigo);
    setTimeout(() => this.cuponCopiado.set(null), 2500);
  }

  protected idDe(_indice: number, producto: ProductoVista): string {
    return producto.id;
  }
}
