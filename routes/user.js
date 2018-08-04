const parseTorrent = require('parse-torrent');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Artist = require('../models/artist');
const Song = require('../models/song');
const mumoLib = require('../utils/functions.library');
const mumoMessages = require('../utils/msg-codes.json');
const musmoTrackers = require('../utils/trackers.json');
const fs = require('fs');

router.post('/torrent-upload', function (req, res) {
      console.log(req.files);
      console.log(req.body);
      let sampleFile = req.files.formTorrent;
      let fileDest = '/tmp/'+sampleFile.name; // Temporal storage torrent file
      if (!req.files) // Check if file exists on the request
            return res.status(400).send({error: true, message: mumoMessages.sys_errors.B2});

      const artistBody = req.body.formArtistName;
      const titleBody = req.body.formTitle;
      const styleBody = req.body.formStyle;

      mumoLib.storeArtist(artistBody, function(reply) {
            const song = new Song ({
                  _id: new mongoose.Types.ObjectId(),
                  title: titleBody,
                  artist: new mongoose.Types.ObjectId(reply),
                  style: styleBody
            });
      
            song.save(function(err) {
                  if (err) {
                        console.log("Error saving song -> ", err);
                  }
                  console.log("New song stored");
            });
      });

      sampleFile.mv(fileDest, function(err) { // Use the mv() method to place the file somewhere on your server
            if (err)
                  return res.status(500).send(err);

            if (mumoLib.scpTorrent(fileDest, function(reply) {
                  if(!reply)
                        return res.status(500).send({error: true, message: mumoMessages.sys_errors.B0});
                        
                  return res.send({error: false, message: mumoMessages.app_success.C1});
            }));

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

router.post('/artist-related', function (req, res) {
      Artist.find({username: {"$regex": req.body.artist, "$options": "$i"}})
      .then((artists) => {
            if (!artists[0] || !req.body.artist) {
                  res.status(200);
                  res.send({error: true, message: ['No artist found']});
                  return;
            }

            let artistsAry = [];
            for (let i in artists) {
                  artistsAry.push({username: artists[i].username, _id: artists[i]._id});
            }

            res.status(200);
            res.send({error: false, message: artistsAry});
            return;
      })
      .catch((e) => {
            console.log(e);
            res.status(413)
            res.send({error: true, stats: mumoMessages.sys_errors.A0});
            return;
      })
});

router.post('/add-artist', function (req, res) {
      Artist.findOne({username: req.body.artist})
      .then((artist) => {
            if (!artist) {
                  const artist = new Artist({
                        _id: new mongoose.Types.ObjectId(),
                        username: req.body.artist
                  });
                  artist
                  .save()
                  .then(result => {
                        res.status(200);
                        res.send({error: true, message: mumoMessages.app_success.A1});
                        return;
                  })
                  .catch(err => {
                        res.status(413)
                        res.send({error: true, stats: mumoMessages.sys_errors.A2});
                        return;
                  })
            } else {
                  res.status(200);
                  res.send({error: false, message: mumoMessages.app_errors.B2});
                  return;
            }
      })
      .catch((e) => {
            res.status(413)
            res.send({error: true, stats: mumoMessages.sys_errors.A0});
            return;
      })
});

module.exports = router;