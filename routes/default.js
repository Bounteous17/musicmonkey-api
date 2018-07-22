const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../utils/auth');
const mumoMessages = require('../utils/msg-codes.json');

router.get('/', function(req, res) {
	res.status(201).json({ message: 'You can see me :D - That monkeys...' });
});

router.post('/signup', function (req, res) {

  if (!req.body.username || !req.body.email || !req.body.password) {
    res.status(500);
    res.send({error: true, message: mumoMessages.app_errors.C0});
    return;
  }

  User.findOne({ email: req.body.email }, { email: req.body.username })
    .then(user => {
      if (user) {
        res.status(409);
        res.send({error: true, message: mumoMessages.app_errors.B1});
        return;
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {            
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              username: req.body.username,
              password: hash
            });
            user
              .save()
              .then(result => {
                res.status(201);
                res.send({error: false, message: mumoMessages.app_success.A0});
              })
              .catch(err => {
                console.log(err);
                res.status(500);
                res.send({error: true, error: err});
              });
          }
        });
      }
    });
});

router.post('/login', function (req, res) {
  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: mumoMessages.app_errors.A0
        });
      }
      
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          res.status(401);
          res.send({error: true, message: mumoMessages.app_errors.A1});
          return;
        }
        if (result) {
          auth.generateToken(user, function(reply) {
            if (reply.error) {
              res.status(500)
              res.send(reply);
              return;
            } else if (reply.stats) {
              res.status(404)
              res.send(reply);
              return;
            }
            res.status(200);
            res.send({error: false, token: reply.token, user: user});
            return;
          });
        } else {
          res.status(401)
          res.send({error: true, message: mumoMessages.app_errors.A1});
          return;
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post('/recovery', function (req, res, next) {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "User not found"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "9h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
  
module.exports = router;