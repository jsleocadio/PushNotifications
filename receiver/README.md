# Receiving messages

# Creating Ionic project

Create a new ionic project with **ionic start** command.

```
ionic start receiver blank --type=angular --capacitor --package-id=com.message.get
```

New project will be created under **receiver** directory. Move to **receiver** directory.

```
cd receiver/
```

Install **AngularFire** library for your project

```
ng add @angular/fire
```

Choose **Cloud Messaging** from the list like below:

![image](https://user-images.githubusercontent.com/73944895/192631340-c5d6af71-bc6f-47ae-93c3-c630607d4f67.png)

Create a new file **manifest.json** in **src** directory where **index.html** file exist. Put the **Sender ID** that is copied from **Cloud Messaging** tab.

```
{
    "gcm_sender_id": "Sender ID"
}
```

link **manifest.json** in the **index.html** file.

```
<head>
    .
    .
    .
    <link rel="manifest" href="./manifest.json">
</head>
```

To detect new messages from firebase, even if app is closed, our app needs a service worker. Create a new file **firebase-messaging-sw.js** in **src** directory where **index.html** file exist.

```
importScripts("https://www.gstatic.com/firebasejs/<Firebase version from package-lock.json>/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/<Firebase version from package-lock.json>/firebase-messaging-compat.js");
firebase.initializeApp({
 apiKey: "config data from environment",
 authDomain: "config data from environment",
 databaseURL: "config data from environment",
 projectId: "config data from environment",
 storageBucket: "config data environment",
 messagingSenderId: "config data from environment",
 appId: "config data from environment",
 measurementId: "config data from environment"
});
const messaging = firebase.messaging();
```

If **AngularFire**'s installation was well succeded, all config data from your Firebase project will be at `src/environments/environment.ts`.

Now we need to add those file in **angular.json** file.

```
"assets": [
    .
    .
    .
    "src/firebase-messaging-sw.js", // add new
    "src/manifest.json" // add new
]
```

Update **Environment files**. Add a additional field **vapidKey** which we got by clicking **Generate key pair** on **Cloud Messaging tab**.

```
export const environment = {
  firebase: {
    projectId: 'config data from your project',
    appId: 'config data from your project',
    databaseURL: 'config data from your project',
    storageBucket: 'config data from your project',
    locationId: 'config data from your project',
    apiKey: 'config data from your project',
    authDomain: 'config data from your project',
    messagingSenderId: 'config data from your project',
    measurementId: 'config data from your project',
    vapidKey: 'generated key from Cloud Messaging tab'
  },
  production: false
};
```

Update **home.page.ts** file.

```
import { Component, OnInit } from '@angular/core';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  message: any = null;

  constructor(private afm: Messaging) {}

  ngOnInit(): void {
      this.requestPermission();
      this.listen();
  }

  requestPermission() {
    getToken(this.afm, { vapidKey: environment.firebase.vapidKey })
      .then(
        (currentToken) => {
          if (currentToken) {
            console.log(currentToken);
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
```

Update **app.component.html** file

```
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Minhas mensagens
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <div *ngIf="message">
    <h1>{{ message.notification.title }}</h1>
    <h2>{{ message.notification.body }}</h2>
  </div>
  <div *ngIf="!message">
    Nenhuma mensagem chegou!
  </div>
</ion-content>
```

Our project is ready finally.

Now run the project with this command:

```
ionic serve
```
