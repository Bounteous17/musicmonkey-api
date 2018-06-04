const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const auth = require('../utils/auth');

router.post("/signup", (req, res, next) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.status(500);
    res.send({message: "The fields username, email and password are required"});
    return;
  }
  User.find({ email: req.body.email }, { email: req.body.username })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        res.status(409);
        res.send({message: "User already exists"});
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
                res.send({error: false, message: "User created"});
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

router.post("/login", (req, res, next) => {
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
          res.status(401);
          res.send({error: true, message: "Auth failed"});
          return;
        }
        if (result) {
          let token = auth.generateToken(user[0]);
          res.status(200);
          res.send({error: false, message: "Auth successful", token: token});
          return;
        }
        res.status(401)
        res.send({error: true, message: "Auth failed"});
        return;
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/recovery", (req, res, next) => {
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