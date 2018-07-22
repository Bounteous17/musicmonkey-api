const mumoMessages = require('../utils/msg-codes.json');
const express = require('express');
const router = express.Router();
const mumoLib = require('../utils/functions.library');
const parseTorrent = require('parse-torrent');
const fs = require('fs');

router.post('/upload', function(req, res) {
      let fileDest = '/tmp/'+req.files.sampleFile.name;
      if (!req.files)
            return res.status(400).send('No files were uploaded.');

      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let sampleFile = req.files.sampleFile;
      // Use the mv() method to place the file somewhere on your server
      sampleFile.mv(fileDest, function(err) {
            if (err)
                  return res.status(500).send(err);

            if (!mumoLib.scpTorrent(fileDest))
                  return res.status(500).send({error: true, message: mumoMessages.sys_errors.B0});

            return res.send({error: false, message: mumoMessages.app_success.C1});
      });
});

router.get('/info-torrent', function (req, res) {

      let torrentInfo = parseTorrent(fs.readFileSync(__dirname + '/tent.torrent'))

      res.status(200);
      res.send({error: false, message: torrentInfo});
      return;

});

module.exports = router;