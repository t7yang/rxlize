import { ObservableInput, Subject } from 'rxjs';

export type VoidFn<A extends any[]> = (...args: A) => void;

export type RxlAsyncState<R> = { isLoading: boolean; error: unknown; data: R };

export type RxlFactory<S extends any[], R> = (...source: S) => ObservableInput<R>;

export type RxlCache<R> = { data: R | undefined };

export type RxlInit<R> = { init?: R };

export type RxlSource<S, T extends Subject<S> = Subject<S>> = { src$?: T };
