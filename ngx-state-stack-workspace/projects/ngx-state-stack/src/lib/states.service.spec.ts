import { TestBed, inject } from '@angular/core/testing';
import { StatesService } from './states.service';
import { AppState } from './app-state.interface';

class TestAppState implements AppState {
  routePath: string;
  stateObj: { stateProp: string };

  cache(route: string, ...params: any[]): void {
    this.routePath = route;
    this.stateObj = params[0];
  }
}

describe('StatesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatesService]
    });
  });

  it('should be created', inject([StatesService], (service: StatesService) => {
    expect(service).toBeTruthy();
  }));

  it('should throw an error, if same route is initialized twice', () => {
    const routePath = '/my/route';

    const service: StatesService = TestBed.inject(StatesService);
    service.initRoute(routePath);

    expect(() => {
      service.initRoute(routePath);
    }).toThrowError();
  });

  it('should throw an error if tried to restore a state which was not initialized', () => {
    const routePath = '/my/route';

    const service: StatesService = TestBed.inject(StatesService);

    expect(() => {
      service.restore(routePath);
    }).toThrowError();
  });

  it('should return a state after is has been initialized', () => {
    const routePath = '/my/route';
    const state = { routePath: routePath } as AppState;

    const service: StatesService = TestBed.inject(StatesService);
    service.initRoute(routePath);

    service.cache(state);

    expect(service.restore(routePath).routePath).toEqual(routePath);
  });

  it('should clear the initialized state, if the new state is below the current state', () => {
    const routePath = '/my/route';
    const state = { routePath: routePath } as AppState;

    const service: StatesService = TestBed.inject(StatesService);
    service.initRoute(routePath);

    service.cache(state);

    service.clearStateUntilRoute(routePath, '/');

    expect(() => service.restore(routePath)).toThrow(
      new Error(
        '[StatesService] - State not found. Please check if you have set up the StateGuard correctly.'
      )
    );
  });

  it('should clear the initialized state, if the new state is at the same level the current state, but has a different root path', () => {
    const routePath = '/my/route';
    const state = { routePath: routePath } as AppState;

    const service: StatesService = TestBed.inject(StatesService);
    service.initRoute(routePath);

    service.cache(state);

    service.clearStateUntilRoute(routePath, '/other/route');

    expect(() => service.restore(routePath)).toThrow(
      new Error(
        '[StatesService] - State not found. Please check if you have set up the StateGuard correctly.'
      )
    );
  });

  it('should prevail the first state, if the new state is above the current state, but a lower one than before', () => {
    const routePathOne = '/one';
    const routePathTwo = routePathOne + '/two';
    const routePathThree = routePathTwo + '/three';

    const stateOne = { routePath: routePathOne } as AppState;
    const stateTwo = { routePath: routePathTwo } as AppState;
    const stateThree = {
      routePath: routePathThree
    } as AppState;

    const service: StatesService = TestBed.inject(StatesService);

    service.initRoute(routePathOne);
    service.cache(stateOne);

    service.initRoute(routePathTwo);
    service.cache(stateTwo);

    service.initRoute(routePathThree);
    service.cache(stateThree);

    service.clearStateUntilRoute(routePathThree, routePathTwo);

    expect(service.stateStackSize).toBe(2);

    expect(service.restore(routePathOne).routePath).toEqual(routePathOne);
    expect(service.restore(routePathTwo).routePath).toEqual(routePathTwo);
    expect(() => service.restore(routePathThree)).toThrow(
      new Error(
        '[StatesService] - State not found. Please check if you have set up the StateGuard correctly.'
      )
    );
  });

  it('should prevail the first state, if the new state is on the same level as the old state and above the current state', () => {
    const routePathOne = '/one';
    const routePathTwo = '/one/childOne';
    const routePathThree = '/one/childTwo';

    const stateOne = { routePath: routePathOne } as AppState;

    const service: StatesService = TestBed.inject(StatesService);

    service.initRoute(routePathOne);
    service.cache(stateOne);

    service.initRoute(routePathTwo);

    service.clearStateUntilRoute(routePathTwo, routePathThree);

    service.initRoute(routePathThree);

    expect(service.stateStackSize).toBe(2);

    const expectedError = new Error(
      '[StatesService] - State not found. Please check if you have set up the StateGuard correctly.'
    );

    expect(service.restore(routePathOne).routePath).toBe(routePathOne);
    expect(() => service.restore(routePathTwo).routePath).toThrow(
      expectedError
    );
    expect(service.restore(routePathThree).routePath).toBe(routePathThree);
  });

  it('should create a new state, when navigated back and to again', () => {
    const routePathOne = '/one';
    const routePathTwo = routePathOne + '/two';

    const stateOne = { routePath: routePathOne } as AppState;

    const stateTwoFirst = {
      routePath: routePathTwo,
      stateObj: { stateProp: 'Lorem' }
    } as TestAppState;

    const stateTwoSecond = {
      routePath: routePathTwo
    } as TestAppState;

    const service: StatesService = TestBed.inject(StatesService);

    service.initRoute(routePathOne);
    service.cache(stateOne);

    service.initRoute(routePathTwo);
    service.cache(stateTwoFirst);

    service.clearStateUntilRoute(routePathTwo, routePathOne);

    service.initRoute(routePathTwo);
    service.cache(stateTwoSecond);

    expect(
      (<TestAppState>service.restore(routePathTwo)).stateObj
    ).toBeUndefined();
  });

  it('should prevail the initialized state, if the new state equals the current state', () => {
    const routePath = '/my/route';
    const state = { routePath: routePath } as AppState;

    const service: StatesService = TestBed.inject(StatesService);
    service.initRoute(routePath);

    service.cache(state);

    service.clearStateUntilRoute(routePath, routePath);

    expect(service.restore(routePath).routePath).toEqual(routePath);
  });

  it('should prevail the initialized state, if the new state is above the current state', () => {
    const routePath = '/my/route';
    const state = { routePath: routePath } as AppState;

    const service: StatesService = TestBed.inject(StatesService);
    service.initRoute(routePath);

    service.cache(state);

    service.clearStateUntilRoute(routePath, routePath + '/next');

    expect(service.restore(routePath).routePath).toEqual(routePath);
  });
});
