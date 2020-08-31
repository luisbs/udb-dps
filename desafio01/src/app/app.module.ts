import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { AddClientComponent } from './add-client/add-client.component';
import { AddRegistroComponent } from './add-registro/add-registro.component';
import { ListClientesComponent } from './list-clientes/list-clientes.component';

@NgModule({
  declarations: [
    AppComponent,
    AddClientComponent,
    AddRegistroComponent,
    ListClientesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
