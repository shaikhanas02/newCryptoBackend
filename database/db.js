const mongoose = require('mongoose') ;

const connection = async () =>{
    try{
   await  mongoose.connect(`mongodb+srv://shaikhanas02:shaikhanas02@cluster0.styeuxh.mongodb.net/newCrypto?retryWrites=true&w=majority`) ;
   console.log('db connected') ;
}
catch(error){
    console.log("Error connecting to the database", error)
} 
} 


module.exports = connection ;