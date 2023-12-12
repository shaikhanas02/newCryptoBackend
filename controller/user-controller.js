const User = require("../schema/user-schema");
const WatchlistCard = require("../schema/watchlist-schema");
const jwt = require("jsonwebtoken");

const Register = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);
    const user = new User({ username, password });
    await user.save();

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Registration failed",
    });
  }
};

const Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }
    if (user.password !== password) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    const token = await jwt.sign({ username: user.username }, "secret", {
      expiresIn: 24,
    });

    res.status(200).json({
      message: "Login Successful",
      token: token,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      error: "Login Failed",
    });
  }
};

const Card = async (req, res) => {
  try {
    const { id, image, market_data } = req.body;
    const existingCard = await WatchlistCard.findOne({ id });

    if (existingCard) {
      console.log("1");
      console.log(id);
      console.log(image);
      console.log(market_data);

      // Card already exists, update it
      existingCard.image = image;
      existingCard.market_data = market_data;
      await existingCard.save();
    } else {
      // Card doesn't exist, create a new one
      const newCard = new WatchlistCard({ id, image, market_data });
      await newCard.save(); 
    }
    

    res.status(200).json({ message: "Card saved successfully" });
  } catch (error) {
    console.error("Error saving card:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getWatchlist = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await WatchlistCard.findOne({ id });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      }); 
    }

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
    });
  }
};

module.exports = { Login, Register, Card, getWatchlist };
