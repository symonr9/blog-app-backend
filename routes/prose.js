var express = require("express");
const { check, validationResult } = require("express-validator");
const { generateCombination } = require("gfycat-style-urls");

var router = express.Router();

const Prose = require("../model/Prose");

//Get all prose
router.get("/", async (req, res) => {
  Prose.find()
    .then(prose => {
      res.status(200).json(prose);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

router.get("/:urlId", (req, res, next) => {
  Prose.findOne({
    urlId: req.params.urlId
  })
    .then(prose => {
      res.status(200).json(prose);
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
    const { title, body, isPublic } = req.body;
    const urlId = `${generateCombination(2, "-")}`.toLowerCase();

    //Fixme: pull createdBy from active user
    const createdBy = "admin";

    let prose = new Prose({
      urlId,
      title,
      body,
      isPublic,
      createdBy
    });

    prose
      .save()
      .then(
        res.status(200).json({
            prose
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
  const { title, body, isPublic } = req.body;
  console.log("Inside Prose");
  console.log("title: ", title);
  console.log("body: ", body);
  console.log("isPublic: ", isPublic);
  const _id = req.params.id;

  let urlId = "";
  try{
    let existingProse = await Prose.findOne({
      _id
    });

    urlId = existingProse.urlId;
  }
  catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error"
    });
  }

  //Fixme: pull createdBy from active user
  const createdBy = "admin";

  const prose = new Prose({
    _id,
    urlId,
    title,
    body,
    isPublic,
    createdBy
  });

  Prose.updateOne({ _id: req.params.id }, prose)
    .then(() => {
      res.status(201).json({
        message: "Prose updated successfully!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});
 
router.delete("/delete/:id", (req, res, next) => {
  Prose.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Successfully deleted prose!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

module.exports = router;
