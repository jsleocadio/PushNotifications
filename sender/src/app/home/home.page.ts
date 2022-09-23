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
