// get router express
const express = require('express');
const router = express.Router();

// root url (ex: https://domain.com)
router.get('/', (req, res) => {
    res.render('pages/overviews', {
        layout: 'layouts/main-layouts',
        title: 'Home Page'
    })
});

// maps url (ex: https://domain.com/maps)
router.get('/maps', (req, res) => {
    res.render('pages/maps', {
        layout: 'layouts/secondary-layouts',
        title: 'Airly | Maps'
    })
});

// sensors url (ex: https://domain.com/sensors)
router.get('/sensors', (req, res) => {
    res.render('pages/sensors', {
        layout: 'layouts/main-layouts',
        title: 'Airly | Sensors',
    })
});

module.exports = router;