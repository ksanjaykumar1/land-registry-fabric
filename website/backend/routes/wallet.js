const express = require('express')

const router = express.Router();

const {generateAllWallet}= require('../controller/wallet')

// to create all the wallets of all enrolled users

router.get('/',generateAllWallet);

module.exports = router;