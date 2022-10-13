# PushNotifications
Using Firebase Cloud Message to send Push Notifications and Web Pushs

So, you are developing a mobile application, and you realize you need a way to communicate to your users in a quick, cost-efficient way. At this point, I’m sure you have thought about push notifications. That’s where Firebase Cloud Messaging (FCM) comes in.

Firebase Cloud Messaging (FCM) provides a reliable and battery-efficient connection between your server and devices that allows you to deliver and receive messages and notifications on iOS, Android, and the web at no cost. You can read more about it [here](https://firebase.google.com/products/cloud-messaging/).

Now that we are done with the introduction, let's dive all in.

# Creating a Firebase Project 

First, you need to sign in with your Google account at [firebase](http://firebase.google.com/). Then click the ‘Go to console’ link right next to your account avatar and you will be redirected to the dashboard console where you can view all your projects.

Since at this point we don’t have any project, click ‘**create a project**’

![image](https://user-images.githubusercontent.com/73944895/191836551-4e8783c7-7224-433b-8598-e4e41b0fd0de.png)

Type the name of the project and agree to the terms and conditions, proceed through all the necessary steps and when done, the project will be created and you will be redirected to the dashboard.

***

So, now that we have a firebase account, lets try to understand how this will work.

First, firebase push notifications will need the following for it to function properly.

1. A configuration JSON file that can be downloaded from the console. This file contains the project details required by firebase for initialization and secure connection to firebase. We will see how to generate the file shortly.
2. A registration Token. Think about it for a second. If firebase needs to send a particular message to a particular device(in our case a particular mobile device), then we need to inform it to which device it should send. Thats where the registration token comes in. The registration token is generated from the mobile app and will be sent via API to our NodeJS backend from where we will send the actual notification. However, since in this tutorial we will not be focusing on creating the mobile application , follow this [link](https://www.androidauthority.com/android-push-notifications-with-firebase-cloud-messaging-925075/) to see how to create the mobile application and get the registration token for your device, which you can then send to the API for your device to get the notifications.
#### Configuration JSON file

To get this file, go to your console and on the menu you will see **‘Project Overview’**. Click the settings cog icon right next to it to reveal a sub menu with two menu items (Project Settings, Users and permissions).

![image](https://user-images.githubusercontent.com/73944895/191838159-a18e98d7-5a33-4504-94c2-3fa08ac3d821.png)

Click ‘**Project Settings**’ , then General. Scroll to the bottom to ‘**your apps**’ section. Click the android icon (since using the [tutorial link](https://www.androidauthority.com/android-push-notifications-with-firebase-cloud-messaging-925075/) i shared before you created a mobile app and generated the registration token). This will enable us to register the mobile application with firebase.

![image](https://user-images.githubusercontent.com/73944895/191838543-65205b6c-c413-40e7-9cfc-81657ca4b6b9.png)

To register the app, fill in all the required details and finish. Note that you can skip step 4 (running the app to verify installation) using the small link(skip this step). Also since you already added firebase in the mobile app you can skip steps 2 and 3.

Now that this is done, navigate to the tab ‘**Service account**’ . At the ‘**Firebase Admin SDK**’ section, click ‘**Generate new private key**’ button and confirm you want to download it. Our JSON file we needed will now be created and downloaded. Also in the code sample snippet given, copy the database url since we will need it in the next step.

![image](https://user-images.githubusercontent.com/73944895/191838711-6824af66-e985-4c84-8664-d97dd48825c1.png)
