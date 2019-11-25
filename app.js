const express = require('express');
const connectDB = require('./DB/Connection')
const app = express();
const bodyParser=require('body-parser');

//lien de la vidéo qui m'a permi de comprendre et faire le projet
//https://www.youtube.com/watch?v=vjf774RKrLc

//enables cors
//ne vous occupez pas de ca, c'est juste pour que tous les ordis
//soient autorisés à utiliser l'api
var cors = require('cors');
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

//middlewares
app.use(bodyParser.json())


const userRoute = require('./routes/routeUser');
const accountRoute = require('./routes/routeAccount');

app.use('/users',userRoute);
app.use('/account',accountRoute);

//connect to db
connectDB();
const Port = process.env.Port || 3000;

app.listen(Port,()=>console.log("server started"));