# Rxlize Angular Props (`@Input`)

Rxlize library provides serveral tools to help Angular developer turn component property into observable.

The Angular component properties is decorate by `@Input` decorator which is a plain object property, this may cause some pains:

- Hard to working with other observables component, manually map property into observable could be cumbersome.
- Passing prop with `async` pipe may cause emit null as first value.
- Enabled `strictTemplate` may cause developer suffer for fixing types.

Rxlize provides a decorators and a function to work with this:

- `@RxNgInput()`:
  - Decorate a property of component, explicitly give properties name decorate by `@Input()` to observe.
  - Return a object of observables with given properties name.
- `createRxNgInput`
  - A factory function to generate observing properties to a object of observables (`ReplaySubject`).

### Example

```ts
@Component({
  ...
  template: `<app-card [name]="name" [name3]="name$ | async" [name4]="name$ | async"></app-card>`,
  // if async pipe working with strict mode enabled, make sure handle the props type properly according to the props declaration
  // if you do it wrong, the app may run into exception at runtime even the types is correct at compile time
  // template: `<app-card [name]="name" [name3]="(name$ | async) || ''" [name4]="(name$ | async)!"></app-card>`,
})
export class ParentComponent implement OnInit {
  name = 'name: 1st emit';

  name$ = new Subject<string>();

  ngOnInit() {
    setTimeout(() => {
      this.name = 'name: 2nd emit';
      this.name$.next('name$: 1st emit');
    }, 2000);
  }
}
```

```ts
// ... imports
import { createRxNgInput, RxNgInput } from 'rxlize';

@Component({...})
export class CardComponent {
  @Input() name!: string;
  @Input() name2 = 'default name2';
  @Input() name3 = 'default name3';
  @Input() name4 = 'default name4';

  @RxNgInput({
    // filter can help you omit value invalid, for example null from async pipe
    filter: (prop, change) => {
      switch (prop) {
        case 'name4':
          return change.currentValue != null;
        default:
          return true;
      }
    },
  })
  // createRxNgInput do nothing to `this`, only for types guard
  // MUST explicitly giving props to observe
  props = createRxNgInput(this, ['name', 'name2', 'name3', 'name4']);

  constructor() {
    this.props.name.subscribe(value => console.log('this.name = ', value));
    // this.name = name: 1st emit
    // this.name = name: 2nd emit (2s later)

    this.props.name2.subscribe(value => console.log('this.name2 = ', value));
    // nothing emit here

    // due to async pipe default value for internal `_latestValue` is null
    this.props.name3.subscribe(value => console.log('this.name3 = ', value));
    // this.name3 = null (after component init, this null produce by async pipe)
    // this.name3 = name$: 1st emit (2s later)

    // by using filter, null is skip from the emit values
    this.props.name4.subscribe(value => console.log('this.name4 = ', value));
    // this.name4 = name$: 1st emit (2s later)
  }
}
```
