import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { KeyValuePipe } from '@angular/common';

import { DetalleGrupo, DetalleTopico, GrupoConsumidores, Topico } from '../../../core/models/kafka.model';
import { describirError } from '../../../core/services/http-error.util';
import { KafkaAdminService } from '../../../core/services/kafka-admin.service';
import { Icon } from '../../../shared/icon/icon';

/** Administración de Kafka a través de ms-kafka-admin: tópicos, configuración y consumer groups. */
@Component({
  selector: 'app-kafka-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KeyValuePipe, Icon],
  templateUrl: './kafka-admin.html',
})
export class KafkaAdmin implements OnInit {
  private readonly kafka = inject(KafkaAdminService);

  protected readonly brokers = signal<{ id: number; host: string; puerto: number }[]>([]);
  protected readonly controlador = signal<number | null>(null);
  protected readonly topicos = signal<Topico[]>([]);
  protected readonly grupos = signal<GrupoConsumidores[]>([]);
  protected readonly detalleTopico = signal<DetalleTopico | null>(null);
  protected readonly detalleGrupo = signal<DetalleGrupo | null>(null);
  protected readonly mensaje = signal<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  protected readonly cargando = signal(false);

  // Formulario de nuevo tópico
  protected readonly nombre = signal('pedidos360.prueba');
  protected readonly particiones = signal(3);
  protected readonly replicas = signal(3);
  protected readonly retencionHoras = signal(24);
  protected readonly cleanup = signal<'delete' | 'compact'>('delete');

  // Edición de configuración del tópico abierto
  protected readonly nuevaRetencionHoras = signal(168);
  protected readonly totalParticiones = signal(4);

  ngOnInit(): void {
    this.recargar();
  }

  protected recargar(): void {
    this.cargando.set(true);
    this.kafka.cluster().subscribe({
      next: (c) => {
        this.brokers.set(c.brokers);
        this.controlador.set(c.controlador);
      },
      error: (e: unknown) => this.error(e),
    });
    this.kafka.topicos().subscribe({
      next: (t) => {
        this.topicos.set(t);
        this.cargando.set(false);
      },
      error: (e: unknown) => {
        this.cargando.set(false);
        this.error(e);
      },
    });
    this.kafka.grupos().subscribe({ next: (g) => this.grupos.set(g), error: (e: unknown) => this.error(e) });
  }

  protected verTopico(nombre: string): void {
    this.detalleGrupo.set(null);
    this.kafka.topico(nombre).subscribe({
      next: (d) => {
        this.detalleTopico.set(d);
        const retencion = Number(d.configs['retention.ms'] ?? 604800000);
        this.nuevaRetencionHoras.set(Math.round(retencion / 3600000));
        this.totalParticiones.set(d.particiones.length + 1);
      },
      error: (e: unknown) => this.error(e),
    });
  }

  protected verGrupo(id: string): void {
    this.detalleTopico.set(null);
    this.kafka.grupo(id).subscribe({ next: (d) => this.detalleGrupo.set(d), error: (e: unknown) => this.error(e) });
  }

  protected crear(): void {
    this.kafka
      .crearTopico({
        nombre: this.nombre().trim(),
        particiones: this.particiones(),
        replicas: this.replicas(),
        configs: {
          'retention.ms': String(this.retencionHoras() * 3600000),
          'cleanup.policy': this.cleanup(),
          'min.insync.replicas': this.replicas() >= 3 ? '2' : '1',
        },
      })
      .subscribe({ next: () => this.ok(`Tópico ${this.nombre()} creado`), error: (e: unknown) => this.error(e) });
  }

  protected guardarRetencion(nombre: string): void {
    this.kafka
      .actualizarConfig(nombre, { 'retention.ms': String(this.nuevaRetencionHoras() * 3600000) })
      .subscribe({
        next: () => {
          this.ok(`Retención de ${nombre} actualizada a ${this.nuevaRetencionHoras()} horas`);
          this.verTopico(nombre);
        },
        error: (e: unknown) => this.error(e),
      });
  }

  protected aumentarParticiones(nombre: string): void {
    this.kafka.aumentarParticiones(nombre, this.totalParticiones()).subscribe({
      next: () => {
        this.ok(`${nombre} ahora tiene ${this.totalParticiones()} particiones`);
        this.verTopico(nombre);
      },
      error: (e: unknown) => this.error(e),
    });
  }

  protected eliminar(nombre: string): void {
    if (!confirm(`¿Eliminar el tópico ${nombre}? Se pierden sus mensajes.`)) {
      return;
    }
    this.kafka.eliminarTopico(nombre).subscribe({
      next: () => {
        this.detalleTopico.set(null);
        this.ok(`Tópico ${nombre} eliminado`);
      },
      error: (e: unknown) => this.error(e),
    });
  }

  protected numero(evento: Event): number {
    return Number((evento.target as HTMLInputElement).value);
  }

  protected texto(evento: Event): string {
    return (evento.target as HTMLInputElement).value;
  }

  protected esInterno(nombre: string): boolean {
    return nombre.startsWith('_');
  }

  private ok(texto: string): void {
    this.mensaje.set({ tipo: 'ok', texto });
    this.recargar();
  }

  private error(e: unknown): void {
    const cuerpo = (e as { error?: { error?: string } })?.error;
    this.mensaje.set({ tipo: 'error', texto: cuerpo?.error ?? describirError(e) });
  }
}
