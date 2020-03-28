var express = require("express");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { generateCombination } = require("gfycat-style-urls");

var router = express.Router();

const Quote = require("../model/Quote");

//Get all quotes
router.get("/", async (req, res) => {
  Quote.find()
    .then(quotes => {
      res.status(200).json(quotes);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

router.get("/:id", (req, res, next) => {
  Quote.findOne({
    _id: req.params.id
  })
    .then(quote => {
      res.status(200).json(quote);
    })
    .catch(error => {
      res.status(404).json({
        error: error
      });
    });
});

router.post(
  "/create",
  [
    check("text", "Please Enter a Valid Text")
      .not()
      .isEmpty(),
    check("author", "Please Enter a Valid Author")
      .not()
      .isEmpty(),
    check("createdBy", "Please Enter a Valid createdBy")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    //Check for errors based on what was passed in
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    //Retrieve parameters from body (assumes application/json)
    const { text, author, isPublic, dateGiven } = req.body;
    const urlId = `${generateCombination(2, "-")}`.toLowerCase();

    //Fixme: pull createdBy from active user
    const createdBy = "admin";

    let quote = new Quote({
      urlId,
      text,
      author,
      isPublic,
      dateGiven,
      createdBy
    });

    quote
      .save()
      .then(
        res.status(200).json({
          quote
        })
      )
      .catch(error => {
        res.status(400).json({
          error: error
        });
      });
  }
);


router.put("/edit/:id", (req, res, next) => {

  //Retrieve parameters from body (assumes application/json)
  const { text, author, isPublic, dateGiven, urlId } = req.body;

  //Fixme: pull createdBy from active user
  const createdBy = "admin";
  const _id = req.params.id;

  const quote = new Quote({
    _id,
    urlId,
    text,
    author,
    isPublic,
    dateGiven,
    createdBy
  });

  Quote.updateOne({ _id: req.params.id }, quote)
    .then(() => {
      res.status(201).json({
        message: "Quote updated successfully!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

router.delete("/delete/:id", (req, res, next) => {
  Quote.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Deleted!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

module.exports = router;
