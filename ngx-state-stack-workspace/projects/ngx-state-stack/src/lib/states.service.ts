import { Injectable } from '@angular/core';
import { AppState } from './app-state.interface';

@Injectable()
export class StatesService {
  private _states: AppState[] = [];

  duplicateRouteInitError =
    '[StatesService] - Route can only be once added to state: ';

  stateNotDefinedError = '[StatesService] - state not found';

  initRoute(route: string): void {
    if (this._states.findIndex(s => s.routePath === route) >= 0) {
      throw new Error(this.duplicateRouteInitError + route);
    }

    console.log('Initialized state for ' + route);

    this._states.push({ routePath: route } as AppState);
  }

  cache(state: AppState): void {
    const existingStateIndex = this._states.indexOf(
      this._states.find(s => s.routePath === state.routePath)
    );

    if (existingStateIndex < 0) {
      throw new Error(this.stateNotDefinedError);
    }

    this._states[existingStateIndex] = state;
    console.log('Cached state for ' + state.routePath);
  }

  getDoesStoreExistForRoute(route: string): boolean {
    return this._states.find(s => s.routePath === route) !== void 0;
  }

  restore(route: string): AppState {
    const state = this._states.find(s => s.routePath === route);

    if (!state) {
      throw new Error(this.stateNotDefinedError);
    }

    return state;
  }

  clearStateUntilRoute(currentRoutePath: string, newRoutePath: string): void {
    const stateReversed = [...this._states].reverse();
    const isForwardNavigation =
      newRoutePath.split('/').length > currentRoutePath.split('/').length;

    console.log('-----');
    stateReversed.forEach(s => console.log(s.routePath));
    console.log('-----');

    this._states = [
      ...this.clearStateUntilRouteInternal(
        stateReversed,
        newRoutePath,
        isForwardNavigation
      )
    ].reverse();
  }

  private clearStateUntilRouteInternal(
    states: AppState[],
    newRoutePath: string,
    isForwardNavigation: boolean
  ): AppState[] {
    if (!states || !states.length) {
      console.log('END OF CLEANUP');

      return states;
    }

    if (
      newRoutePath.split('/').length > states[0].routePath.split('/').length &&
      isForwardNavigation
    ) {
      console.log('FW NAV - nothing to do');
      return states;
    }

    if (
      newRoutePath.split('/').length ===
        states[0].routePath.split('/').length &&
      !isForwardNavigation
    ) {
      console.log('BACK NAV AND TARGET REACHED');
      return states;
    }

    // Error handling - should never happen, if StateGuard is configered correctly
    if (!states[0].routePath) {
      throw new Error(
        'You have to provide the current route when calling saveState()!'
      );
    }

    // Check if there is a state which has been set
    if (!states[0].reset) {
      console.log(
        'There is no state set for route ' +
          states[0].routePath +
          '. Nothing to cleanup.'
      );

      states.splice(0, 1);
      return this.clearStateUntilRouteInternal(
        states,
        newRoutePath,
        isForwardNavigation
      );
    }

    console.log('Resetting state for ' + states[0].routePath);

    states[0].reset();
    states.splice(0, 1);
    return this.clearStateUntilRouteInternal(
      states,
      newRoutePath,
      isForwardNavigation
    );
  }
}
