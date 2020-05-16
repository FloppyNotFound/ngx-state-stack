import { StatesService } from './states.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';

@Injectable()
export class StateGuard implements CanActivateChild {
  constructor(private _statesService: StatesService) {}

  canActivateChild(
    // @ts-ignore: part of interface
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('route changed', window.location.pathname, childRoute, state);

    // Go through state stack and delete routes which are after the current one
    this._statesService.clearStateUntilRoute(
      window.location.pathname,
      state.url
    );

    // If states have been cleaned up and state of current route still exists,
    // we navigated back to current route. Do not init anew.
    if (!this._statesService.getDoesStoreExistForRoute(state.url)) {
      this._statesService.initRoute(state.url);
    }

    return true;
  }
}
