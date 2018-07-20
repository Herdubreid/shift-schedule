import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { EffectsService, reducer, metaReducers } from './store';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ControlComponent } from './control/control.component';
import { SiteDetailComponent } from './site-detail/site-detail.component';
import { ShiftDetailComponent } from './shift-detail/shift-detail.component';
import { SerieDetailComponent } from './serie-detail/serie-detail.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ControlComponent,
    SiteDetailComponent,
    ShiftDetailComponent,
    SerieDetailComponent,
    EditComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule,
    StoreModule.forRoot(reducer, { metaReducers }),
    EffectsModule.forRoot([EffectsService]),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  entryComponents: [
    SiteDetailComponent,
    ShiftDetailComponent,
    SerieDetailComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-AU' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
