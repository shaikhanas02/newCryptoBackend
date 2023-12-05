const User = require('../schema/user-schema') ;

const Register = async(req,res) => {
    try{
        const{username, password} = req.body ;
        console.log(req.body) ;
        const user = new User({username, password}) ;
        await user.save() ;

        res.status(201).json({
            message : "User created successfully" ,
        })
    } catch(error){
        res.status(500).json({
            error: 'Registration failed'
        })
    }
}

const Login = async(req,res) =>{
    try{
        const{username, password} = req.body ;
        const user = await User.findOne({username}) ;

        if(!user){
            return res.status(401).json({
                error :'Invalid username or password'
            }) ;
        }
        if(user.password !== password){
            return res.status(401).json({
                error:'Invalid username or password'
            }) ;
        }
        res.status(200).json({
            message : 'Login Successful',
            status : 'success'
        })
    } catch(error){
        res.status(500).json({
            error: 'Login Failed'
        }) ;
    }
}

module.exports = {Login, Register} ;