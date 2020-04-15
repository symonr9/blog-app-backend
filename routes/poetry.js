/***********************************************************************
 * File Name: poetry.js
 * Description: Implements the poetry router.
 * Author: Symon Ramos symonr12@gmail.com
 **********************************************************************/

var express = require("express");
const { check, validationResult } = require("express-validator");
const { generateCombination } = require("gfycat-style-urls");

var router = express.Router();

const Poem = require("../model/Poem");

/**********************************************************************
 * URI: Get All Poetry
 * Notes: None
 **********************************************************************/
router.get("/", async (req, res) => {
  Poem.find()
    .then(poetry => {
      res.status(200).json(poetry);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

/**********************************************************************
 * URI: Get Poetry by User
 * Notes: None
 **********************************************************************/
router.get("/user/:username", async (req, res) => {
  Poem.find({
    createdBy: req.params.username
  })
    .then(poetry => {
      res.status(200).json(poetry);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

/**********************************************************************
 * URI: Get Poetry by urlId.
 * Notes: None
 **********************************************************************/
router.get("/:urlId", (req, res, next) => {
  Poem.findOne({
    urlId: req.params.urlId
  })
    .then(poem => {
      res.status(200).json(poem);
    })
    .catch(error => {
      res.status(404).json({
        error: error
      });
    });
});

/**********************************************************************
 * URI: Create Poetry
 * Notes: None
 **********************************************************************/
router.post(
  "/create",
  [
    //Validates input.
    check("title", "Please Enter a Valid Title")
      .not()
      .isEmpty(),
    check("body", "Please Enter a Valid Body")
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
    const { title, body, notes, type, isPublic, createdBy } = req.body;
    //Use NPM library to generate random urlId.
    const urlId = `${generateCombination(2, "-")}`.toLowerCase();

    let poem = new Poem({
      urlId,
      title,
      body,
      notes,
      type,
      isPublic,
      createdBy
    });

    poem
      .save()
      .then(
        res.status(200).json({
          poem
        })
      )
      .catch(error => {
        res.status(400).json({
          error: error
        });
      });
  }
);

/**********************************************************************
 * URI: Edit Poetry
 * Notes: Expects _id, not urlId. Because it is being called on an
 * existing item, _id is used instead of urlId because it is known.
 **********************************************************************/
router.put("/edit/:id", async (req, res, next) => {

  //Retrieve parameters from body (assumes application/json)
  const { title, body, notes, type, isPublic, createdBy } = req.body;
  const _id = req.params.id;

  let urlId = "";
  try{
    let existingPoem = await Poem.findOne({
      _id
    });

    urlId = existingPoem.urlId;
  }
  catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error"
    });
  }

  const poem = new Poem({
    _id,
    urlId,
    title,
    body,
    notes,
    type,
    isPublic,
    createdBy
  });

  Poem.updateOne({ _id: req.params.id }, poem)
    .then(() => {
      res.status(201).json({
        message: "Poem updated successfully!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

/**********************************************************************
 * URI: Delete Poetry
 * Notes: Expects _id, not urlId. Because it is being called on an
 * existing item, _id is used instead of urlId because it is known.
 **********************************************************************/
router.delete("/delete/:id", (req, res, next) => {
  Poem.deleteOne({ _id: req.params.id })
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
