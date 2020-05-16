import { NgxStateStackModule } from 'ngx-state-stack';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirstComponent } from './first/first.component';
import { SecondComponent } from './second/second.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ThirdComponent } from './third/third.component';

@NgModule({
  declarations: [
    AppComponent,
    FirstComponent,
    SecondComponent,
    BreadcrumbsComponent,
    ThirdComponent
  ],
  imports: [BrowserModule, AppRoutingModule, NgxStateStackModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
