import { Component, inject } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from "@taiga-ui/core";
import { injectContext } from "@taiga-ui/polymorpheus";

@Component({
  selector: 'sp-reset-modal',
  standalone: true,
  imports: [],
  templateUrl: './reset-modal.component.html',
  styleUrl: './reset-modal.component.scss'
})
export class ResetModalComponent {

  private readonly dialogs = inject(TuiDialogService);
  private readonly context = injectContext<TuiDialogContext<boolean>>();

  cancel() {
    this.context.completeWith(false);
  }

  submit() {
    this.context.completeWith(true);
  }
}
