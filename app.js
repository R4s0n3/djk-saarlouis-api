const fs = require("fs");
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');

const usersRoutes = require('./routes/users-routes');
const postsRoutes = require('./routes/posts-routes');
const teamsRoutes = require('./routes/teams-routes');
const leadsRoutes = require('./routes/leads-routes');
const categoriesRoutes = require('./routes/categories-routes');
const reportsRoutes = require('./routes/reports-routes');
const playersRoutes = require('./routes/players-routes');
const sponsorsRoutes = require('./routes/sponsors-routes');
const datesRoutes = require('./routes/dates-routes');
const trainingsRoutes = require('./routes/trainings-routes');
const trainersRoutes = require('./routes/trainers-routes');

const app = express();
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});

app.use("/api/users", usersRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/trainings", trainingsRoutes);
app.use("/api/trainers", trainersRoutes);
app.use("/api/players", playersRoutes);
app.use("/api/sponsors", sponsorsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/categories", categoriesRoutes);
// app.use("/api/livetickers", tickersRoutes);
app.use("/api/dates", datesRoutes);
app.use("/api/leads", leadsRoutes);

app.use((req,res,next)=>{
    const error = new HttpError("Could not find this route", 404);
    throw error;
});

app.use((error,req,res,next)=>{
    if(req.files){
       console.log(error);
      }
    if(res.headerSent){
        return next(error);
    }
res.status(error.code || 500);
res.json({message: error.message || "An unknown error occured!"});
});

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dhep3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    ,{ useNewUrlParser: true, useUnifiedTopology: true  })
.then(()=>{
    app.listen(process.env.PORT || 5000);
    console.log('Server is running on 5000')
})
.catch(err=>{
    console.log(err);
});
