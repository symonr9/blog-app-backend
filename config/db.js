const mongoose = require("mongoose");

const MONGOURI = process.env.MONGOURI;

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;