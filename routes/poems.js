var express = require("express");
const { check, validationResult } = require("express-validator/check");
const { generateCombination } = require("gfycat-style-urls");

var router = express.Router();

const Poem = require("../model/Poem");

//Get all poems
router.get("/", async (req, res) => {
  Poem.find()
    .then(poems => {
      res.status(200).json(poems);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

router.get("/:id", (req, res, next) => {
  Poem.findOne({
    _id: req.params.id
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

router.post(
  "/create",
  [
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
    const { title, body, notes, type, isPublic } = req.body;
    const urlId = `${generateCombination(2, "-")}`.toLowerCase();

    //Fixme: pull createdBy from active user
    const createdBy = "admin";

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


router.put("/edit/:id", async (req, res, next) => {

  //Retrieve parameters from body (assumes application/json)
  const { title, body, notes, type, isPublic } = req.body;
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

  //Fixme: pull createdBy from active user
  const createdBy = "admin";

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
