import express from 'express'
import homeController from '../controllers/homeController'

let router = express.Router()

let initWebRoute = (app) => {
    router.get('/', homeController.getHomePage)

    //setup get_started button, whitelisted domain
    router.post('/setup-profile', homeController.setupProfile)

    //setup persisted menu
    router.post('/setup-persistent-menu', homeController.setupPersistentMenu)

    router.post('/webhook', homeController.postWebHook)
    router.get('/webhook', homeController.getWebHook)

    router.get('/reservation', homeController.handleRevervation)

    router.post('/reserve-table-ajax', homeController.handlePostReserveTable)

    return app.use("/", router)
}

module.exports = initWebRoute