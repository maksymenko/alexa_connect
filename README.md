## Starter guide to create Alexa skill

### Create custom skill
* Navigate `https://developer.amazon.com/home.html > ALEXA > Get Started > Create Skill`
* Select `Custom` skill
* Enter name: `Message Manager`
* Click: `Create skill`

* Create `Invocation`  - phrase users say to begin interation with skill. For custom skill only.
  * `Intents` - represents action
  * `Slot` -  argument

### Add AWS lambda endpoint
* create lambda `https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions`
  * create role for lambda from template `Simple Microservice permissions`
  * click `Create`
* Add trigger : `Alexa Skills Kit`

## Link Alexa Skill and AWS lambda
* Copy skill ID `amzn1.ask.skill.xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx` to labbda function trigger.
* Copy ARN from AWS lambda and pasete to Alexa Skill `AWS Lambda ARN`

### Account Linking
* Enable account linking
* Get `Authentication provider` details `https://console.developers.google.com` > `Credentials`
  * `Create Credentians` > `OAuth Client ID` > `Web application`
  * Add authorised redirect urls from Alexa skill `Account linking` page.
  * `Create`  and copy client ID and client secret to Alexa skill 'Account linking` page.
  * `Download JSON` with connection details and put parameters on Alexa skill page.
* Configure `Alexa skill`
  * Choose: `Auth Code Grant`
  * Scope: `openid`
  * past: token URI  and Auth URI from downloaded configuration file.

### Launch Skill in Beta testing mode
* To test if Account linking works 
  * click `Launch` > `Save and Continue` > `Save and Continue`
  * copy invitation link or invite by mail.

### Add Implementation
* Create NodeJS project 
* Implement required functionality see `index.js` as sample.
* Package all sources and dependencies (node_modules) into single zip file and deploy application to AWS lambda.



----
### Resources
* https://developer.amazon.com/docs/custom-skills/link-an-alexa-user-with-a-user-in-your-system.html 
  * sample * sample https://github.com/patrick-michelberger/hitch/blob/master/src/skill.js
* events: https://developer.amazon.com/docs/smarthome/send-events-to-the-alexa-event-gateway.html
* custom skill: https://developer.amazon.com/docs/custom-skills/understanding-custom-skills.html
  * https://developer.amazon.com/docs/custom-skills/steps-to-build-a-custom-skill.html
* https://developer.amazon.com/docs/smarthome/steps-to-build-a-smart-home-skill.html 
* CLI https://developer.amazon.com/docs/smapi/ask-cli-intro.html
