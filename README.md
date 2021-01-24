# Rxlize

Rxlize is a library for manage state, asynchronous task and others actions in reactive (RxJS) way.

## Install

```
npm install rxlize
```

```
yarn add rxlize
```

## Usage

### With NPM

Install Rxlize then import and don't forget to install peer dependency(ies).

### In browser

Make sure to load `rxjs` globally before loading `rxlize.min.js`.

## List of function

- State

  - `rxStore` -- Create a simple store that can dispatch action to update.
  - `rxToggle` -- Create a boolean state that provide `on`, `off`, `toggle`, `next` to change the state.

- Side Effect

  - `rxAsync` -- Handle an async process and provide loading state and error stream.
  - `rxNext` -- Special case of `rxAsync` which provide a default `Subject`.

- Angular
  - `rxNgHooks` - Transform Angular component lifecycle event to observable stream.
  - `@RxNgProps`, `@RxNgProp`, `rxNgProps` - Mark `@Input` properties and transform into a collection of observables.

## Cautions

This is a preview version, functions in this library not yet cover by test and signature may change from time to time, so take your own risk to use.

### Angular

- `@angular/cli` may generate warning message about `CommonJS or AMD dependencies can cause optimization bailouts.` on building, This because `@babel/runtime-corejs3` export only with CommonJS module.
