# Iniciando o Web App Ionic

Usando o Servidor NodeJS para enviar Web Push e Push Notifications

Para este projeto, utilizamos o Ionic Framework.

Primeiro criamos um projeto no Ionic:
```
ionic start fcm_remetente blank --type=angular --capacitor --package-id=com.mensagem.send
```
Entendendo os comandos do Ionic CLI:

* <code>ionic start</code> é o comando para iniciar um projeto em Ionic.<br>
* <code>fcm_rementente</code> é o nome do projeto, pode ser iniciado da forma que desejar.<br>
* <code>blank</code> é como o projeto iniciará, eu escolhi um projeto em branco mas há templates 
para iniciar o projeto com as características que desejar.<br>
* <code>--type</code> é a linguagem/framework a ser utilizada no projeto, utilizarei o Angular mas
o Ionic aceita React, Vue e JS também.<br>
* <code>--capacitor</code> faz com que o projeto já instale a dependência do CapacitorJS e assim
possamos utilizar alguns plugins interessantes.<br>
* <code>--package-id</code> é o nome do arquivo que será passado pelo CapacitorJS para sistemas
iOS e Android.

# Adicionando módulos

Precisaremos de dois módulos em nossa aplicação essenciais para o envio das mensagens.

O primeiro é o <code>HttpClientModule</code> que deve ser adicionado no **src/app/app.module.ts**, 
que servirá para nossa requisição HTTP:

```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

O segundo é o <code>ReactiveFormsModule</code> que deve ser adicionado no **src/app/home/home.module.ts**, 
que servirá para envio dos dados preenchidos no formulário se transformem em nossa mensagem a ser enviada:

```
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
```

# Criando o serviço Messaging

Vamos utilizar de um serviço para enviar a mensagem e fazer a requisição com o servidor do **NodeJS**.

Para começarmos iremos dar o comando:

```
ionic g s services/messaging
```

Iremos modificá-lo para que fique assim:

```
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  protected headers = new HttpHeaders()
  .set('Accept', 'application/json');
  protected url = 'http://localhost:3000/notification/device';

  registrationToken = "<YOUR-REGISTRATION-TOKEN>";

  constructor(private http: HttpClient) { }

  sendMessage({ title, body }) {
    let data = {
      "registrationToken": this.registrationToken,
      "message": 
      {
        "notification": 
        {
          "title": title,
          "body": body,
        }
      }
    };
    return this.http.post(this.url, data, { headers: this.headers, responseType: 'text' });
  }
}
```

# Modificando a Página Home

Estamos quase no final, agora vamos modificar o **src/app/home/home.page.ts** e deixá-lo assim:

```
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagingService } from '../services/messaging.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  notification: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ms: MessagingService,) {}

  get title() {
    return this.notification.get('title');
  }

  get body() {
    return this.notification.get('body');
  }

  ngOnInit(): void {
      this.notification = this.fb.group({
        title: ['', [Validators.required]],
        body: ['', [Validators.required]],
      });
  }

  send() {
    this.ms.sendMessage(this.notification.value)
    .subscribe(
      (res) => {
        console.log('Mensagem Enviada!', res);
      }, (error) => {
        console.error('Requisição falhou!', error);
      }
    );
  }
}
```

Trabalharemos com o `FormGroup` neste modelo de formulário todos os dados já vem encapsulado, não precisando chamar cada um individualmente.

Adicionei os `Validators` para exigir que os campos estejam sempre com alguma informação.

Precisei também implementar o `ngOnInit` adicionando o `OnInit` na chamada da classe.

E o método `enviar()` fará a chamada ao serviço que criamos e resgatará a mensagem de resposta da requisição HTTP.

Com isso, só falta o **src/app/home/home.page.html**, que ficará assim: 

```
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Enviar Mensagens
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <form (ngSubmit)="send()" [formGroup]="notification">
    <ion-item fill="solid" class="ion-margin-bottom">
      <ion-label position="floating">Título da mensagem</ion-label>
      <ion-input type="text" formControlName="title"></ion-input>
      <ion-note slot="error" *ngIf="(title.dirty || title.touched) && title.errors">Título da mensagem requerido</ion-note>
    </ion-item>
    <ion-item fill="solid" class="ion-margin-bottom">
      <ion-label position="floating">Corpo da mensagem</ion-label>
      <ion-textarea type="text" formControlName="body" autoGrow="true"></ion-textarea>
      <ion-note slot="error" *ngIf="(body.dirty || body.touched) && body.errors">Corpo da mensagem requerido</ion-note>
    </ion-item>
    <ion-button type="submit" expand="block" [disabled]="!notification.value">Enviar mensagem</ion-button>
  </form>
</ion-content>
```

E está pronto!

Um front-end que acessa o servidor NodeJS com Firebase e enviar mensagem aos seus clientes.
