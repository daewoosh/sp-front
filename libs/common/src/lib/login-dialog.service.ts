import { inject, Injectable, INJECTOR } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { finalize } from 'rxjs';

import { LoginModalComponent } from './login-modal/login-modal.component';

@Injectable({ providedIn: 'root' })
export class LoginDialogService {
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(INJECTOR);
  private isOpen = false;

  open(): void {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;
    this.dialogs.open(
      new PolymorpheusComponent(LoginModalComponent, this.injector),
      {
        data: 237,
        dismissible: true,
        appearance: 'sp-modal',
      }
    ).pipe(
      finalize(() => this.isOpen = false)
    ).subscribe();
  }
}
