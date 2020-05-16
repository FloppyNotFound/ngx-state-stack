import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirstComponent } from './first/first.component';
import { SecondComponent } from './second/second.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'first',
    pathMatch: 'full'
  },
  {
    path: 'first',
    component: FirstComponent,
    pathMatch: 'full'
  },
  {
    path: 'first/second',
    component: SecondComponent,
    pathMatch: 'full'
  },
  {
    path: 'first/second/first',
    component: FirstComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
