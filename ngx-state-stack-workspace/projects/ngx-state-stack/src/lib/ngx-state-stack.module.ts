import { NgModule, ModuleWithProviders } from '@angular/core';
import { StatesService } from './states.service';
import { StateGuard } from './state.guard';

@NgModule()
export class NgxStateStackModule {
  static forRoot(): ModuleWithProviders<NgxStateStackModule> {
    return {
      ngModule: NgxStateStackModule,
      providers: [StatesService, StateGuard]
    };
  }
}
