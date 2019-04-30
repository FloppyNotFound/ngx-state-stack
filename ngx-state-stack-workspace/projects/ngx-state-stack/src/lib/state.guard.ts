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
    // Current
    console.log('CURRENT: ' + window.location.pathname);

    // New
    console.log('NEW: ' + state.url);

    this._statesService.clearStateUntilRoute(
      window.location.pathname,
      state.url
    );

    // If states have been cleaned up and it still exists, it means it has been saved on purpose, don't create anew
    if (!this._statesService.getDoesStoreExistForRoute(state.url)) {
      this._statesService.initRoute(state.url);
    }

    return true;
  }
}
