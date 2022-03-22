// Imports Module
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

// express 
const app = express();

/*
    Node js template engine
    - EJS layouts engine
*/
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

/*
    Get router import
*/ 
const {root} = require('./config/routes/router');

// use the route
app.use('/', root); // root pages


// run the apps
app.listen(process.env.PORT, (req, res) => {
    console.log(`apps running on port ${process.env.PORT} | http://localhost:${process.env.PORT}`);
})
