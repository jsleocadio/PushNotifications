import { Component, OnInit } from '@angular/core';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { environment } from 'src/environments/environment';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  message: any = null;

  constructor(private afm: Messaging, private ts: TokenService) {}

  ngOnInit(): void {
      this.requestPermission();
      this.listen();
  }

  requestPermission() {
    getToken(this.afm, { vapidKey: environment.firebase.vapidKey })
      .then(
        (currentToken) => {
          if (currentToken) {
            this.ts.tokenRegistration(currentToken)
            .subscribe(
              (res) => {
                console.log(res); 
              }, (error) => {
                console.log("Requisição falhou!", error);
              }
            )
          } else {
            console.log('Não há token disponível. Solicite a geração!.');
          }
        })
        .catch((err) => {
          console.log('Um erro ocorreu ao resgatar a token. ', err);
        });
  }

  listen() {
    onMessage(this.afm, (payload) => {
      console.log('Mensagem enviada. ', payload);
      this.message = payload;
    });
  }

}
