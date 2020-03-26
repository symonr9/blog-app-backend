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
  ],
  //Request, reponse
  async (req, res) => {


    //Retrieve parameters from body (assumes application/json)
    const { text, author } = req.body;


    try {
      //Look for the user where the email matches
      let quote = await Quote.findOne({
        text
      });
      if (quote) {
        return res.status(400).json({
          msg: "User Already Exists"
        });
      }

      const isPublic = true;
      const dateGiven = '12/22/1990';
      const createdBy = 'syborg9';
      //Create new user model with passed information
      quote = new Quote({
        text,
        author,
        isPublic,
        dateGiven,
        createdBy
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);
      quote.text = await bcrypt.hash(text, salt);

      //Save user
      await quote.save();

      const payload = {
        quote: {
          id: quote.id
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
            token
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Creating Quote");
    }
  }
);

/*
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
      let quote = new Quote({
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
*/

module.exports = router;



/*

app.post('/api/stuff', (req, res, next) => {
  const thing = new Thing({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });
  thing.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

app.use('/api/stuff', (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});


app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
});



app.put('/api/stuff/:id', (req, res, next) => {
  const thing = new Thing({
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });
  Thing.updateOne({_id: req.params.id}, thing).then(
    () => {
      res.status(201).json({
        message: 'Thing updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});


app.delete('/api/stuff/:id', (req, res, next) => {
  Thing.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});
*/