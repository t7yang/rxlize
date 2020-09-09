import { BehaviorSubject } from 'rxjs';
import { VoidFn } from '../types';

export const rxToggle = (
  init = false,
): {
  state$: BehaviorSubject<boolean>;
  on: VoidFn<[]>;
  off: VoidFn<[]>;
  next: VoidFn<[boolean]>;
  toggle: VoidFn<[]>;
} => {
  const state$ = new BehaviorSubject(init);
  const on = () => state$.next(true);
  const off = () => state$.next(false);
  const next = (state: boolean) => state$.next(state);
  const toggle = () => state$.next(!state$.value);

  return { state$, on, off, next, toggle };
};
