// get router express
const express = require('express');
const router = express.Router();
// require cahce
const NodeCache = require('node-cache');
const AppCache = new NodeCache({
    stdTTL: 60 * 3,
    useClones: false
});
// get data from controller
const {statistics_head, info_body, chart_data} = require('../../controller/overview/');
const {sensors_list} = require('../../controller/sensors/');



// root url (ex: https://domain.com)
router.get('/', async (req, res) => {

    // store the conditions
    const conditions = [
        AppCache.has('data_head'),
        AppCache.has('data_info'),
        AppCache.has('data_chart'),
    ];

    // if has a cache
    if(conditions[0] && conditions[1] && conditions[2]) {
        res.render('pages/overviews', {
            layout: 'layouts/overview-layouts',
            title: 'Home Page',
            data_head: AppCache.get('data_head'),
            data_info: AppCache.get('data_info'),
            data_chart: AppCache.get('data_chart')
        });
    } else {
        try {
            // get data from db
            const data_head = await statistics_head();
            const data_info = await info_body();
            const data_chart = await chart_data();

            // set data to cache
            AppCache.mset([
                {key:'data_head', val:data_head},
                {key:'data_info', val:data_info},
                {key:'data_chart', val:data_chart},
            ]);
        
            // render data from db
            res.render('pages/overviews', {
                layout: 'layouts/overview-layouts',
                title: 'Home Page',
                data_head,
                data_info,
                data_chart
            });
            
        } catch (error) {
            console.log(`${error}`);
        }
    }


});

// maps url (ex: https://domain.com/maps)
router.get('/maps', async (req, res) => {
    
    res.render('pages/maps', {
        layout: 'layouts/secondary-layouts',
        title: 'Airly | Maps',
    })
});

// sensors url (ex: https://domain.com/sensors)
router.get('/sensors', async (req, res) => {

    if(AppCache.has('data_sensors_list')) {
        res.render('pages/sensors', {
            layout: 'layouts/sensor-layouts',
            title: 'Airly | Sensors',
            data_sensors_list : AppCache.get('data_sensors_list')
        });
    } else {
        try {
            // get data from db
            const data_sensors_list = await sensors_list();
            // set cache
            AppCache.mset([
                {key:'data_sensors_list', val:data_sensors_list}
            ]);
            // render from db
            res.render('pages/sensors', {
                layout: 'layouts/sensor-layouts',
                title: 'Airly | Sensors',
                data_sensors_list
            });
        } catch (error) {
            console.error(`${error}`);
        }
    }
});

module.exports = router;