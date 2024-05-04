const express = require('express');

const router = express.Router();
const chatController = require('../controllers/chat');
const isAuth = require('../middleware/is-auth');

router.get('/', isAuth.isAuth ,chatController.getMainPage);

router.post('/getUser', chatController.getUser);


module.exports = router;