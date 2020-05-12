import { Injectable } from '@angular/core';
import { AppState } from './app-state.interface';

@Injectable()
export class StatesService {
  readonly stackId: string;

  private _states: AppState[] = [];

  private _duplicateRouteInitError =
    '[StatesService] - Route can only be once added to state: ';
  private _stateNotDefinedError =
    '[StatesService] - State not found. Please check if you have set up the StateGuard correctly.';

  get stateStackSize(): number {
    return this._states?.length ?? 0;
  }

  constructor() {
    this.stackId = this.createUuid();
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

    // Reset service props and remove state from stack
    Object.keys(states[0]).forEach(propKey => {
      if (states[0][propKey]?.stackId === this.stackId) {
        // Prevent deletion of stack
        return;
      }
      states[0][propKey] = null;
    });
    states.splice(0, 1);

    // Start cleaning up next state in hierarchy
    return this.clearStateUntilRouteInternal(
      states,
      newRoutePath,
      isForwardNavigation
    );
  }

  private createUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
      c
    ) {
      const r = (Math.random() * 16) | 0;
      const v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
