const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Todo add a permission array to store all the permissions
const presfastProductSchema = new Schema({
  prodName: { type: String, required: true },
  prodInitials: { type: String, required: true },
  prodFinishedSize: { type: String, required: false, default: "" },
  unitPrice: { type: Number, required: true },
  prodDesc: { type: String, required: false, default: "" },
  prodImages: [{ type: String, required: true }],
  prodCategory: { type: String, required: true },
});

module.exports = mongoose.model("PresfastProducts", presfastProductSchema);
