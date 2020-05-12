import { Injectable } from '@angular/core';
import { AppState } from './app-state.interface';

@Injectable()
export class StatesService {
  private _states: AppState[] = [];

  private _duplicateRouteInitError =
    '[StatesService] - Route can only be once added to state: ';
  private _stateNotDefinedError =
    '[StatesService] - State not found. Please check if you have set up the StateGuard correctly.';

  get stateStackSize(): number {
    return this._states?.length ?? 0;
  }

  initRoute(route: string): void {
    if (this._states.findIndex(s => s.routePath === route) >= 0) {
      throw new Error(this._duplicateRouteInitError + route);
    }

    this._states.push({ routePath: route } as AppState);
  }

  cache(state: AppState): void {
    const existingStateIndex = this._states.indexOf(
      this._states.find(s => s.routePath === state.routePath)
    );

    // Check if state has been initialized
    // Should never throw, if StateGuard has been set correctly
    if (existingStateIndex < 0) {
      throw new Error(this._stateNotDefinedError);
    }

    // Add new state to state stack
    this._states[existingStateIndex] = state;
  }

  getDoesStoreExistForRoute(route: string): boolean {
    return !!this._states.find(s => s.routePath === route);
  }

  restore(route: string): AppState {
    const state = this._states.find(s => s.routePath === route);

    if (!state) {
      throw new Error(this._stateNotDefinedError);
    }

    return state;
  }

  clearStateUntilRoute(currentRoutePath: string, newRoutePath: string): void {
    const stateReversed = [...this._states].reverse();
    const isForwardNavigation =
      newRoutePath.split('/').length > currentRoutePath.split('/').length;

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
      return states;
    }

    // Forward navigation - do not clean up
    if (
      newRoutePath.split('/').length > states[0].routePath.split('/').length &&
      isForwardNavigation
    ) {
      return states;
    }

    // Reached current route - stop cleaning up
    if (
      newRoutePath.split('/').length ===
        states[0].routePath.split('/').length &&
      !isForwardNavigation
    ) {
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
      states.splice(0, 1);
      return this.clearStateUntilRouteInternal(
        states,
        newRoutePath,
        isForwardNavigation
      );
    }

    // Remove state from stack
    states.splice(0, 1);

    // Start cleaning up next state in hierarchy
    return this.clearStateUntilRouteInternal(
      states,
      newRoutePath,
      isForwardNavigation
    );
  }
}
