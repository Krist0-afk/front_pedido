import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiStore } from '../../core/state/ui.store';
import { Icon } from '../icon/icon';

/** Notificaciones flotantes (equivalente al toast del prototipo original). */
@Component({
  selector: 'app-avisos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      @for (aviso of ui.avisos(); track aviso.id) {
        <div
          class="bg-emerald-950 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-emerald-500/30"
        >
          <app-icon name="check-circle" class="w-4 h-4 text-emerald-400" />
          <span>{{ aviso.texto }}</span>
        </div>
      }
    </div>
  `,
})
export class Avisos {
  protected readonly ui = inject(UiStore);
}
