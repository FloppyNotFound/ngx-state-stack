import { NgModule, ModuleWithProviders } from '@angular/core';
import { StatesService } from './states.service';
import { StateGuard } from './state.guard';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class NgxStateStackModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxStateStackModule,
      providers: [StatesService, StateGuard]
    };
  }
}
