const express = require('express') ;

const router = express.Router() ;

const {Login, Register, Card, getWatchlist} = require('../controller/user-controller') ;

router.post('/login', Login) ;
router.post('/register', Register) ;
router.post('/card', Card) ;
router.delete('/card', Card) ;
router.get("/watchlist", getWatchlist);


module.exports = router ;