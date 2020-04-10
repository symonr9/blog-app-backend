const mongoose = require("mongoose");

const MONGOURI = process.env.MONGOURI;

/**********************************************************************
 * Function Name: InitiateMongoServer
 * Parameters: None
 * Description: Uses mongoose to connect to MongoDB.
 * Notes: None
 **********************************************************************/
const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      //UnitifiedTopology must be set to true to fix decrepancy warning.
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log("Successfully connected to mongoDB.");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;