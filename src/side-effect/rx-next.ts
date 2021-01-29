import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { genLoadingState, handleUpdate } from '../internal';
import { RxlAsyncState, RxlCache, RxlInit, RxlSource } from '../types';

export function rxNext<S, R, T extends Subject<S> = Subject<S>>(
  operator: OperatorFunction<S, R>,
  opt: RxlInit<R> & RxlSource<S, T> = {},
): {
  state$: Observable<RxlAsyncState<R | undefined>>;
  error$: Subject<unknown>;
  source$: T;
} {
  const cache: RxlCache<R> = { data: opt.init };
  const source$ = (opt.src$ ?? new Subject<S>()) as T;
  const error$ = new Subject<unknown>();

  const state$ = merge(
    source$.pipe(map(genLoadingState(cache))),
    source$.pipe(operator, handleUpdate(cache, error$)),
  ).pipe(startWith({ isLoading: false, error: null, data: cache.data }));

  return { state$, error$, source$ };
}
