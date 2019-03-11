// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');

const LOAD_SCHEDULE_USER_MESSAGE = 'load schedule';
class MyBot {
    /**
     *
     * @param {TurnContext} on turn context object.
     */
    async onTurn(turnContext) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            const userMessage = turnContext.activity.text;
            console.log(userMessage);
            if (userMessage.toLowerCase().indexOf(LOAD_SCHEDULE_USER_MESSAGE) !== -1) {
                return await turnContext.sendActivity('Please upload your classes schedule.');
            }


            await turnContext.sendActivity(`You said '${ turnContext.activity.text }'`);
        } else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
    }
}

module.exports.MyBot = MyBot;
