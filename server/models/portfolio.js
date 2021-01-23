const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  holdings: [
    {
      type: Object,
      required: false,
    },
  ],
  owner: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Portfolio", portfolioSchema, "Portfolio");
