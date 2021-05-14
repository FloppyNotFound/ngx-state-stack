# ngx-state-stack

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

[![Node.js CI](https://github.com/FloppyNotFound/ngx-state-stack/actions/workflows/node.js.yml/badge.svg)](https://github.com/FloppyNotFound/ngx-state-stack/actions/workflows/node.js.yml)

## Usage

### Import module

Import the NgxStateStackModule in your AppModule by calling forRoot().

Note: Only call forRoot() once in your project!

```typescript
@NgModule({
  imports: [BrowserModule, NgxStateStackModule.forRoot()]
})
export class AppModule {}
```

### Register on Route

Add to most outer route by adding the StateGuard to CanActivateChild.

This ensures that the guard is called for every route change within the parent route.

```typescript
import { StateGuard } from 'ngx-state-stack';

const routes: Routes = [{
    path: 'path/to/my-component',
    loadChildren: '...',
    canActivateChild: [StateGuard]
  },

@NgModule({
  imports: [
    RouterModule.forRoot()
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

### Save state

Create a state service which implements the AppState interface:

```typescript
import { StatesService, AppState } from 'ngx-state-stack';

export class MyComponentsStateService implements AppState {
  private _routePath: string;
  public get routePath(): string {
    return this._routePath;
  }

  private _myPropertyToCache: string;
  public get myPropertyToCache(): string {
    return this._myPropertyToCache;
  }

  constructor(private _states: StatesService) {}

  cache(routePath: string, myPropertyToCache: string): void {
    this._routePath = routePath;
    this._myPropertyToCache = myPropertyToCache;

    this._states.cache(this);
  }
}
```

Save the state in your Component, before leaving it via routing:

```typescript
import { Router } from '@angular/router';
import { MyComponentsStateService } from '...';

@Component({
  selector: 'my-component',
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.scss']
})
export class MyComponent {
  myProperty: string;

  constructor(
    private _state: MyComponentsStateService,
    private _router: Router
  ) {}

  navigateForwards(): void {
    this._state.cache(this._router.url, this.myProperty);

    this._router.navigate(...);
  }
}
```

The state is cleared automatically if you navigate back to a route which is before the current one.

If you navigate back to the current page, just access the properties within your StateService, they will still be cached, as long as you don't leave the page.
