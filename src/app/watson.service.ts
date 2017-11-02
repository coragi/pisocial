import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { environment } from '../environments/environment';

@Injectable()
export class WatsonService {

  // URL das APIs - eh definida em environment.ts
  private URL_server: string = environment.apiURL;

  constructor(private http: Http) { }

  profilePI(texto: string) {
    return this.http.get(this.URL_server + '/api/usuario/' + texto)
      .map(res => res.json());
  }

  updateDashboard() {
    return this.http.get(this.URL_server + '/api/dashboard')
      .map(res => res.json());
  }

  resetDashboard() {
    return this.http.get(this.URL_server + '/api/reset')
      .map(res => res.json());
  }
}
