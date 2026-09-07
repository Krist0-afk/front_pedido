import { Injectable, signal } from '@angular/core';

export interface Aviso {
  id: number;
  texto: string;
}

/**
 * Estado transversal de la interfaz: el drawer del carrito, el buscador
 * global del header y los avisos tipo toast.
 */
@Injectable({ providedIn: 'root' })
export class UiStore {
  private readonly _carritoAbierto = signal(false);
  readonly carritoAbierto = this._carritoAbierto.asReadonly();

  private readonly _busqueda = signal('');
  readonly busqueda = this._busqueda.asReadonly();

  private readonly _avisos = signal<Aviso[]>([]);
  readonly avisos = this._avisos.asReadonly();

  private siguienteId = 1;

  abrirCarrito(): void {
    this._carritoAbierto.set(true);
  }

  cerrarCarrito(): void {
    this._carritoAbierto.set(false);
  }

  buscar(texto: string): void {
    this._busqueda.set(texto);
  }

  avisar(texto: string): void {
    const id = this.siguienteId++;
    this._avisos.update((avisos) => [...avisos, { id, texto }]);
    setTimeout(() => {
      this._avisos.update((avisos) => avisos.filter((aviso) => aviso.id !== id));
    }, 3500);
  }
}
