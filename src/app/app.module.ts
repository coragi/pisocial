import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MensagemComponent } from './mensagem/mensagem.component';
import { WatsonService } from './watson.service';
import { DashboardComponent } from './dashboard/dashboard.component';

// Define the routes
// a principio, qq rota envia para o componente AppComponent
// Por simplicidade, retirei o router
const ROUTES = [
  {
    path: 'app',
    component: MensagemComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MensagemComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES) // Add routes to the app
  ],
  providers: [WatsonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
