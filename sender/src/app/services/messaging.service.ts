import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  protected headers = new HttpHeaders()
  .set('Accept', 'application/json');
  protected url = 'http://localhost:3000/notification/device';

  registrationToken = " ";

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
