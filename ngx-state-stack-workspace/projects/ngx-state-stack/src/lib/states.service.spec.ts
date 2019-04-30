import { TestBed, inject } from '@angular/core/testing';
import { StatesService } from './states.service';
import { AppState } from './app-state.interface';

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

    const service: StatesService = TestBed.get(StatesService);
    service.initRoute(routePath);

    expect(() => {
      service.initRoute(routePath);
    }).toThrow(Error);
  });

  it('should throw an error if tried to restore a state which was not initialized', () => {
    const routePath = '/my/route';

    const service: StatesService = TestBed.get(StatesService);

    expect(() => {
      service.restore(routePath);
    }).toThrow(Error);
  });

  it('should return a state after is has been initialized', () => {
    const routePath = '/my/route';
    const state = { routePath: routePath } as AppState;

    const service: StatesService = TestBed.get(StatesService);
    service.initRoute(routePath);

    service.cache(state);

    expect(service.restore(routePath).routePath).toEqual(routePath);
  });
});
