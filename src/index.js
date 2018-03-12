'use strict';
const Alexa = require('alexa-sdk');
var request = require('request');
var sync_request = require('sync-request');

exports.handler = (event, context, callback) => {
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
    console.log('>>> token: ' + this.event.session.user.accessToken);

    var options = {
      url: 'https://www.googleapis.com/userinfo/v2/me',
      headers: {
        'Authorization': 'Bearer ' + this.event.session.user.accessToken,
      }
    };

    function callback(error, response, body) {
      console.log('>> resp code: ' + response.statusCode);
      console.log('>> error: ' + error);
      if (!error && response.statusCode == 200) {
        console.log('>>> body:  ' + body);
        console.log('>>> JSON body:  ' + JSON.stringify(body));
        var info = JSON.parse(body);
        console.log('>>> JSON info:  ' + JSON.stringify(info));
      }
    }
    console.log('>>> ask profile')
    request(options, callback).on('error', function (err) {
      console.log(err)
    });

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



    this.emit(':responseReady');
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
