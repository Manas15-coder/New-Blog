const { hasSubscribers } = require('diagnostics_channel');
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')

//register a new user

exports.registerController = async(req,res)=>{
    try{
        const {username,email,password}=req.body;

        //validation
        if(!username || !email || !password){
            return res.status(400).send({success:false,message:'Please fill all the fields'})
        }
        //existing user
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status({success:false,message:'user already exists'});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        
        //save user
        const user = new userModel({username,email,password:hashedPassword});
        await user.save();
        return res.status(201).send({success:true,message:'New user created',user});
    }
    catch(error){
        console.log(error);
        return res.status(501).send({success:false,message:'Error in register user'})
    }
}

//get all user

exports.getAllUsers = async(req,res)=>{
    try{
        const users = await userModel.findOne({});
        return res.status(200).send({userCount: users.length, success: true, message:'All users data',users})
    }
    catch(error){
        res.status(500).send({success:false,message:'Error in get all users',error})
    }
};

//login users

exports.loginController = async(req,res)=>{
    try{
        const {email,password} = req.body;
        //validation
        if(!email || !password){
            return res.status(400).send({success:false,message:'Please provide email and password'});
        }
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).send({success:false,message:'Email is not registered'});
        }
        //password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).send({success:false,message:'Invalid username or password'});
        }
        return res.status(201).send({success:true,message:'Login successfully',user})
    }
    catch(error){
        console.log(error)
        return res.status(500).send({success:false,message:'Error in login callback',error})
    }
};