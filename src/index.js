'use strict';
const Alexa = require('alexa-sdk');
var request = require('request-promise');
var sync_request = require('sync-request');
var firebase = require('firebase');
var admin = require('firebase-admin');
const config = require('./firebase_config.json');
const serviceAccount = require('./service_account.json');
const async = require('async');

exports.handler = (event, context, callback) => {
  console.log('>>> event: ' + JSON.stringify(event));
  context.callbackWaitsForEmptyEventLoop = true;
  var alexa = Alexa.handler(event, context);
  alexa.appId = 'amzn1.ask.skill.5cfe4962-049f-4061-8176-3cb50878f279';
  alexa.registerHandlers(handlers);
  alexa.execute();
};


const handlers = {
  'LaunchRequest': function () {
    this.emit('sensor');
  },
  'sensor': function () {
    var accessToken = this.event.session.user.accessToken;
    console.log('>>> token: ' + accessToken);

    console.log('>>> this.event.session.user: ' + JSON.stringify(this.event.session.user));

    var options = {
      url: 'https://www.googleapis.com/userinfo/v2/me',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      }
    };

    // request(options).then(resp => {
    //   var userInfo = resp;
    //   console.log('>>> userInfo: ' + JSON.stringify(userInfo));

    //   this.emit(':responseReady');
    // }).catch(error => {
    //   console.log('>>>1 error: ' + JSON.stringify(error));
    //   this.emit(':responseReady');
    // });


    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: config.firebase.databaseURL
    });

    admin.auth().verifyIdToken(accessToken).then(resp => {
      var user = resp;
      console.log('>>> user: ' + JSON.stringify(user));

      this.response.speak('Test message from Hocamee. new Account linked to ' + user.name);

      this.emit(':responseReady');
    }).catch(error => {
      console.log('>>> error: ' + JSON.stringify(error));
      this.emit(':responseReady');
    });



    var app = firebase.initializeApp({
      credential: admin.credential.refreshToken(accessToken),
      databaseURL: config.firebase.databaseURL
    });
    var firebaseDatabase = app.database();
    console.log('>>> firebaseDatabase: ' + firebaseDatabase);

    var res = sync_request('GET', 'https://www.googleapis.com/userinfo/v2/me', {
      headers: {
        'Authorization': 'Bearer ' + this.event.session.user.accessToken,
      },
    });
    console.log('>>>> sync body:  ' + res.getBody())
    if (res.getBody()) {
      var profile = JSON.parse(res.getBody());

      console.log('>>>> profile name:  ' + profile.name)

      this.response.speak('Test message from Hocamee. Account linked to ' + profile.name);
    } else {
      this.response.speak('Test message from Hocamee. Link your Hocamee account to Alexa to access your sensors.');
    }
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = 'This is the Hello World Sample Skill. ';
    const reprompt = 'Say hello, to hear me speak.';

    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function () {
    this.response.speak('Goodbye!');
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function () {
    this.response.speak('See you later!');
    this.emit(':responseReady');
  }
};
