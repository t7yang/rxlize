/// <reference path="../../node_modules/reflect-metadata/Reflect.d.ts" />
import { ReplaySubject } from 'rxjs';
import { alwayPass } from '../util';

const RxMetadataKey = 'dec71ff9-159d-4cfe-bef2-a760bcf4d483';

/**
 * @deprecated PLEASE DO NOT USE THIS ANYMORE, SEE `RxNgInputOpt`
 */
export interface RxNgPropOpt {
  /**
   * if prop send with async pipe, then prop type become T | null | undefined,
   * use filter to skip invalid value in runtime.
   */
  filter?: (arg: unknown) => boolean;
}

/**
 * Decorator for `@Input()` property, mark for push incoming value to `@RxNgProps` property.
 *
 * `@RxNgProp` should alway declare after `@RxNgProps`
 * @deprecated PLEASE DO NOT USE THIS ANYMORE, SEE `RxNgInput`
 */
export function RxNgProp(opt: RxNgPropOpt = {}): PropertyDecorator {
  return function (target, key) {
    const INNER_KEY = Math.random().toString(16).slice(2);

    Object.defineProperty(target, INNER_KEY, { enumerable: false, writable: true, configurable: false });

    Object.defineProperty(target, key, {
      get() {
        return (target as any)[INNER_KEY];
      },
      set(newValue: any) {
        if ((typeof opt.filter === 'function' ? opt.filter : alwayPass)(newValue)) {
          const propsKey: string = Reflect.getOwnMetadata(RxMetadataKey, target);
          (target as any)[INNER_KEY] = newValue;
          this?.[propsKey]?.[key]?.next(newValue);
        }
      },
    });
  };
}

/**
 * Decorator for a property that collect all `@Input` properties as observable.
 *
 * `@RxNgProps` decorate property should alway declare before `@RxNgProp`.
 *
 * `@RxNgProps` should alway decorate to only a property in a component, *
 * if decorate more that one property, then the last one is the only working one.
 * @deprecated PLEASE DO NOT USE THIS ANYMORE, USE `RxNgInput` INSTEAD
 */
export function RxNgProps(): PropertyDecorator {
  return function (target, key) {
    Reflect.defineMetadata(RxMetadataKey, key, target);
  };
}

/**
 * Create a object which a collection of properties that turn into observable by `@RxNgProp` decorator.
 * @param _ `this` which the component instance itself, do nothing by only for typings.
 * @param propsKeys Give the properties name which decorate by `@RxNgProp`.
 * @deprecated PLEASE DO NOT USE THIS ANYMORE, USE `createRxNgInput` INSTEAD
 */
export const createRxNgProps = function <T, P extends keyof T>(
  _: T,
  keys: ReadonlyArray<P>,
): Readonly<{ [K in P]: ReplaySubject<T[K]> }> {
  const props = {} as any;

  for (const key of keys) {
    if (!props[key]) {
      props[key] = new ReplaySubject();
    }
  }

  return props;
};
