const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB ${mongoose.connection.host}`)
    }catch(error){
        console.log(`MongoDB Connection Error ${error}`)
    }
}

module.exports=connectDB;
