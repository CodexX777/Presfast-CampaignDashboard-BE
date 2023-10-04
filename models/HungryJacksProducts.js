const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Todo add a permission array to store all the permissions
const hungryJackProductSchema = new Schema({
  prodName: { type: String, required: true },
  prodDesc: { type: String, required: true },
  prodImage: [{ type: String, required: true }],
  prodCategory: { type: String, required: true },
});

module.exports = mongoose.model("HungryJackProducts", hungryJackProductSchema);
