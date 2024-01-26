const User = require("../schema/user-schema");
const WatchlistCard = require("../schema/watchlist-schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Register = async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log(req.body);

    const hashedPassword = await bcrypt.hash(password, 10) ;

    const user = new User({ username, password: hashedPassword });
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
    const hashedPassword = await bcrypt.hash(password, 10) ;

    if (!user || !bcrypt.compare(hashedPassword, user.password)) {
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
    const { id, isSave } = req.body; 
    console.log(req.body);
    const { authorization: token } = req.headers;

    const decodedToken = jwt.verify(token.replace("Bearer ", ""), "secret");
    if (req.method === "POST") {
      console.log("Creating a new card");
      const newCard = new WatchlistCard({
        username: decodedToken.username,
        id: id,
        isSave : isSave 
      }); 
      await newCard.save();

    } else if (req.method === "DELETE") { 
      const deletedCard = await WatchlistCard.findOneAndDelete({
        username: decodedToken.username,
        id: id, 
      });
      // console.log("id:", id );
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
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getWatchlist = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized - Token not provided",
      });
    }

    const decodedToken = jwt.verify(token.replace("Bearer ", ""), "secret");
    console.log(decodedToken);

    const username = decodedToken.username ;

    const userCards = await WatchlistCard.find({ username });

    res.status(200).json({
      userCards,
    });
  } catch (error) {
    res.status(401).json({
      error: "Unauthorized - Invalid token",
    });
  }
};

module.exports = { Login, Register, Card, getWatchlist };
