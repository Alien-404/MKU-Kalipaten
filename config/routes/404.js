// get router express
const express = require('express');
const router = express.Router();

router.use('/', (req, res, next) => {
    res.status(404).render('pages/404', {
        layout: 'layouts/clean-layouts',
        title: '404 Not Found!'
    })
})

module.exports = router;