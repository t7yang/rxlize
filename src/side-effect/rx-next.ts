import { merge, Observable, Subject } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { RxlAsyncState, RxlCache, RxlFactory, RxlInit, RxlSource } from '../types';
import { genLoadingState, handleUpdate } from '../util';

export function rxNext<S, R, T extends Subject<S> = Subject<S>>(
  factory: RxlFactory<[S, number], R>,
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
    source$.pipe(switchMap(factory), handleUpdate(cache, error$)),
  ).pipe(startWith({ isLoading: false, error: null, data: cache.data }));

  return { state$, error$, source$ };
}
