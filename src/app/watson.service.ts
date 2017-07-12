import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { environment } from '../environments/environment';

@Injectable()
export class WatsonService {

  // URL das APIs - eh definida em environment.ts
  private URL_server: string = environment.apiURL;

  // variavel que armazena o contexto de uma conversa
  private context: Object;

  constructor(private http: Http) {
    this.context = {}; // inicializa o contexto
  }

  analiseNLU(texto: string) {

    return this.http.get(this.URL_server + '/api/empresa/' + texto)
      .map(res => res.json());

  }
    
}
