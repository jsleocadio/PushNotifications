import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  protected headers = new HttpHeaders()
  .set('Accept', 'application/json');
  protected url = 'http://localhost:3000/notification/device';

  registrationToken = "cvqXy1Cn_r564FbS45HUdW:APA91bGlNtaYMTLSGzkKyOHHyD6TwuKvvK7X3VrlPcMsTVB0EMBoysB7pJov6Oz0nszdbhJeCP4m1JoRyZk21hzXTZQsrYIiJ0zYwEVirMA7NLKTEZBpyvAtyU66FbdTxzKA_Qva3s5-";

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
