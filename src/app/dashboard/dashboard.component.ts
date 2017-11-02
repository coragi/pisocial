import { Component, OnInit } from '@angular/core';
import { WatsonService } from '../watson.service';
import { Observable } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private interval: number;
  abertura: number;
  escrupulosidade: number;
  extroversao: number;
  amabilidade: number;
  faixa_emocional: number;
  n_desafio: number;
  n_curiosidade: number;
  v_mudancas: number;
  v_autocrescimento: number;
  qtde: number;

  constructor(private watsonService: WatsonService) {
    this.interval = 1000;
    this.abertura = 0;
    this.qtde = 0;
  }

  ngOnInit() {
    TimerObservable.create(0, this.interval)
      .subscribe(() => {
        this.watsonService.updateDashboard()
          .subscribe((data) => {
            console.log(data);
            this.abertura = Math.ceil(data.abertura * 100);
            this.escrupulosidade = Math.ceil(data.escrupulosidade * 100);
            this.extroversao = Math.ceil(data.extroversao * 100);
            this.amabilidade = Math.ceil(data.amabilidade * 100);
            this.faixa_emocional = Math.ceil(data.faixa_emocional * 100);
            this.n_desafio = Math.ceil(data.n_desafio * 100);
            this.n_curiosidade = Math.ceil(data.n_curiosidade * 100);
            this.v_mudancas = Math.ceil(data.v_mudancas * 100);
            this.v_autocrescimento = Math.ceil(data.v_autocrescimento * 100);
            this.qtde = data.qtde;
          });
      });
  }

  resetDashboard() {
    this.watsonService.resetDashboard().
      subscribe((data) => {
        console.log(data);
      });
  }
}
