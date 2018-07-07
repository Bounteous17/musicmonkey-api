const User = require('../models/user');
const mumoMessages = require('../utils/msg-codes.json');
const express = require('express');
const router = express.Router();

router.post('/test', function (req, res) {

      res.status(200);
      res.send('test');
      return;

});
  
module.exports = router;