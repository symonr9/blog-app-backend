const mongoose = require("mongoose");

//Has "_id" default primary key property
const QuoteSchema = mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  dateGiven: { //the date the quote was given
    type: Date,
  },
  createdBy: {
    type: String, //mongoDB doesn't have foreign keys, just put in literal of _id property. Docs based
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// export model user with UserSchema
module.exports = mongoose.model("quote", QuoteSchema);