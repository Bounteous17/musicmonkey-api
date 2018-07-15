const User = require('../models/user');
const mumoMessages = require('../utils/msg-codes.json');
const express = require('express');
const router = express.Router();

const parseTorrent = require('parse-torrent')
const fs = require('fs')

router.get('/info-torrent', function (req, res) {

      let torrentInfo = parseTorrent(fs.readFileSync(__dirname + '/tent.torrent'))

      res.status(200);
      res.send({error: false, message: torrentInfo});
      return;

});
  
module.exports = router;