const express = require('express')
const router = express.Router()

const retificationController = require('../controllers/RetificationController')

router.post('/retify', retificationController.retify)

module.exports = router
