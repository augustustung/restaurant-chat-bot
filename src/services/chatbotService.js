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
            let resName = { "text": `Chào mừng ${username} đến với nhà hàng của Augsutus Flynn!.` };
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
                        "title": `Nhà hàng kính chào quý khách!`,
                        "image_url": imageUrlStarted,
                        "subtitle": "Dưới đây là cảnh quan tại nhà hàng.",
                        "default_action": {
                            "type": "web_url",
                            "url": imageUrlStarted,
                            "webview_height_ratio": "tall",
                        },
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "MENU CHÍNH",
                                "payload": VARIABLE.MAIN_MENU
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "Đặt bàn",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                            {
                                "type": "postback",
                                "title": "HƯỚNG DẪN SỬ DỤNG",
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
                        "title": `Menu của nhà hàng!`,
                        "image_url": imageMainMenu,
                        "subtitle": "Chúng tôi hân hạnh phục vụ quý khách với thực đơn phong phú cho bữa trưa và bữa tối.",
                        "default_action": {
                            "type": "web_url",
                            "url": imageMainMenu,
                            "webview_height_ratio": "tall",
                        },
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "BỮA TRƯA",
                                "payload": VARIABLE.LUNCH_MENU
                            },
                            {
                                "type": "postback",
                                "title": "BỮA TỐI",
                                "payload": VARIABLE.DINNER_MENU
                            },
                        ]
                    },
                    {
                        "title": `Giờ mở cửa!`,
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
                                "title": "Đặt bàn",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                        ]
                    },
                    {
                        "title": `Không gian nhà hàng!`,
                        "image_url": imageBadgeRestaurant,
                        "subtitle": "Nhà hàng có thể phục vụ lên đến 300 khách hàng và tương tự tại tiệc Cocktail.",
                        "default_action": {
                            "type": "web_url",
                            "url": imageBadgeRestaurant,
                            "webview_height_ratio": "tall",
                        },
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "CHI TIẾT",
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
                        "title": `Món khai vị`,
                        "image_url": imageAppetizer,
                        "subtitle": "Nhà hàng có nhiều món khai vị hấp dẫn.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TIẾT",
                                "payload": VARIABLE.VIEW_APPETIZER_LUCH
                            },
                        ]
                    },
                    {
                        "title": `Món chính`,
                        "image_url": imageMainDishes,
                        "subtitle": "Nhà hàng có đa dạng món ăn từ mọi miền.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TIẾT",
                                "payload": VARIABLE.VIEW_MAIN_DISHES_LUNCH
                            },
                        ]
                    },
                    {
                        "title": `Món tráng miệng`,
                        "image_url": imageDesserts,
                        "subtitle": "Món tráng miệng đa dạng, nhiều màu sắc, hấp dẫn, phù hợp với mọi người.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TIẾT",
                                "payload": VARIABLE.VIEW_DESSERTS_LUNCH
                            },
                        ]
                    },
                    {
                        "title": `Quay trở lại`,
                        "image_url": imageBadgeRestaurant,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "QUAY TRỞ LẠI",
                                "payload": VARIABLE.GO_BACK_MAIN
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "Đặt bàn",
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
                        "title": `Cá chiên`,
                        "image_url": imageDeepFish,
                        "subtitle": "Gồm nhiều loại cá, đa dạng, phong phú. Giá 149K - 449K tùy loại.",

                    },
                    {
                        "title": `Cua hoàng đế`,
                        "image_url": imageKingCrab,
                        "subtitle": "Cua hoàng đế được nhập khẩu. Chât lượng tuyệt vời. Giá 1.999K - 3.999K.",

                    },
                    {
                        "title": `Tôm hùm Alaska`,
                        "image_url": imageAlaskaLobster,
                        "subtitle": "Tôm hùm Alaska được nhập khẩu. Chât lượng tuyệt vời. Giá 649K - 3.499K.",

                    },
                    {
                        "title": `Beefsteak`,
                        "image_url": imageBeefsteak,
                        "subtitle": "Thịt bò được nhập khẩu. Chât lượng tuyệt vời. Giá chỉ từ 199K.",

                    },
                    {
                        "title": `Gà không lối thoát`,
                        "image_url": imageChickenNoway,
                        "subtitle": "Gà được chăm nuôi cẩn thận, chắc thịt, béo ngon. Giá từ 199k / 1 con tùy loại.",

                    },
                    {
                        "title": `Thịt hun khói`,
                        "image_url": imageFireMeat,
                        "subtitle": `Thịt hun khói miền núi chất lượng, đa dạng loài. Giá 139k - 249k`,

                    },
                    {
                        "title": `Quay trở lại Menu`,
                        "image_url": imageBadgeRestaurant,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "QUAY TRỞ LẠI",
                                "payload": VARIABLE.GO_BACK_LUNCH_MENU
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "Đặt bàn",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                            {
                                "type": "postback",
                                "title": "THOÁT",
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
                        "title": `Gói 1`,
                        "image_url": imageAppetizer1,
                        "subtitle": "Bò cuộn xả, chạo tôm, mực chiên giòn. Gía 369K.",

                    },
                    {
                        "title": `Gói 2`,
                        "image_url": imageAppetizer2,
                        "subtitle": "Gỏi bò hầm cải, chả giò hải sản, tôm lăn cốm. Giá 379K.",

                    },
                    {
                        "title": `Gói 3`,
                        "image_url": imageAppetizer3,
                        "subtitle": "Gỏi củ hủ dừa, mực chiên giòn, cá lát chiên cốm. Giá 469K.",

                    },
                    {
                        "title": `Còn rất nhiều các gói khác`,
                        "image_url": imageAppetizer4,
                        "subtitle": "Hy vọng quý khách sẽ ghé qua nhà hàng dùng bữa.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "QUAY TRỞ LẠI",
                                "payload": VARIABLE.GO_BACK_LUNCH_MENU
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "Đặt bàn",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                            {
                                "type": "postback",
                                "title": "THOÁT",
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
                        "subtitle": "Kem matcha có xuất sứ khẩu. Miễn phí.",

                    },
                    {
                        "title": `Kem cầu vồng`,
                        "subtitle": "Kem cầu vồng với nhiều hương vị. Miễn phí",
                        "image_url": imageDesserts2,

                    },
                    {
                        "title": `Chocolate và coffee`,
                        "subtitle": "Phù hợp với các cành mày râu. Miễn phí",
                        "image_url": imageDesserts3,

                    },
                    {
                        "title": `Thạch siro các loại`,
                        "subtitle": "Món tráng miệng nhiều lựa chọn nhất tại Nhà hàng. Giá 49K.",
                        "image_url": imageDesserts4,
                    },
                    {
                        "title": `Còn rất nhiều món khác`,
                        "image_url": imageDesserts5,
                        "subtitle": `Ngoài ra còn rất nhiều món thú vị, hấp dẫn.`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "QUAY TRỞ LẠI",
                                "payload": VARIABLE.GO_BACK_LUNCH_MENU
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "Đặt bàn",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                            {
                                "type": "postback",
                                "title": "THOÁT",
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
                        "title": `Món khai vị`,
                        "image_url": imageAppetizer,
                        "subtitle": "Nhà hàng có nhiều món khai vị hấp dẫn.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TIẾT",
                                "payload": VARIABLE.VIEW_APPETIZER_DINNER
                            },
                        ]
                    },
                    {
                        "title": `Món chính`,
                        "image_url": imageMainDishes,
                        "subtitle": "Nhà hàng có đa dạng món ăn từ mọi miền.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TIẾT",
                                "payload": VARIABLE.VIEW_MAIN_DISHES_DINNER
                            },
                        ]
                    },
                    {
                        "title": `Món tráng miệng`,
                        "image_url": imageDesserts,
                        "subtitle": "Món tráng miệng đa dạng, nhiều màu sắc, hấp dẫn, phù hợp với mọi người.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TIẾT",
                                "payload": VARIABLE.VIEW_DESSERTS_DINNER
                            },
                        ]
                    },
                    {
                        "title": `Quay trở lại`,
                        "image_url": imageBadgeRestaurant,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "QUAY TRỞ LẠI",
                                "payload": VARIABLE.GO_BACK_MAIN
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "Đặt bàn",
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
                        "title": `Cá chiên`,
                        "image_url": imageDeepFish,
                        "subtitle": "Gồm nhiều loại cá, đa dạng, phong phú. Giá 149K - 449K tùy loại.",

                    },
                    {
                        "title": `Cua hoàng đế`,
                        "image_url": imageKingCrab,
                        "subtitle": "Cua hoàng đế được nhập khẩu. Chât lượng tuyệt vời. Giá 1.999K - 3.999K.",

                    },
                    {
                        "title": `Tôm hùm Alaska`,
                        "image_url": imageAlaskaLobster,
                        "subtitle": "Tôm hùm Alaska được nhập khẩu. Chât lượng tuyệt vời. Giá 649K - 3.499K.",

                    },
                    {
                        "title": `Beefsteak`,
                        "image_url": imageBeefsteak,
                        "subtitle": "Thịt bò được nhập khẩu. Chât lượng tuyệt vời. Giá chỉ từ 199K.",

                    },
                    {
                        "title": `Gà không lối thoát`,
                        "image_url": imageChickenNoway,
                        "subtitle": "Gà được chăm nuôi cẩn thận, chắc thịt, béo ngon. Giá từ 199k / 1 con tùy loại.",

                    },
                    {
                        "title": `Thịt hun khói`,
                        "image_url": imageFireMeat,
                        "subtitle": `Thịt hun khói miền núi chất lượng, đa dạng loài. Giá 139k - 249k`,

                    },
                    {
                        "title": `Quay trở lại Menu`,
                        "image_url": imageBadgeRestaurant,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "QUAY TRỞ LẠI",
                                "payload": VARIABLE.GO_BACK_DINNER_MENU
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "Đặt bàn",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                            {
                                "type": "postback",
                                "title": "THOÁT",
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
                        "title": `Gói 1`,
                        "image_url": imageAppetizer1,
                        "subtitle": "Bò cuộn xả, chạo tôm, mực chiên giòn. Gía 369K.",

                    },
                    {
                        "title": `Gói 2`,
                        "image_url": imageAppetizer2,
                        "subtitle": "Gỏi bò hầm cải, chả giò hải sản, tôm lăn cốm. Giá 379K.",

                    },
                    {
                        "title": `Gói 3`,
                        "image_url": imageAppetizer3,
                        "subtitle": "Gỏi củ hủ dừa, mực chiên giòn, cá lát chiên cốm. Giá 469K.",

                    },
                    {
                        "title": `Còn rất nhiều các gói khác`,
                        "image_url": imageAppetizer4,
                        "subtitle": "Hy vọng quý khách sẽ ghé qua nhà hàng dùng bữa.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "QUAY TRỞ LẠI",
                                "payload": VARIABLE.GO_BACK_DINNER_MENU
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "Đặt bàn",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                            {
                                "type": "postback",
                                "title": "THOÁT",
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
                        "subtitle": "Kem matcha có xuất sứ khẩu. Miễn phí",

                    },
                    {
                        "title": `Kem cầu vồng`,
                        "image_url": imageDesserts2,
                        "subtitle": "Kem cầu vồng với nhiều hương vị. Miễn phí",
                    },
                    {
                        "title": `Chocolate và coffee`,
                        "image_url": imageDesserts3,
                        "subtitle": "Phù hợp với các cành mày râu. Miễn phí",
                    },
                    {
                        "title": `Thạch siro các loại`,
                        "image_url": imageDesserts4,
                        "subtitle": "Món tráng miệng nhiều lựa chọn nhất tại Nhà hàng. Giá 49K.",

                    },
                    {
                        "title": `Còn rất nhiều món khác`,
                        "image_url": imageDesserts5,
                        "subtitle": `Ngoài ra còn rất nhiều món thú vị, hấp dẫn.`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "QUAY TRỞ LẠI",
                                "payload": VARIABLE.GO_BACK_DINNER_MENU
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "Đặt bàn",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                            {
                                "type": "postback",
                                "title": "THOÁT",
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
                        "title": `Khu vực hạng sang`,
                        "image_url": imageRoomVjp,
                        "subtitle": "Thiết kế độc đáo, không gian sang trọng.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TIẾT",
                                "payload": VARIABLE.VIEW_DETAIL_ROOMVJP
                            },
                            {
                                "type": "postback",
                                "title": "QUAY TRỞ LẠI",
                                "payload": VARIABLE.GO_BACK_MAIN
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "Đặt bàn",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            },
                        ]
                    },
                    {
                        "title": `Khu vực bình dân`,
                        "image_url": imageRoomNormal,
                        "subtitle": "Thiết kế thoáng mát, không gian dễ chịu.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "XEM CHI TIẾT",
                                "payload": VARIABLE.VIEW_DETAIL_ROOM
                            },
                            {
                                "type": "postback",
                                "title": "QUAY TRỞ LẠI",
                                "payload": VARIABLE.GO_BACK_MAIN
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}`,
                                "title": "Đặt bàn",
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
