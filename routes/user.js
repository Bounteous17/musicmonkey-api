const parseTorrent = require('parse-torrent');
const express = require('express');
const router = express.Router();
const mumoLib = require('../utils/functions.library');
const mumoMessages = require('../utils/msg-codes.json');
const musmoTrackers = require('../utils/trackers.json');

router.post('/torrent-upload', function (req, res) {
      let sampleFile = req.files.sampleFile;
      let fileDest = '/tmp/'+req.files.sampleFile.name; // Temporal storage torrent file
      if (!req.files) // Check if file exists on the request
            return res.status(400).send({error: true, message: mumoMessages.sys_errors.B2});
      
      sampleFile.mv(fileDest, function(err) { // Use the mv() method to place the file somewhere on your server
            if (err)
                  return res.status(500).send(err);

            if (!mumoLib.scpTorrent(fileDest)) //If file can't be copied to storage server
                  return res.status(500).send({error: true, message: mumoMessages.sys_errors.B0});

            return res.send({error: false, message: mumoMessages.app_success.C1});
      });
});

router.post('/torrent-magnet', function (req, res) {
      let hashTorrent = req.body.hashTorrent; //Torrent hash supplied
      let trackersAppend = '';

      for (let i = 0; i < musmoTrackers.Trackers.length; i++) { // Add stable trackers dynamically
            trackersAppend = trackersAppend + '&tr=' + musmoTrackers.Trackers[i];
      }
      
      let torrentUri = parseTorrent.toMagnetURI({infoHash: hashTorrent}) + trackersAppend; //Append trackers to magnet uri

      res.status(200);
      res.send({error: false, message: torrentUri}); 
      return;
});

module.exports = router;