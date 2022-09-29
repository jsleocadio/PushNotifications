import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  protected header = new HttpHeaders()
  .set('Accept', 'application/json');
  protected url = 'http://localhost:3000/registration';

  constructor(private http: HttpClient) { }

  tokenRegistration(token: string) {
    let data = { "token": token };
    return this.http.post(this.url, data, { headers: this.header, responseType: "text" });
  }
}
