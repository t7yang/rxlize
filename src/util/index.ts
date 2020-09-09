import { Observable, of, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { RxlAsyncState, RxlCache } from '../types';

export const genErrorSubject = (): Subject<unknown> => new Subject<unknown>();

export const genLoadingState = <R>(cache: RxlCache<R>) => (): RxlAsyncState<R> => ({
  isLoading: true,
  error: null,
  data: cache.data,
});

export const handleUpdate = <R>(cache: RxlCache<R>, error$: Subject<unknown>) => (
  obs: Observable<R>,
): Observable<RxlAsyncState<R>> =>
  obs.pipe(
    tap(data => (cache.data = data)),
    map(data => ({ isLoading: false, error: null, data })),
    catchError(error => (error$.next(error), of({ isLoading: false, error, data: cache.data }))),
  );
