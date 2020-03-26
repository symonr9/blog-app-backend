var express = require("express");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
var router = express.Router();

const Quote = require("../model/Quote");


router.get("/", async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (e) {
    res.send({ message: "Error in Fetching quotes" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let { id } = req.params || {};
    id = parseInt(id);
    const validParam = id && typeof id === 'number';

    if (validParam) {
      // request.user is getting fetched from Middleware after token authentication
      const quote = await Quote.findById(id);
      res.json(quote);
    }
  
  } catch (e) {
    res.send({ message: "Error in Fetching quote" });
  }
});

router.post(
  //Route
  "/create",
  //Validation
  [
    check("text", "Please Enter a Valid Text")
      .not()
      .isEmpty(),
      check("author", "Please Enter a Valid Author")
      .not()
      .isEmpty(),
      check("createdBy", "Please Enter a Valid createdBy")
      .not()
      .isEmpty(),
  ],
  //Request, reponse
  async (req, res) => {

    //Check for errors based on what was passed in
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    //Retrieve parameters from body (assumes application/json)
    const { text, author, isPublic, dateGiven, createdBy } = req.body;


    try {

      //Create new quote model with passed information
      quote = new Quote({
        text,
        author,
        isPublic,
        dateGiven,
        createdBy
      });

      //Save quote
      await quote.save();

      res.status(200).json({
        quote
      });
      
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

module.exports = router;
