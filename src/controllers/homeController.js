require('dotenv').config();
const request = require('request');
import chatbotService from '../services/chatbotService'
import VARIABLE from '../../constant/variable';
import { GoogleSpreadsheet } from 'google-spreadsheet'
import moment from 'moment'

const { PAGE_ACCESS_TOKEN } = process.env

let getHomePage = async (req, res) => {
    return res.render('homePage.ejs')
}

let postWebHook = (req, res) => {
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}

let getWebHook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}

// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;

    // Checks if the message contains text
    if (received_message.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
        }
    } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
    }

    // Send the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    switch (payload) {
        case 'yes':
            response = { "text": "Thanks!" };
            break;
        case 'no':
            response = { "text": "Oops, try sending another image." };
            break;

        case VARIABLE.RESTART_BOT:
        case VARIABLE.GET_STARTED:
            await chatbotService.handleGetStarted(sender_psid)
            break;
        case VARIABLE.GO_BACK_MAIN:
        case VARIABLE.MAIN_MENU:
            await chatbotService.handleShowMainMenu(sender_psid)
            break;
        case VARIABLE.GUID_TO_USE:
            await chatbotService.handleGetStarted(sender_psid)
            break;
        case VARIABLE.GO_BACK_LUNCH_MENU:
        case VARIABLE.LUNCH_MENU:
            await chatbotService.handleSendLunchMenu(sender_psid)
            break;
        case VARIABLE.GO_BACK_DINNER_MENU:
        case VARIABLE.DINNER_MENU:
            await chatbotService.handleSendDinnerMenu(sender_psid)
            break;
        case VARIABLE.VIEW_MAIN_DISHES_LUNCH:
            await chatbotService.handleSendDetailLunchMainDishes(sender_psid)
            break;
        case VARIABLE.VIEW_APPETIZER_LUCH:
            await chatbotService.handleSendDetailLunchAppetizers(sender_psid)
            break;
        case VARIABLE.VIEW_DESSERTS_LUNCH:
            await chatbotService.handleSendDetailLunchDesserts(sender_psid)
            break;
        case VARIABLE.VIEW_MAIN_DISHES_DINNER:
            await chatbotService.handleSendDetailDinnerMainDishes(sender_psid)
            break;
        case VARIABLE.VIEW_APPETIZER_DINNER:
            await chatbotService.handleSendDetailDinnerAppetizers(sender_psid)
            break;
        case VARIABLE.VIEW_DESSERTS_DINNER:
            await chatbotService.handleSendDetailDinnerDesserts(sender_psid)
            break;
        case VARIABLE.VIEW_DETAIL:
            await chatbotService.handleShowDetailRoom(sender_psid)
            break;
        default:
            response = { "text": `Oops! I don't know response of postback ${payload}.` };
            break;
    }

    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v9.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

let setupProfile = async (req, res) => {
    //call fb api
    // Construct the message body
    let request_body = {
        "get_started": {
            "payload": VARIABLE.GET_STARTED
        },
        "whitelisted_domains": ["https://augustus-flynn-chatbot.herokuapp.com/"]
    }

    // Send the HTTP request to the Messenger Platform
    await request({
        "uri": `https://graph.facebook.com/v11.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log("Body", body)
        if (!err) {
            console.log('setup user profile succeed!!')
        } else {
            console.error("Unable to setup user's profile:" + err);
        }
    });

    return res.send("Setup user's profile succeed!");
}

let setupPersistentMenu = async (req, res) => {
    let request_body = {
        "persistent_menu": [
            {
                "locale": "default",
                "composer_input_disabled": false,
                "call_to_actions": [
                    {
                        "type": "web_url",
                        "title": "Trang chủ Nhà hàng",
                        "url": "https://www.facebook.com/huytung.novers",
                        "webview_height_ratio": "full"
                    },
                    {
                        "type": "web_url",
                        "title": "My facebook",
                        "url": "https://www.facebook.com/huytung.novers",
                        "webview_height_ratio": "full"
                    },
                    {
                        "type": "postback",
                        "title": "Khởi động lại bot",
                        "payload": VARIABLE.RESTART_BOT
                    }
                ]
            }
        ]
    }

    await request({
        "uri": `https://graph.facebook.com/v11.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log("Body", body)
        if (!err) {
            console.log('setup persistent menu succeed!!')
        } else {
            console.error("Unable to setup user's profile:" + err);
        }
    });

    return res.send("Setup user's profile succeed!");
}


let handleRevervation = (req, res) => {
    return res.render('reserveTable.ejs');
}

let handlePostReserveTable = async (req, res) => {
    try {
        let getNameFromFacebook = await chatbotService.getUserName(req.body.psid)


        //write data to google sheet
        const data = {
            username: getNameFromFacebook,
            customerName: req.body.customerName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email
        }
        await writeOnGoogleSheet(data)

        let customerName = ""
        if (req.body.customerName === "") {
            customerName = getNameFromFacebook
        } else {
            customerName = req.body.customerName
        }

        let response1 = {
            "text": `--Thông tin đặt bàn--
            \nHọ và tên: ${customerName}
            \nĐịa chỉ email: ${req.body.email}
            \nSố điện thoại: ${req.body.phoneNumber}`
        }


        await chatbotService.callSendAPI(req.body.psid, response1)

        return res.status(200).json({
            message: 'ok'
        })
    } catch (e) {
        console.log("ERRORRRRR", e)
        return res.status(500).json({
            message: "err"
        })
    }
}

let writeOnGoogleSheet = async (data) => {
    try {
        const { username, phoneNumber, email, customerName } = data
        let currentDate = new Date();

        const format = "HH:mm DD/MM/YYYY"

        let formatedDate = moment(currentDate).format(format);

        // Initialize the sheet - doc ID is the long id in the sheets URL
        const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

        // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
        await doc.useServiceAccountAuth({
            client_email: JSON.parse(`"${process.env.CLIENT_EMAIL}"`),
            private_key: JSON.parse(`"${process.env.PRIVATE_KEY}"`),
        });

        await doc.loadInfo(); // loads document properties and worksheets

        const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

        // append rows
        await sheet.addRow(
            {
                "Tên Facebook": username,
                "Email": email,
                "Số điện thoại": `'${phoneNumber}`,
                "Thời gian": formatedDate,
                "Tên khách hàng": customerName
            });


    }
    catch (e) {
        console.log("SEND EMAIL ERROR:  ", e)
    }
}

module.exports = {
    getHomePage,
    postWebHook,
    getWebHook,
    setupProfile,
    setupPersistentMenu,
    handleRevervation,
    handlePostReserveTable,
    writeOnGoogleSheet
}