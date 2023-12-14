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
    const { id, isSave } = req.body;

    if (req.method === "POST") {
      console.log("Creating a new card");
      const newCard = new WatchlistCard({ id, isSave });
      await newCard.save();

      res.status(200).json({ message: "Card saved successfully" });
    } else if (req.method === "DELETE") {
      const deletedCard = await WatchlistCard.findOneAndDelete(id); 
      if (deletedCard) {
        console.log("Deleting card");
        res.status(200).json({ message: "Card deleted successfully" }); 
      } else {
        console.log("Card not found");
        res.status(404).json({ message: "Card not found" });
      }
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error handling card request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getWatchlist = async (req, res) => {
  try {
    // const { id } = req.query;

    const users = await WatchlistCard.find({});

    // if (!users || users.length === 0) {
    //   return res.status(404).json({
    //     error: "User not found",
    //   });
    // }

    // return
    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
    });
  }
};

module.exports = { Login, Register, Card, getWatchlist };
