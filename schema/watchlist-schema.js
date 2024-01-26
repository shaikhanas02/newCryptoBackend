const mongoose = require("mongoose");

const watchListSchema = new mongoose.Schema({
  username: String, 
  id: String,
  isSave : Boolean ,
  
});

const Card = mongoose.model("Watchlist", watchListSchema);
module.exports = Card;

