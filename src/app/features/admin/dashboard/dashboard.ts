import { CurrencyPipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Client } from '@stomp/stompjs';

import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/auth.service';
import { AlertaFraude, Metricas } from '../../../core/models/analytics.model';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { describirError } from '../../../core/services/http-error.util';
import { Icon } from '../../../shared/icon/icon';

/**
 * Dashboard de analítica en tiempo real. Las métricas las calcula ms-analytics desde los
 * eventos de Kafka y llegan por WebSocket (STOMP): /topic/metricas cada vez que cambian
 * y /topic/alertas en el instante en que el antifraude bloquea un pago.
 *
 * El WebSocket solo existe en el nginx de la EC2 del frontend: el API Gateway HTTP no
 * maneja WebSockets. Si la conexión no se logra (por ejemplo al entrar por la URL del
 * API Gateway de frontend), las métricas se consultan por REST cada 10 segundos.
 */
@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DecimalPipe, Icon],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly analytics = inject(AnalyticsService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly metricas = signal<Metricas | null>(null);
  protected readonly conectado = signal(false);
  /** `true` cuando no hay WebSocket y las métricas se consultan por REST. */
  protected readonly consultando = signal(false);
  protected readonly error = signal<string | null>(null);
  /** Alerta recién llegada por /topic/alertas (se resalta unos segundos). */
  protected readonly alertaNueva = signal<AlertaFraude | null>(null);
  private cliente: Client | null = null;
  private sondeo: ReturnType<typeof setInterval> | null = null;
  private esperaWs: ReturnType<typeof setTimeout> | null = null;

  protected readonly maxClics = computed(() =>
    Math.max(1, ...(this.metricas()?.clicsPorMinuto ?? []).map((m) => m.total)),
  );
  protected readonly maxVistas = computed(() =>
    Math.max(1, ...(this.metricas()?.productosMasVistos ?? []).map((p) => p.vistas)),
  );
  protected readonly totalPagos = computed(() => {
    const p = this.metricas()?.pagos;
    return p ? p.aprobados + p.rechazados + p.bloqueados : 0;
  });
  protected readonly eventosPorTipo = computed(() =>
    Object.entries(this.metricas()?.eventosPorTipo ?? {}).sort((a, b) => b[1] - a[1]),
  );

  ngOnInit(): void {
    this.cargarMetricas();
    // El token se asegura antes de abrir el WebSocket: viaja en el CONNECT de STOMP
    this.auth.asegurarRoles().subscribe(() => this.conectar());
    this.destroyRef.onDestroy(() => {
      this.cliente?.deactivate();
      this.detenerSondeo();
      if (this.esperaWs) clearTimeout(this.esperaWs);
    });
  }

  private cargarMetricas(): void {
    this.analytics.metricas().subscribe({
      next: (m) => this.metricas.set(m),
      error: (e: unknown) => this.error.set(describirError(e)),
    });
  }

  private iniciarSondeo(): void {
    if (this.sondeo || this.conectado()) return;
    this.consultando.set(true);
    this.sondeo = setInterval(() => this.cargarMetricas(), 10000);
  }

  private detenerSondeo(): void {
    if (this.sondeo) clearInterval(this.sondeo);
    this.sondeo = null;
    this.consultando.set(false);
  }

  private conectar(): void {
    const protocolo = window.location.protocol === 'https:' ? 'wss' : 'ws';
    this.cliente = new Client({
      brokerURL: `${protocolo}://${window.location.host}${environment.analyticsWs}`,
      reconnectDelay: 5000,
      // En cada (re)conexión se manda el token vigente
      beforeConnect: () => {
        if (this.cliente) {
          this.cliente.connectHeaders = { Authorization: `Bearer ${this.auth.accessToken()}` };
        }
      },
      onConnect: () => {
        this.conectado.set(true);
        this.detenerSondeo();
        this.error.set(null);
        this.cliente?.subscribe('/topic/metricas', (mensaje) => this.metricas.set(JSON.parse(mensaje.body)));
        this.cliente?.subscribe('/topic/alertas', (mensaje) => {
          this.alertaNueva.set(JSON.parse(mensaje.body));
          setTimeout(() => this.alertaNueva.set(null), 6000);
        });
      },
      onStompError: (frame) => {
        this.conectado.set(false);
        this.error.set(frame.headers['message'] ?? 'El servidor rechazó la conexión');
      },
      onWebSocketClose: () => {
        this.conectado.set(false);
        this.iniciarSondeo();
      },
    });
    this.cliente.activate();
    // Si en 8 segundos no hay conexión, se pasa a consultar por REST mientras sigue reintentando
    this.esperaWs = setTimeout(() => this.iniciarSondeo(), 8000);
  }

  protected alto(total: number): number {
    return Math.round((total / this.maxClics()) * 100);
  }

  protected ancho(vistas: number): number {
    return Math.round((vistas / this.maxVistas()) * 100);
  }

  protected porcentaje(valor: number): number {
    return this.totalPagos() === 0 ? 0 : Math.round((valor / this.totalPagos()) * 100);
  }
}
