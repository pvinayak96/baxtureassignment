const express = require("express");
const bodyParser = require('body-parser');
require('dotenv').config();

const app =express();

app.listen(process.env.PORT, process.env.HOST, ()=>{
    console.log("Server is listening on " + process.env.HOST + " at " +process.env.PORT+ " port")
})


if(process.env.NODE_ENV === 'production'){
    console.log('Backend is running on prod');
}
else{
    console.log('Backend is running on dev mode');
}

//Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use('/api', require('./routes/users.js'))

//Handling non-existing endpoints
app.use((req,res,next)=>{
    res.status(404).json({error : 'Requested resource not found'})
})

app.use((err,req,res,next)=>{
    console.error(err); //For logging/ debugging purposes
    res.status(500).json({error: 'Internal Server Error'})
})

