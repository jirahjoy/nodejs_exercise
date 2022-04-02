const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const port = process.env.port || 8007;

const app = express();

const dotenv = require('dotenv');
dotenv.config({path:'./.env'});

app.use(express.urlencoded({extended:true}));

app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

app.use('/auth', require('./Routes/Auth'));
app.use('/', require('./Routes/PageRoutes.js'));

app.listen(port, () =>{
    console.log('Server is running at '+ port);
})