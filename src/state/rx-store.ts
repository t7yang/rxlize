import { BehaviorSubject, from, Observable } from 'rxjs';
import { RxlAsyncState, RxlFactory, RxlInit, VoidFn } from '../types';

type Dispatcher<S, R> = { [P in keyof R]: (s: S) => (...a: any[]) => S };
type Dispatch<S, D extends Dispatcher<S, D>> = { [P in keyof D]: VoidFn<Parameters<ReturnType<D[P]>>> };

export function rxStore<S, D extends Dispatcher<S, D>>(
  factory: RxlFactory<[], S>,
  dispatcher: D,
  opt: Required<RxlInit<S>>,
): { store$: Observable<RxlAsyncState<S>>; dispatch: Dispatch<S, D>; start: VoidFn<[]>; reset: VoidFn<[]> } {
  let isInitial = false;
  const store$ = new BehaviorSubject({ isLoading: false, error: null, data: opt.init });
  const dispatch = {} as Dispatch<S, D>;

  for (const key in dispatcher) {
    if (dispatcher.hasOwnProperty(key)) {
      dispatch[key] = (...a: any[]) =>
        void store$.next({ isLoading: false, error: null, data: dispatcher[key](store$.value.data)(...a) });
    }
  }

  const reset = () => {
    store$.next({ ...store$.value, isLoading: true });
    from(factory()).subscribe({
      next: data => store$.next({ isLoading: false, error: null, data }),
      error: error => store$.next({ ...store$.value, isLoading: false, error }),
    });
  };

  const start = () => !isInitial && ((isInitial = true), reset());

  return { store$: store$.asObservable(), dispatch, start, reset };
}
