require('dotenv').config()
import request from 'request'
import VARIABLE from '../../constant/variable'
import IMAGE from '../../constant/image'

const { PAGE_ACCESS_TOKEN } = process.env

const {
    imageUrlStarted,
    imageMainMenu,
    imageBadgeRestaurant,
    imageHourOpen,
    imageAppetizer,
    imageDeepFish,
    imageKingCrab,
    imageAlaskaLobster,
    imageBeefsteak,
    imageChickenNoway,
    imageFireMeat,
    imageMainDishes,
    imageDesserts,
    imageAppetizer2,
    imageAppetizer1,
    imageAppetizer3,
    imageAppetizer4,
    imageDesserts1,
    imageDesserts2,
    imageDesserts3,
    imageDesserts4,
    imageDesserts5,
    imageRoomVjp,
    imageRoomNormal
} = IMAGE

const callSendAPI = async (sender_psid, response) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    await sendMarkon(sender_psid)
    await sendTypeOn(sender_psid)


    // Send the HTTP request to the Messenger Platform
    await request({
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

const sendTypeOn = (sender_psid) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "typing_on"
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": `https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('typing on ...!')
        } else {
            console.error("Unable to send typeing on:" + err);
        }
    });
}

const sendMarkon = (sender_psid) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "mark_seen"
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": `https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('mark on ...!')
        } else {
            console.error("Unable to send mark on:" + err);
        }
    });
}

let getUserName = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        // Send the HTTP request to the Messenger Platform
        request({
            "uri": `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
            "method": "GET"
        }, (err, res, body) => {
            if (!err) {
                //response tra ve trong body
                body = JSON.parse(body)
                const username = `${body.last_name} ${body.first_name}`
                resolve(username)
            } else {
                console.error("Unable to send message:" + err);
                reject(err)
            }
        });
    });
}

let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUserName(sender_psid);
            let resName = { "text": `Ch??o m???ng ${username} ?????n v???i nh?? h??ng c???a Augsutus Flynn!.` };
            //send text
            await callSendAPI(sender_psid, resName)
            //send generate template
            let resCarosel = await getStartedTemplate()
            await callSendAPI(sender_psid, resCarosel);
            resolve("done")
        } catch (e) {
            reject(e);
        }
    })
}

let getStartedTemplate = () => {
    let res = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": `Nh?? h??ng k??nh ch??o qu?? kh??ch!`,
                        "image_url": imageUrlStarted,
                        "subtitle": "D?????i ????y l?? c???nh quan t???i nh?? h??ng.",
                        "default_action": {
                            "type": "web_url",
                            "url": imageUrlStarted,
                            "webview_height_ratio": "tall",
                        },
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "MENU CH??NH",
                                "payload": VARIABLE.MAIN_MENU
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "?????t b??n",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                            {
                                "type": "postback",
                                "title": "H?????NG D???N S??? D???NG",
                                "payload": VARIABLE.GUID_TO_USE
                            },
                        ]
                    }
                ]
            }
        }

    }

    return res;
}

let handleShowMainMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resCarosel = await getMainMenuTemplate()
            await callSendAPI(sender_psid, resCarosel);
            resolve("done")
        } catch (e) {
            reject(e);
        }
    })
}

let getMainMenuTemplate = () => {
    let res = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": `Menu c???a nh?? h??ng!`,
                        "image_url": imageMainMenu,
                        "subtitle": "Ch??ng t??i h??n h???nh ph???c v??? qu?? kh??ch v???i th???c ????n phong ph?? cho b???a tr??a v?? b???a t???i.",
                        "default_action": {
                            "type": "web_url",
                            "url": imageMainMenu,
                            "webview_height_ratio": "tall",
                        },
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "B???A TR??A",
                                "payload": VARIABLE.LUNCH_MENU
                            },
                            {
                                "type": "postback",
                                "title": "B???A T???I",
                                "payload": VARIABLE.DINNER_MENU
                            },
                        ]
                    },
                    {
                        "title": `Gi??? m??? c???a!`,
                        "image_url": imageHourOpen,
                        "subtitle": "T2-T6 10:00 A.M - 11:00 P.M | T7 01:00 P.M - 10 P.M | CN 05:00 P.M - 09:00 P.M",
                        "default_action": {
                            "type": "web_url",
                            "url": imageHourOpen,
                            "webview_height_ratio": "tall",
                        },
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "?????t b??n",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                        ]
                    },
                    {
                        "title": `Kh??ng gian nh?? h??ng!`,
                        "image_url": imageBadgeRestaurant,
                        "subtitle": "Nh?? h??ng c?? th??? ph???c v??? l??n ?????n 300 kh??ch h??ng v?? t????ng t??? t???i ti???c Cocktail.",
                        "default_action": {
                            "type": "web_url",
                            "url": imageBadgeRestaurant,
                            "webview_height_ratio": "tall",
                        },
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "CHI TI???T",
                                "payload": VARIABLE.VIEW_DETAIL
                            },
                        ]
                    }
                ]
            }
        }

    }

    return res;
}

let handleSendLunchMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resCarosel = await getLunchMenuTemplate()
            await callSendAPI(sender_psid, resCarosel);
            resolve("done")
        } catch (e) {
            reject(e);
        }
    })
}

let getLunchMenuTemplate = () => {
    let res = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": `M??n khai v???`,
                        "image_url": imageAppetizer,
                        "subtitle": "Nh?? h??ng c?? nhi???u m??n khai v??? h???p d???n.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TI???T",
                                "payload": VARIABLE.VIEW_APPETIZER_LUCH
                            },
                        ]
                    },
                    {
                        "title": `M??n ch??nh`,
                        "image_url": imageMainDishes,
                        "subtitle": "Nh?? h??ng c?? ??a d???ng m??n ??n t??? m???i mi???n.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TI???T",
                                "payload": VARIABLE.VIEW_MAIN_DISHES_LUNCH
                            },
                        ]
                    },
                    {
                        "title": `M??n tr??ng mi???ng`,
                        "image_url": imageDesserts,
                        "subtitle": "M??n tr??ng mi???ng ??a d???ng, nhi???u m??u s???c, h???p d???n, ph?? h???p v???i m???i ng?????i.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TI???T",
                                "payload": VARIABLE.VIEW_DESSERTS_LUNCH
                            },
                        ]
                    },
                    {
                        "title": `Quay tr??? l???i`,
                        "image_url": imageBadgeRestaurant,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "QUAY TR??? L???I",
                                "payload": VARIABLE.GO_BACK_MAIN
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "?????t b??n",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            }
                        ]
                    }
                ]
            }
        }
    }

    return res;
}

let handleSendDetailLunchMainDishes = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resCarosel = await getLunchMainDishesTemplate()
            await callSendAPI(sender_psid, resCarosel);
            resolve("done")
        } catch (e) {
            reject(e);
        }
    })
}

let getLunchMainDishesTemplate = () => {
    let res = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": `C?? chi??n`,
                        "image_url": imageDeepFish,
                        "subtitle": "G???m nhi???u lo???i c??, ??a d???ng, phong ph??. Gi?? 149K - 449K t??y lo???i.",

                    },
                    {
                        "title": `Cua ho??ng ?????`,
                        "image_url": imageKingCrab,
                        "subtitle": "Cua ho??ng ????? ???????c nh???p kh???u. Ch??t l?????ng tuy???t v???i. Gi?? 1.999K - 3.999K.",

                    },
                    {
                        "title": `T??m h??m Alaska`,
                        "image_url": imageAlaskaLobster,
                        "subtitle": "T??m h??m Alaska ???????c nh???p kh???u. Ch??t l?????ng tuy???t v???i. Gi?? 649K - 3.499K.",

                    },
                    {
                        "title": `Beefsteak`,
                        "image_url": imageBeefsteak,
                        "subtitle": "Th???t b?? ???????c nh???p kh???u. Ch??t l?????ng tuy???t v???i. Gi?? ch??? t??? 199K.",

                    },
                    {
                        "title": `G?? kh??ng l???i tho??t`,
                        "image_url": imageChickenNoway,
                        "subtitle": "G?? ???????c ch??m nu??i c???n th???n, ch???c th???t, b??o ngon. Gi?? t??? 199k / 1 con t??y lo???i.",

                    },
                    {
                        "title": `Th???t hun kh??i`,
                        "image_url": imageFireMeat,
                        "subtitle": `Th???t hun kh??i mi???n n??i ch???t l?????ng, ??a d???ng lo??i. Gi?? 139k - 249k`,

                    },
                    {
                        "title": `Quay tr??? l???i Menu`,
                        "image_url": imageBadgeRestaurant,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "QUAY TR??? L???I",
                                "payload": VARIABLE.GO_BACK_LUNCH_MENU
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "?????t b??n",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                            {
                                "type": "postback",
                                "title": "THO??T",
                                "payload": VARIABLE.GO_BACK_MAIN
                            },
                        ]
                    }
                ]
            }
        }

    }

    return res;
}

let handleSendDetailLunchAppetizers = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resCarosel = await getLunchAppetizersTemplate()
            await callSendAPI(sender_psid, resCarosel);
            resolve("done")
        } catch (e) {
            reject(e);
        }
    })
}

let getLunchAppetizersTemplate = () => {
    let res = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": `G??i 1`,
                        "image_url": imageAppetizer1,
                        "subtitle": "B?? cu???n x???, ch???o t??m, m???c chi??n gi??n. G??a 369K.",

                    },
                    {
                        "title": `G??i 2`,
                        "image_url": imageAppetizer2,
                        "subtitle": "G???i b?? h???m c???i, ch??? gi?? h???i s???n, t??m l??n c???m. Gi?? 379K.",

                    },
                    {
                        "title": `G??i 3`,
                        "image_url": imageAppetizer3,
                        "subtitle": "G???i c??? h??? d???a, m???c chi??n gi??n, c?? l??t chi??n c???m. Gi?? 469K.",

                    },
                    {
                        "title": `C??n r???t nhi???u c??c g??i kh??c`,
                        "image_url": imageAppetizer4,
                        "subtitle": "Hy v???ng qu?? kh??ch s??? gh?? qua nh?? h??ng d??ng b???a.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "QUAY TR??? L???I",
                                "payload": VARIABLE.GO_BACK_LUNCH_MENU
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "?????t b??n",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                            {
                                "type": "postback",
                                "title": "THO??T",
                                "payload": VARIABLE.GO_BACK_MAIN
                            },
                        ]
                    },
                ]
            }
        }

    }

    return res;
}

let handleSendDetailLunchDesserts = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resCarosel = await getLunchDessertsTemplate()
            await callSendAPI(sender_psid, resCarosel);
            resolve("done")
        } catch (e) {
            reject(e);
        }
    })
}

let getLunchDessertsTemplate = () => {
    let res = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": `Kem matcha`,
                        "image_url": imageDesserts1,
                        "subtitle": "Kem matcha c?? xu???t s??? kh???u. Mi???n ph??.",

                    },
                    {
                        "title": `Kem c???u v???ng`,
                        "subtitle": "Kem c???u v???ng v???i nhi???u h????ng v???. Mi???n ph??",
                        "image_url": imageDesserts2,

                    },
                    {
                        "title": `Chocolate v?? coffee`,
                        "subtitle": "Ph?? h???p v???i c??c c??nh m??y r??u. Mi???n ph??",
                        "image_url": imageDesserts3,

                    },
                    {
                        "title": `Th???ch siro c??c lo???i`,
                        "subtitle": "M??n tr??ng mi???ng nhi???u l???a ch???n nh???t t???i Nh?? h??ng. Gi?? 49K.",
                        "image_url": imageDesserts4,
                    },
                    {
                        "title": `C??n r???t nhi???u m??n kh??c`,
                        "image_url": imageDesserts5,
                        "subtitle": `Ngo??i ra c??n r???t nhi???u m??n th?? v???, h???p d???n.`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "QUAY TR??? L???I",
                                "payload": VARIABLE.GO_BACK_LUNCH_MENU
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "?????t b??n",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                            {
                                "type": "postback",
                                "title": "THO??T",
                                "payload": VARIABLE.GO_BACK_MAIN
                            },
                        ]
                    },
                ]
            }
        }

    }

    return res;
}

//=========================
let handleSendDinnerMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resCarosel = await getDinnerMenuTemplate()
            await callSendAPI(sender_psid, resCarosel);
            resolve("done")
        } catch (e) {
            reject(e);
        }
    })
}

let getDinnerMenuTemplate = () => {
    let res = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": `M??n khai v???`,
                        "image_url": imageAppetizer,
                        "subtitle": "Nh?? h??ng c?? nhi???u m??n khai v??? h???p d???n.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TI???T",
                                "payload": VARIABLE.VIEW_APPETIZER_DINNER
                            },
                        ]
                    },
                    {
                        "title": `M??n ch??nh`,
                        "image_url": imageMainDishes,
                        "subtitle": "Nh?? h??ng c?? ??a d???ng m??n ??n t??? m???i mi???n.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TI???T",
                                "payload": VARIABLE.VIEW_MAIN_DISHES_DINNER
                            },
                        ]
                    },
                    {
                        "title": `M??n tr??ng mi???ng`,
                        "image_url": imageDesserts,
                        "subtitle": "M??n tr??ng mi???ng ??a d???ng, nhi???u m??u s???c, h???p d???n, ph?? h???p v???i m???i ng?????i.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TI???T",
                                "payload": VARIABLE.VIEW_DESSERTS_DINNER
                            },
                        ]
                    },
                    {
                        "title": `Quay tr??? l???i`,
                        "image_url": imageBadgeRestaurant,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "QUAY TR??? L???I",
                                "payload": VARIABLE.GO_BACK_MAIN
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "?????t b??n",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            }
                        ]
                    }
                ]
            }
        }
    }

    return res;
}

let handleSendDetailDinnerMainDishes = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resCarosel = await getDinnerMainDishesTemplate()
            await callSendAPI(sender_psid, resCarosel);
            resolve("done")
        } catch (e) {
            reject(e);
        }
    })
}

let getDinnerMainDishesTemplate = () => {
    let res = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": `C?? chi??n`,
                        "image_url": imageDeepFish,
                        "subtitle": "G???m nhi???u lo???i c??, ??a d???ng, phong ph??. Gi?? 149K - 449K t??y lo???i.",

                    },
                    {
                        "title": `Cua ho??ng ?????`,
                        "image_url": imageKingCrab,
                        "subtitle": "Cua ho??ng ????? ???????c nh???p kh???u. Ch??t l?????ng tuy???t v???i. Gi?? 1.999K - 3.999K.",

                    },
                    {
                        "title": `T??m h??m Alaska`,
                        "image_url": imageAlaskaLobster,
                        "subtitle": "T??m h??m Alaska ???????c nh???p kh???u. Ch??t l?????ng tuy???t v???i. Gi?? 649K - 3.499K.",

                    },
                    {
                        "title": `Beefsteak`,
                        "image_url": imageBeefsteak,
                        "subtitle": "Th???t b?? ???????c nh???p kh???u. Ch??t l?????ng tuy???t v???i. Gi?? ch??? t??? 199K.",

                    },
                    {
                        "title": `G?? kh??ng l???i tho??t`,
                        "image_url": imageChickenNoway,
                        "subtitle": "G?? ???????c ch??m nu??i c???n th???n, ch???c th???t, b??o ngon. Gi?? t??? 199k / 1 con t??y lo???i.",

                    },
                    {
                        "title": `Th???t hun kh??i`,
                        "image_url": imageFireMeat,
                        "subtitle": `Th???t hun kh??i mi???n n??i ch???t l?????ng, ??a d???ng lo??i. Gi?? 139k - 249k`,

                    },
                    {
                        "title": `Quay tr??? l???i Menu`,
                        "image_url": imageBadgeRestaurant,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "QUAY TR??? L???I",
                                "payload": VARIABLE.GO_BACK_DINNER_MENU
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "?????t b??n",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                            {
                                "type": "postback",
                                "title": "THO??T",
                                "payload": VARIABLE.GO_BACK_MAIN
                            },
                        ]
                    }
                ]
            }
        }

    }

    return res;
}

let handleSendDetailDinnerAppetizers = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resCarosel = await getDinnerAppetizersTemplate()
            await callSendAPI(sender_psid, resCarosel);
            resolve("done")
        } catch (e) {
            reject(e);
        }
    })
}

let getDinnerAppetizersTemplate = () => {
    let res = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": `G??i 1`,
                        "image_url": imageAppetizer1,
                        "subtitle": "B?? cu???n x???, ch???o t??m, m???c chi??n gi??n. G??a 369K.",

                    },
                    {
                        "title": `G??i 2`,
                        "image_url": imageAppetizer2,
                        "subtitle": "G???i b?? h???m c???i, ch??? gi?? h???i s???n, t??m l??n c???m. Gi?? 379K.",

                    },
                    {
                        "title": `G??i 3`,
                        "image_url": imageAppetizer3,
                        "subtitle": "G???i c??? h??? d???a, m???c chi??n gi??n, c?? l??t chi??n c???m. Gi?? 469K.",

                    },
                    {
                        "title": `C??n r???t nhi???u c??c g??i kh??c`,
                        "image_url": imageAppetizer4,
                        "subtitle": "Hy v???ng qu?? kh??ch s??? gh?? qua nh?? h??ng d??ng b???a.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "QUAY TR??? L???I",
                                "payload": VARIABLE.GO_BACK_DINNER_MENU
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "?????t b??n",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                            {
                                "type": "postback",
                                "title": "THO??T",
                                "payload": VARIABLE.GO_BACK_MAIN
                            },
                        ]
                    },
                ]
            }
        }

    }

    return res;
}

let handleSendDetailDinnerDesserts = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resCarosel = await getDinnerDessertsTemplate()
            await callSendAPI(sender_psid, resCarosel);
            resolve("done")
        } catch (e) {
            reject(e);
        }
    })
}

let getDinnerDessertsTemplate = () => {
    let res = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": `Kem matcha`,
                        "image_url": imageDesserts1,
                        "subtitle": "Kem matcha c?? xu???t s??? kh???u. Mi???n ph??",

                    },
                    {
                        "title": `Kem c???u v???ng`,
                        "image_url": imageDesserts2,
                        "subtitle": "Kem c???u v???ng v???i nhi???u h????ng v???. Mi???n ph??",
                    },
                    {
                        "title": `Chocolate v?? coffee`,
                        "image_url": imageDesserts3,
                        "subtitle": "Ph?? h???p v???i c??c c??nh m??y r??u. Mi???n ph??",
                    },
                    {
                        "title": `Th???ch siro c??c lo???i`,
                        "image_url": imageDesserts4,
                        "subtitle": "M??n tr??ng mi???ng nhi???u l???a ch???n nh???t t???i Nh?? h??ng. Gi?? 49K.",

                    },
                    {
                        "title": `C??n r???t nhi???u m??n kh??c`,
                        "image_url": imageDesserts5,
                        "subtitle": `Ngo??i ra c??n r???t nhi???u m??n th?? v???, h???p d???n.`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "QUAY TR??? L???I",
                                "payload": VARIABLE.GO_BACK_DINNER_MENU
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "?????t b??n",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                            {
                                "type": "postback",
                                "title": "THO??T",
                                "payload": VARIABLE.GO_BACK_MAIN
                            },
                        ]
                    }
                ]
            }
        }

    }

    return res;
}


//==============
let getImageTemplateRoom = () => {
    let res = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": `Khu v???c h???ng sang`,
                        "image_url": imageRoomVjp,
                        "subtitle": "Thi???t k??? ?????c ????o, kh??ng gian sang tr???ng.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TI???T",
                                "payload": VARIABLE.VIEW_DETAIL_ROOMVJP
                            },
                            {
                                "type": "postback",
                                "title": "QUAY TR??? L???I",
                                "payload": VARIABLE.GO_BACK_MAIN
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "?????t b??n",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                        ]
                    },
                    {
                        "title": `Khu v???c b??nh d??n`,
                        "image_url": imageRoomNormal,
                        "subtitle": "Thi???t k??? tho??ng m??t, kh??ng gian d??? ch???u.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TI???T",
                                "payload": VARIABLE.VIEW_DETAIL_ROOM
                            },
                            {
                                "type": "postback",
                                "title": "QUAY TR??? L???I",
                                "payload": VARIABLE.GO_BACK_MAIN
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "?????t b??n",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                        ]
                    },
                ]
            }
        }

    }

    return res;
}

let handleShowDetailRoom = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resCarosel = await getImageTemplateRoom()
            await callSendAPI(sender_psid, resCarosel);
            resolve("done")
        } catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    handleGetStarted,
    handleShowMainMenu,
    handleSendLunchMenu,
    handleSendDinnerMenu,
    handleSendDetailLunchMainDishes,
    handleSendDetailLunchAppetizers,
    handleSendDetailLunchDesserts,
    handleSendDetailDinnerDesserts,
    handleSendDetailDinnerAppetizers,
    handleSendDetailDinnerMainDishes,
    handleShowDetailRoom,
    callSendAPI,
    getUserName
}
