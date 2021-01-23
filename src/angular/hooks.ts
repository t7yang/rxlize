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
  Type,
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

export const rxNgHooks = <T extends NgHooks>(
  comp: InstanceType<Type<any>>,
  ...hooks: T[]
): Readonly<Pick<NgHooksObservable, T>> => {
  const HooksObs = {} as any;

  for (const hook of hooks) {
    if (!HooksObs[hook]) {
      const origHook = comp.constructor.prototype[hook];

      HooksObs[hook] = new Subject<unknown>();
      comp.constructor.prototype[hook] = function (...args: any[]) {
        origHook?.(...args);
        HooksObs[hook].next(...args);
      };
    }
  }

  return Object.freeze(HooksObs);
};
