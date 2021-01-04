const dotenv = require("dotenv");
dotenv.config();
const mongodb = require("mongodb");

mongodb.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
  if (err) {
    console.log(err)
  }
  module.exports = client
  const app = require("./app")
  app.listen(process.env.PORT)
})
