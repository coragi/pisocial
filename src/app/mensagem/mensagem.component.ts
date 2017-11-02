import { Component, EventEmitter } from '@angular/core';
import { WatsonService } from '../watson.service';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-mensagem',
  templateUrl: './mensagem.component.html',
  styleUrls: ['./mensagem.component.css']
})

export class MensagemComponent {

  clicked: boolean;
  abertura: number;
  escrupulosidade: number;
  extroversao: number;
  amabilidade: number;
  faixa_emocional: number;
  n_desafio: number;
  n_curiosidade: number;
  v_mudancas: number;
  v_autocrescimento: number;

  constructor(private watsonService: WatsonService) {
    this.clicked = true;
  }

  enviaMensagem(msg_usuario): void {
    this.clicked = false;
    console.log(msg_usuario.value);
    this.watsonService.profilePI(msg_usuario.value)
      .subscribe(
      (data: any) => {
        this.abertura = Math.ceil(data.personality[0].percentile * 100);
        this.escrupulosidade = Math.ceil(data.personality[1].percentile * 100);
        this.extroversao = Math.ceil(data.personality[2].percentile * 100);
        this.amabilidade = Math.ceil(data.personality[3].percentile * 100);
        this.faixa_emocional = Math.ceil(data.personality[4].percentile * 100);
        this.n_desafio = Math.ceil(data.needs[0].percentile * 100);
        this.n_curiosidade = Math.ceil(data.needs[2].percentile * 100);
        this.v_mudancas = Math.ceil(data.values[1].percentile * 100);
        this.v_autocrescimento = Math.ceil(data.values[3].percentile * 100);
      }
      );
  }
}
