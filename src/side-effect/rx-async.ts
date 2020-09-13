import { from, merge, Observable, ObservableInput, OperatorFunction, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RxlAsyncState, RxlCache, RxlInit } from '../types';
import { genErrorSubject, genLoadingState, handleUpdate } from '../util';

export function rxAsync<S, R>(
  source: ObservableInput<S>,
  operator: OperatorFunction<S, R>,
  opt: RxlInit<R> = {},
): { state$: Observable<RxlAsyncState<R | undefined>>; error$: Subject<unknown> } {
  const cache: RxlCache<R> = { data: opt.init };
  const source$ = from(source);
  const error$ = genErrorSubject();

  const state$ = merge(
    source$.pipe(map(genLoadingState(cache))),
    source$.pipe(operator, handleUpdate(cache, error$)),
  ).pipe(startWith({ isLoading: false, error: null, data: cache.data }));

  return { state$, error$ };
}
