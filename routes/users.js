/***********************************************************************
 * File Name: users.js
 * Description: Implements the users router.
 * Author: Symon Ramos symonr12@gmail.com
 **********************************************************************/


var express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
var router = express.Router();

const User = require("../model/User");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.json({ message: "API for user Working" });
});

router.post("/signup",
  [],
  //Request, reponse
  async (req, res) => {
    //Retrieve parameters from body (assumes application/json)
    const { username, email, password } = req.body;

    try {
      //Look for the user where the email matches
      let user = await User.findOne({
        username
      });
      if (user) {
        return res.status(400).json({
          message: "User Already Exists"
        });
      }

      //Create new user model with passed information
      user = new User({
        username,
        email,
        password
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //Save user
      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      //Return a token
      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 10000
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
            username
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

router.post("/login",
  [],
  async (req, res) => {

    const { username, password } = req.body;
    try {
      let user = await User.findOne({
        username
      });

      if (!user){
        return res.status(400).json({
          message: "User Not Exist"
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch){
        return res.status(400).json({
          message: "Incorrect Password !"
        });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "secret",
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
            username
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

//Get logged in user info
router.get("/info", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

module.exports = router;
