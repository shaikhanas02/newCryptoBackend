const mongoose = require("mongoose");

const watchListSchema = new mongoose.Schema({
  username: String, 
  id: String,
  
});

const Card = mongoose.model("Watchlist", watchListSchema);
module.exports = Card;

