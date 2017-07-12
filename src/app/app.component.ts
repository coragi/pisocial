import { Component, EventEmitter, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Mensagem } from './mensagem/mensagem.model';
import { WatsonService } from './watson.service';
import { Observable } from 'rxjs';

//importa as variaveis de ambiente
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewChecked {
  //referencia ao div das mensagens
  @ViewChild('myMensagens') myScrollContainer: ElementRef;
  //vetor de mensagens que aparece na tela
  mensagens: Mensagem[];

  constructor(private watsonService: WatsonService) {
    this.mensagens = [];
    let x = new Mensagem('', '<h3><span class="label label-primary">Entre com o nome da sua empresa para que eu avalie o nível de digitalidade!</span><h3>');
    this.mensagens.push(x);
  }
  //apos cada atualizacao da view, manda o scroll pra ultima msg
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  // metodo para fazer a ultima mensagem ficar visivel  
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  enviaMensagem(msg_usuario): void {
    //cria mensagem
    let m = new Mensagem(msg_usuario.value);

    //envia mensagem para a tela
    this.mensagens.push(m);

    //limpa o campo de mensagem
    msg_usuario.value = '';

    this.watsonService.analiseNLU(m.msg_usuario)
      .subscribe(
      (result_nlu: any) => {
        console.log('nlu response:', result_nlu);
        let sentimento: string = 'Não encontrei!';
        let score_digital: number = 0;
        let palavra_chave: string = '';

        if (result_nlu) {
          if (result_nlu.sentiment) {
            if (Number(result_nlu.sentiment.document.score) > 0) {
              sentimento = 'Positivo ' + Math.round(Number(result_nlu.sentiment.document.score) * 100) + '%';
            } else {
              sentimento = 'Negativo ' + Math.round(Number(result_nlu.sentiment.document.score) * 100) + '%';
            }
            score_digital = Math.round((Number(result_nlu.sentiment.targets[0].score) + 1) * 50);
          }
          palavra_chave = result_nlu.keywords[0].text;
        }
        m.msg_watson = '<b>Sentimento:</b> ' + sentimento + '<br><br><b>Palavra-chave: </b>'
          + palavra_chave + '<br><br><b>Nível de Digitalidade: </b>' + score_digital;
      }
      );
  }
}
