// Imports Module
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

// express 
const app = express();

/*
    Node js template engine
    EJS layouts engine
*/
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

/*
    Get router import
*/ 
const {root, page404} = require('./config/routes/router');

// use the route
app.use('/', root); // root pages
app.use(page404); // 404 page not found


// run the apps
app.listen(process.env.PORT || 8080, (req, res) => {
    console.log(`apps running on port ${process.env.PORT || 8080} | http://localhost:${process.env.PORT || 8080}`);
})
