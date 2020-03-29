const mongoose = require("mongoose");

//Has "_id" default primary key property
const PoemSchema = mongoose.Schema({
  urlId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  type: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: true
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
module.exports = mongoose.model("poem", PoemSchema);
