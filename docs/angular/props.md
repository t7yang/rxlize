# Rxlize Angular Props (`@Input`)

The Angular component properties is decorate by `@Input` decorator which not in observable form, it is hard to combine component property in rxjs flow.

The series of decorators and functions below show how to help developer turn properties into observable.

### Example

```ts
// ... imports
import { RxNgProp, rxNgProps, RxNgProps } from 'rxlize';

@Component({...})
export class CardComponent {
  // the `props` property decorate by @RxNgProps MUST declare before all @RxNgProp and @Input
  // rxNgProps do nothing to "this" but only for types guard
  // MUST explicitly giving props to observe
  @RxNgProps props = rxNgProps(this, ['name', 'name2']);

  // all @RxNgProp MUST declare after @RxNgProps
  // with @RxNgProp new incoming value will push into mapping observable
  @RxNgProp @Input() name!: string;

  // fine for put @RxNgProp after @Input
  // if @Input is optional, give default value to make first emit value
  @Input() @RxNgProp name = 'default name';

  constructor() {
    this.props.name.subscribe((value) => console.log('this.name = ', value));
    // this.name = title 1
    // this.name = title 2 (2s later)

    this.props.name2.subscribe((value) => console.log('this.name2 = ', value));
    // this.name = default name

  }
}
```

```ts
@Component({
  ...
  template: `
    <app-card [name]="name"></app-card>
  `
})
export class ParentComponent implement OnInit {
  name = 'title 1';

  ngOnInit() {
    setTimeout(() => (this.name = 'title 2'), 2000);
  }
}
```
