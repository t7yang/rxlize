import { OnChanges, SimpleChange } from '@angular/core';
import { ReplaySubject } from 'rxjs';

const HAS_RX_INPUT_INIT_KEY = 'f90af66b-48aa-4c3c-845f-e47510631884';

export interface RxNgInputOpt {
  /**
   * if prop send with async pipe, then prop type become T | null | undefined,
   * use filter to skip invalid value in runtime.
   * @param prop `@Input()` property field
   * @param change `SimpleChange` for the ccorresponding `@Input()` property field
   */
  filter?: (prop: string, change: SimpleChange) => boolean;
}

/**
 * `RxNgInput` factory function
 * @param opt Options for `RxNgInput` factory function
 * @returns `RxNgInput` property decorator
 */
export function RxNgInput(opt: RxNgInputOpt = {}): PropertyDecorator {
  return function (target, key) {
    if (!Reflect.getMetadata(HAS_RX_INPUT_INIT_KEY, target)) {
      const origNgOnChanges: any = (target as OnChanges).ngOnChanges;

      (target as OnChanges).ngOnChanges = function (changes) {
        origNgOnChanges?.call(this, changes);

        for (const prop of Object.getOwnPropertyNames(changes)) {
          if (typeof opt.filter === 'function' ? opt.filter(prop, changes[prop]) : true) {
            (this as any)[key]?.[prop]?.next?.(changes[prop].currentValue);
          }
        }
      };

      Reflect.defineMetadata(HAS_RX_INPUT_INIT_KEY, true, target);
    }
  };
}

/**
 * Helper function to create RxInput observable object
 * @param _comp Instance of component class which mean `this`
 * @param inputProps Array of `@Input()` field name
 * @returns An object with `@Input()` field name and observable value
 */
export function createRxNgInput<T, K extends keyof T>(
  _comp: T,
  inputProps: K[],
): Readonly<{ [P in K]: ReplaySubject<T[P]> }> {
  const rxInput = {} as { [P in K]: ReplaySubject<T[P]> };

  for (const prop of inputProps) {
    if (!rxInput[prop]) {
      rxInput[prop] = new ReplaySubject(1);
    }
  }

  return Object.freeze(rxInput);
}
