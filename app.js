const express = require('express');
const connectDB = require('./DB/Connection')
const app = express();
const bodyParser=require('body-parser');

//lien de la vidéo qui m'a permi de comprendre et faire le projet
//https://www.youtube.com/watch?v=vjf774RKrLc

//enables cors
//ne vous occupez pas de ca, c'est juste pour que tous les ordis
//soient autorisés à utiliser l'api
const port = 3000;
var cors = require('cors');
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type','Authorization'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

//middlewares
app.use(bodyParser.json())

connectDB();


const userRoute = require('./routes/routeUser');
const accountRoute = require('./routes/routeAccount');
const mailRoute = require('./routes/routeMailer');
const superUserRoute = require('./routes/routeSuperUser');

app.use('/mail',mailRoute);
app.use('/users',userRoute);
app.use('/account',accountRoute);
app.use('/superUser',superUserRoute)


app.listen(port,()=>console.log("server started sur le port "+ port));