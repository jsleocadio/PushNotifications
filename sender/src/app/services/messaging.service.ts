import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  protected headers = new HttpHeaders()
  .set('Accept', 'application/json');
  protected url = 'http://localhost:3000/notification/device';

  registrationToken = "cvqXy1Cn_r564FbS45HUdW:APA91bGQTwT04QkYdhGBeljgIYXv17OJRIDGbPx3iryIu0tuTpCE2V28WyC6MhwnksykxHpTd3evF5IBgRLsas3TCWMp9vo1bnoffA2VEnPUdK80c3f3EOqHmoYb5_gFccYOiap_k6la";

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
