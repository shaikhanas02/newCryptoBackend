const mongoose = require("mongoose");

const watchListSchema = new mongoose.Schema({
  id: String,
  image: {
    thumb: String 
  } ,

  market_data: {
    current_price: {
      usd: Number,
    }, 
    price_change_percentage_24h_in_currency: {
      usd: Number,
    }, 
    total_volume: {
      usd: Number,
    },
    market_cap: {
      usd: Number,
    },
  },
});

const Card = mongoose.model("Watchlist", watchListSchema);
module.exports = Card;
