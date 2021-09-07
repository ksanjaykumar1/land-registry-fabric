const express = require('express');

const router = express.Router();
const {invokeFunction,queryFunction} =require('../controller/transaction')


router.post('/invoke',invokeFunction);
router.post('/query',queryFunction);


module.exports = router;