// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');

const LOAD_SCHEDULE_USER_MESSAGE = 'load schedule';

const WEEKDAYS = {
    SUNDAY: '0',
    MONDAY: '1',
    TUESDAY: '2',
    WEDNESDAY: '3',
    THURSDAY: '4',
    FRIDAY: '5',
    SATURDAY: '6'
};

class MyBot {
    constructor() {
        const unparsedSchedule = [{"code": "EM884 A", "hours": [{"day": "1", "room": "PB07", "ini": 8, "end": 10}, {"day": "3", "room": "PB04", "ini": 8, "end": 10}]}, {"code": "EM853 B", "hours": [{"day": "5", "room": "EM30", "ini": 8, "end": 10}]}, {"code": "EM607 R", "hours": [{"day": "2", "room": "CB17", "ini": 10, "end": 12}, {"day": "4", "room": "CB17", "ini": 10, "end": 12}]}, {"code": "CE304 A", "hours": [{"day": "1", "room": "CB17", "ini": 14, "end": 16}]}, {"code": "CE738 D", "hours": [{"day": "2", "room": "IE01", "ini": 14, "end": 16}, {"day": "4", "room": "IE01", "ini": 14, "end": 16}]}, {"code": "EM928 A", "hours": [{"day": "5", "room": "LM03", "ini": 14, "end": 18}]}, {"code": "EM503 A", "hours": [{"day": "2", "room": "CB03", "ini": 16, "end": 18}, {"day": "4", "room": "PB17", "ini": 16, "end": 18}]}, {"code": "EM670 R", "hours": [{"day": "2", "room": "EM20", "ini": 19, "end": 21}, {"day": "4", "room": "EM20", "ini": 19, "end": 21}]}];
        this.schedule = unparsedSchedule.map((s, i) => ({
            ...s,
            ableMisses: unparsedSchedule.length - i - 1
        }));
        console.log(this.schedule);
    }
    /**
     *
     * @param {TurnContext} on turn context object.
     */
    async onTurn(turnContext) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            const userMessage = turnContext.activity.text;

            if (userMessage.toLowerCase().indexOf('show my schedule') !== -1) {
                return await turnContext.sendActivity(JSON.stringify(this.schedule));
            }

            const [code, cls, weekday] = userMessage.split(' '); 
            const scheduleClass = this.schedule
                .filter(s => s.code === code + ' ' + cls)

            if (!scheduleClass) {
                return await turnContext.sendActivity('I could not find the class. Please try asking again!');
            }

            const numberOfClassesToMiss = scheduleClass.ableMisses - 1;
            if (numberOfClassesToMiss >= 0) {
                return await turnContext.sendActivity(
                    `Yes, you can miss ${scheduleClass.code}. ${
                        numberOfClassesToMiss === 0
                            ? 'But if you do, YOU WILL NOT BE ABLE TO MISS ANY MORE CLASSES! *sorry \'bout caps*'
                            : numberOfClassesToMiss > 2
                                ? `If you do, you will be able to miss ${numberOfClassesToMiss} more times.`
                                : `But be wise! You will only be able to miss ${numberOfClassesToMiss} more times.`
                    }`
                );
            } else {
                return await turnContext.sendActivity(
                    `No! If you miss ${scheduleClass.code},
                    you will step over the misses limit. I am sorry :(`
                );
            }
        } else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
    }
}

module.exports.MyBot = MyBot;
