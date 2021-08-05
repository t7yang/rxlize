/// <reference path="../../node_modules/reflect-metadata/Reflect.d.ts" />

import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  DoCheck,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

type NgHooksWithoutParams =
  | keyof OnInit
  | keyof DoCheck
  | keyof AfterContentInit
  | keyof AfterContentChecked
  | keyof AfterViewInit
  | keyof AfterViewChecked
  | keyof OnDestroy;

type NgHooksWithParams = keyof OnChanges;

type NgHooks = NgHooksWithoutParams | NgHooksWithParams;

type NgHooksObservable = Record<NgHooksWithoutParams, Observable<void>> &
  Record<NgHooksWithParams, Observable<SimpleChanges>>;

const HAS_RX_HOOKS_INIT_KEY = 'ffbe4a65-1ff6-4f47-970a-d4b2424c98f7';

/**
 * Decorate on a component property which is component lifecycle observable object
 * @param hooks Array of Angular lifecycle method name
 * @returns A property decorator for component lifecycle observable object
 */
export function RxNgHooks(hooks: NgHooks[]): PropertyDecorator {
  return function (target, key) {
    if (!Reflect.getMetadata(HAS_RX_HOOKS_INIT_KEY, target)) {
      for (const hook of hooks) {
        const origHook = (target as any)[hook];

        if (!origHook?.isRxNgHook) {
          (target as any)[hook] = function (...args: any[]) {
            origHook?.apply(this, args);
            this[key]?.[hook]?.next?.(...args);
          };

          (target as any)[hook].isRxNgHook = true;
        }
      }

      Reflect.defineMetadata(HAS_RX_HOOKS_INIT_KEY, true, target);
    }
  };
}

export function ngHooks<T extends NgHooks>(hooks: T[]): T[] {
  return hooks;
}

/**
 * Create a component lifecycle observable object
 * @param hooks Array of Angular lifecycle method name
 * @returns A component lifecycle observable object
 */
export function createRxNgHooks<T extends NgHooks>(hooks: T[]): Readonly<Pick<NgHooksObservable, T>> {
  const rxHooks = {} as any;

  for (const hook of hooks) {
    if (!rxHooks[hook]) {
      rxHooks[hook] = new Subject<unknown>();
    }
  }

  return Object.freeze(rxHooks);
}
