const express = require('express')
const router = express.Router()

const retificationController  = require('../controllers/RetificationController')


router.post('/retify', retificationController.arrayToImage)

module.exports = router
