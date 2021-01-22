// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    TurnContext,
    MessageFactory,
    TeamsActivityHandler,
    CardFactory,
    ActionTypes
} = require('botbuilder');

class BotActivityHandler extends TeamsActivityHandler {
    globalData = "";
    constructor() {
        super();
    }

    async handleTeamsTaskModuleFetch(context, action) {
        console.log(action.commandId);
        let fetchTemplate = {
            "task": {
                "type": "continue",
                "value": {
                    "title": "Custom Form",
                    "height": 510,
                    "width": 430,
                    "url": "https://medxnote.com/"
                },
            },
        };
        return fetchTemplate;
    }

   async handleTeamsMessagingExtensionSubmitAction(context, action) {
        switch (action.commandId) {
            case 'AddTask':
                this.globalData = action.data;
                return createCardCommand(context, action);
            case 'mssageAction':
                this.globalData = action.data;
                return createCardCommand(context, action);
            default:
                throw new Error('NotImplemented');
        }
    }
    async handleTeamsMessagingExtensionQuery(context, query) {
        const axios = require('axios');
        const querystring = require('querystring');

        const searchQuery = query.parameters[0].value;
        const response = await axios.get(`http://registry.npmjs.com/-/v1/search?${ querystring.stringify({ text: searchQuery, size: 8 }) }`);
        // console.log(response.data.objects);

        const attachments = [];

        response.data.objects.forEach(obj => {
            const heroCard = CardFactory.o365ConnectorCard({
                title: obj.package.name,
                text: obj.package.version,
                summary: obj.package.description,
                "themeColor": "#E67A9E",
                "sections": [
                    {
                        "title": `**Notes:** ${obj.package.description}`,
                        "text": `**Created Date:** ${obj.package.date}`
                    }
                ]
            });
            attachments.push({ ...heroCard });
        });

        return {
            composeExtension: {
                type: 'result',
                attachmentLayout: 'list',
                attachments: attachments
            }
        };
    }

    async handleTeamsMessagingExtensionSelectItem(context, obj) {
        
        return {
            composeExtension: {
                type: 'result',
                attachmentLayout: 'list',
                attachments: [CardFactory.thumbnailCard(obj.description)]
            }
        };
    }

    async handleTeamsMessagingExtensionFetchTask(context, action, event) {
        if (action.commandId === "AddTask") {
            return {
                "task": {
                    "type": "continue",
                    "title": 'Task Module Fetch Example',
                    "value": {
                        "height":370,
                        "width":500,
                        "card": {
                            "contentType": "application/vnd.microsoft.card.adaptive",
                            "content": {
                                "body": [
                                    {
                                        "type": "TextBlock",
                                        "text": "Route Name",
                                        "size": "Medium",
                                        "weight": "Bolder",
                                        "spacing": "Large"
                                    },
                                    {
                                        "type": "Input.ChoiceSet",
                                        "spacing": "small",
                                        "placeholder": "",
                                        id: "routeId",
                                        "choices": [
                                            {
                                                "title": "## Route 1",
                                                "value": "Choice 1"
                                            },
                                            {
                                                "title": "## Route 2",
                                                "value": "Choice 2"
                                            }
                                        ] 
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "Title",
                                        "size": "Medium",
                                        "weight": "Bolder",
                                        "spacing": "Large"
                                    },
                                    {
                                        "type": "Input.Text",
                                        id: "title",
                                        "placeholder": "Please include a useful title. Don't send blank task!",
                                        "spacing": "small"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "Notes",
                                        "size": "Medium",
                                        "weight": "Bolder",
                                        "spacing": "Large"
                                    },
                                    {
                                        "type": "Input.Text",
                                        "style": "text",
                                        "isMultiline": true,
                                        id: "Notes",
                                        "placeholder": "Please include a pertinent notes. Don't send blank notes!",
                                        "spacing": "small"
                                    }
                                ],
                                "actions": [
                                    {
                                      "type": "Action.Submit",
                                      "title": "Submit",
                                    }
                                  ],
                                "type": "AdaptiveCard",
                                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                                "version": "1.3"
                            }
                        }
                    }
                }
            }
        } else if(action.commandId === 'Action') {
            const messageText = action.messagePayload.body.content;
        }
    }
}



// /* Messaging Extension - Action */
// function createCardCommand(context, action) {
//     const data = action.data;
//     const card = CardFactory.adaptiveCard({
//         version: '1.0',
//         $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
//         type: 'AdaptiveCard',
//         body: [
//             {
//                 type: 'TextBlock',
//                 text: data.routeId
//             },
//             {
//                 type: 'TextBlock',
//                 text: data.title
//             },
//             {
//                 type: 'TextBlock',
//                 text: data.Notes
//             }
//         ]
//     });
//     return {
//         "composeExtension": {
//             type: 'result',
//             attachmentLayout: 'list',
//             attachments: [
//                 card
//             ]
//         }
//     };
// }

// function createCardCommand(context, action) {
//     // The user has chosen to create a card by choosing the 'Create Card' context menu command.
//     const data = action.data;
//     const heroCard = CardFactory.heroCard(data.title, data.text);
//     heroCard.content.subtitle = data.subTitle;
//     const attachment = { contentType: heroCard.contentType, content: heroCard.content, preview: heroCard };

//     return {
//         composeExtension: {
//             type: 'result',
//             attachmentLayout: 'list',
//             attachments: [
//                 attachment
//             ]
//         }
//     };
// }

module.exports.BotActivityHandler = BotActivityHandler;

