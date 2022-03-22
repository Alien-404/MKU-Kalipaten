// get router express
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/overviews', {
        layout: 'layouts/main-layouts',
        title: 'Home Page'
    })
})

module.exports = router;