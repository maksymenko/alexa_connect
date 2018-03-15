'use strict';
const Alexa = require('alexa-sdk');
var request = require('request-promise');

exports.handler = (event, context, callback) => {
  var alexa = Alexa.handler(event, context);
  alexa.appId = 'amzn1.ask.skill.f40f64c9-b78b-4353-8a93-950427a958a6';
  alexa.registerHandlers(handlers);
  alexa.execute();
};

const handlers = {
  'LaunchRequest': function () {
    this.emit('make');
  },
  'make': function () {
    var accessToken = this.event.session.user.accessToken;
    console.log('>>> token: ' + accessToken);

    const options = {
      url: 'https://www.googleapis.com/userinfo/v2/me',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      }
    };

    request(options).then(resp => {
      console.log('>>> resp: ' + resp);
      const userInfo = JSON.parse(resp);

      this.response.speak('Test message from Smart Nodes. Account linked to ' + userInfo.name);

      this.emit(':responseReady');
    }).catch(error => {
      console.log('>>> error: ' + JSON.stringify(error));
      this.emit(':responseReady');
    });
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
