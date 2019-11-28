const mongoose = require('mongoose');
require('dotenv/config');

const URI = "mongodb+srv://mart:mart@aiocluster-m0vw5.mongodb.net/aio?retryWrites=true&w=majority";
const connectDB = async()=>{
    await mongoose.connect(process.env.MONGODB_URL,{
        useUnifiedTopology: true,
        useNewUrlParser: true 
    })
    console.log('db connected..!');
};

module.exports=connectDB;