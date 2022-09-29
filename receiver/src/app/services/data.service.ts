import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Token {
  id?: string;
  token: string
  timeStamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private fs: Firestore) { }

  getToken(): Observable<Token[]> {
    const tokensRef = collection(this.fs, 'tokens');
    return collectionData(tokensRef, { idField: 'id'}) as Observable<Token[]>;
  }

  addToken(token: Token) {
    const tokensRef = collection(this.fs, 'tokens');
    return addDoc(tokensRef, token);
  }
}

