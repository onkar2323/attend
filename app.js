import express from 'express';
import morgan from 'morgan';
import { connect } from 'mongoose';
import path from 'path';
require('dotenv').config();
import { urlencoded, json } from 'body-parser';
import { verify } from 'jsonwebtoken';
import { findById } from './models/userModel';
import routes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(urlencoded({ extended: false }));
app.use(json());


connect(process.env.MONGO_DB).then((result)=>
    app.listen(process.env.PORT || 5000, (req,res)=>{
        console.log(`mongo connected, listenning on port: ${PORT}`)
    }))
  .catch((err) => console.log(err, 'mongo not connected'));

app.use(morgan('dev'))



app.use(async (req, res, next) => {
    if (req.headers["x-access-token"]) {
     const accessToken = req.headers["x-access-token"];
     const { userId, exp } = await verify(accessToken, process.env.JWT_SECRET);
     // Check if token has expired
     if (exp < Date.now().valueOf() / 1000) { 
      return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
     } 
     res.locals.loggedInUser = await findById(userId); next(); 
    } else { 
     next(); 
    } 
   });
app.use('/', routes); 





