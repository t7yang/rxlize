/// <reference path="../../node_modules/reflect-metadata/Reflect.d.ts" />
import { ReplaySubject } from 'rxjs';
import { alwayPass } from '../util';

const RxMetadataKey = 'dec71ff9-159d-4cfe-bef2-a760bcf4d483';

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
 */
export function RxNgProp(opt: RxNgPropOpt = {}): PropertyDecorator {
  return function (target, key) {
    let value: any;

    Object.defineProperty(target, key, {
      get() {
        return value;
      },
      set(newValue: any) {
        if ((typeof opt.filter === 'function' ? opt.filter : alwayPass)(newValue)) {
          const propsKey: string = Reflect.getOwnMetadata(RxMetadataKey, target);
          value = newValue;
          this?.[propsKey]?.[key]?.next(newValue);
        }
      },
    });
  };
}

/**
 * Decorator for a property that collect all `@Input` properties as observable.
 * `@RxNgProps` decorate property should alway declare before `@RxNgProp`.
 * `@RxNgProps` should alway decorate to only a property in a component,
 * if decorate more that one property, then the last one is the only working one.
 */
export const RxNgProps: PropertyDecorator = function (target, key) {
  Reflect.defineMetadata(RxMetadataKey, key, target);
};

/**
 * Generate a object which a collection of properties that turn into observable by `@RxNgProp` decorator.
 * @param _ `this` which the component instance itself, do nothing by only for typings.
 * @param propsKeys Give the properties name which decorate by `@RxNgProp`.
 */
export const rxNgProps = function <T, P extends keyof T>(
  _: T,
  propsKeys: ReadonlyArray<P>,
): Readonly<{ [K in P]: ReplaySubject<T[K]> }> {
  const props = {} as any;

  for (const key of propsKeys) {
    if (!props[key]) {
      props[key] = new ReplaySubject();
    }
  }

  return props;
};
