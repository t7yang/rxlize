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

type LifecycleEventWithoutParams =
  | keyof OnInit
  | keyof DoCheck
  | keyof AfterContentInit
  | keyof AfterContentChecked
  | keyof AfterViewInit
  | keyof AfterViewChecked
  | keyof OnDestroy;

type LifecycleEventWithParams = keyof OnChanges;

type LifecycleEvent = LifecycleEventWithoutParams | LifecycleEventWithParams;

type LifecycleObservable = Record<LifecycleEventWithoutParams, Observable<void>> &
  Record<LifecycleEventWithParams, Observable<SimpleChanges>>;

export const rxNgLifecycle = <T extends LifecycleEvent>(
  comp: InstanceType<Type<any>>,
  ...events: T[]
): Readonly<Pick<LifecycleObservable, T>> => {
  const LifeObs = {} as any;

  for (const event of events) {
    if (!LifeObs[event]) {
      LifeObs[event] = new Subject<unknown>();
      const oldHookMethod = comp.constructor.prototype[event];
      comp.constructor.prototype[event] = function (...args: any[]) {
        oldHookMethod?.(...args);
        LifeObs[event].next(...args);
      };
    }
  }

  return LifeObs;
};
