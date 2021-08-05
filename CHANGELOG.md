# Rxlize Change Log

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.5.0] - 2021-08-05

### Deprecated

- remove deprecated `rxNgHooks`, `RxNgProps`, `RxNgProp`, and `RxNgPropOpt`.

### Fixed

- fixed first value do not pass throught to operator in `rxAsync`.

## [0.4.0] - 2021-07-10

### Deprecated

- mark deprecated for `rxNgHooks` due bad design.
- mark deprecated for `RxNgProps`, `RxNgProp`, and `RxNgPropOpt` due bad design.

### Added

- provide `RxNgHooks` and `createRxNgHooks` with better design.
- provide `RxNgInput` and `createRxNgInput` with better design.

## [0.3.1] - 2021-07-05

### Fixed

- internal value of `RxNgProp` share between component

## [0.3.0] - 2021-02-20

### Added

- Add `filter` option to `RxNgProp` decorator.
- Add `nonNullable` filter function.

### Changed

- All decorators from angular/props need to call on decorating now.
- `rxNgProps` rename to `createRxNgProps` to increase semantic.

## [0.2.0] - 2021-01-24

### Added

- Add `RxNgProps`, `RxNgProp`, `rxNgProps` decorator and function to collect `@Input` props to observable.
- Add document for Angular section.

### Changed

- All `RxNgLifeCycle`\* prefix change to `RxNgHook`.
- Replace `Object` methods with `for` to reduce bundle size in `rxStore`.

### Fixed

- Add `share` to source in `rxAsync` to prevent multiple subscribe to `ObservableInput`.
- Correct `Dispatch` types in `rxStore`.

## [0.1.1] - 2021-01-18

### Changed

- update params types of `rxNgLifecyle`.

## [0.1.0] - 2020-09-13

### Changed

- `rxAsync` and `rxNext` receive a observable operator function instead of RxlFactory function at second argument.

### Fixed

- `rxStore` now create a new observable in reset instead of use the same one.

## [0.0.6] - 2020-09-10

### Fixed

- The build config for babel and rollup are now setup correctly, bundle files are working fine in module and browswer.
- Unpublish 0.0.3 to 0.0.5, due build configs are not setup properly.

## [0.0.5] - 2020-09-10 (UNPUBLISH)

### Fixed

- Add output.globals for iife build in rollup config.
- `RxlAsyncState.data` is not longer optional in `rxStore`.

## [0.0.4] - 2020-09-10 (UNPUBLISH)

### Fixed

- Add output.globals for iife build in rollup config.

## [0.0.3] - 2020-09-10 (UNPUBLISH)

### Fixed

- The data property of RxlAsyncState in rxStore should not be optional

### Changed

- Add cautions section in readme.

## [0.0.2] - 2020-09-09

### Fixed

- Make rxjs as external resource and move it to peerDependencies to avoid potential types error.

## [0.0.1] - 2020-09-09

- Initial release
