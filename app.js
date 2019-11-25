const express = require('express');
const connectDB = require('./DB/Connection')
const app = express();
const bodyParser=require('body-parser');


var cors = require('cors');

//enables cors
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

//middlewares
app.use(bodyParser.json())


const userRoute = require('./routes/routesListUser');
app.use('/user',userRoute);

//connect to db
connectDB();
const Port = process.env.Port || 3000;

app.listen(Port,()=>console.log("server started"));