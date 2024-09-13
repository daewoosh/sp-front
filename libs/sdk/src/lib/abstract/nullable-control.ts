import { Directive } from '@angular/core';

import { TsAbstractControl } from './abstract-control';

@Directive()
export abstract class TsAbstractNullableControl<
  T
> extends TsAbstractControl<T | null> {
  protected getFallbackValue(): T | null {
    return null;
  }
}
