const User = require("../schema/user-schema");
const WatchlistCard = require("../schema/watchlist-schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const express = require("express");
// const app = express();

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

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    const token = jwt.sign({ username: user.username }, "secret", {
      expiresIn: "24h",
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
    const { id } = req.body; 
    const { authorization: token } = req.headers;

    const decodedToken = jwt.verify(token.replace("Bearer ", ""), "secret");     
    console.log(decodedToken); 
    if (req.method === "POST") {
      console.log("Creating a new card");
      const newCard = new WatchlistCard({ username: decodedToken.username, 
        id: id, }); 
      await newCard.save(); 

      res.status(200).json({ userId: id });
    } else if (req.method === "DELETE") {
      const deletedCard = await WatchlistCard.findOneAndDelete({
        username : decodedToken.username, 
        id: id, 
      }); 
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
    res.status(404).json(req.body);
  }
};

const getWatchlist = async (req, res) => {
  try {
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({
        error: "Unauthorized - Token not provided",
      });
    }

    // Extract user information from the token
    const decodedToken = jwt.verify(token.replace("Bearer ", ""), "secret");
    console.log(decodedToken);
    // Assuming your WatchlistCard model has a field 'userId' to store the user's ID
    // const userId = decodedToken.userId;

    // Find cards associated with the authenticated user
    const userCards = await WatchlistCard.find({ username });

    res.status(200).json({
      userCards,
    });
  } catch (error) {
    // Handle token verification errors
    res.status(401).json({
      error: "Unauthorized - Invalid token",
    });
  }
};

module.exports = { Login, Register, Card, getWatchlist };
