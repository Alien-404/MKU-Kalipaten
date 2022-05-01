const {
        getsDataToday, 
        getsDataFrom, 
        getDeviceById, 
        getDataSensorsByDesc,
        getAllDevices
    } = require('../../models/fetching');
const {geoJSON} = require('../../models/geojson');
const _ = require('lodash');
const moment = require('moment');
const { isEmpty } = require('lodash');

// device name
const device_name = 'Raspi #003';

// (async () => {

// })();



module.exports.statistics_head = async () => {
    // init yesterday date
    const yesterday = moment().subtract(1, 'day').startOf('day').toDate();
    // do multiple promises
    let [data_sensors_yesterday, data_sensors_today, device_data] = await Promise.allSettled([getsDataFrom(yesterday, device_name), getsDataToday(1, device_name), getDeviceById(device_name)]);

    // sperate if condition
    const conditions = [
        data_sensors_today.status == 'fulfilled',
        data_sensors_yesterday.status == 'fulfilled',
        device_data.status == 'fulfilled'
    ];

    if(isEmpty(data_sensors_yesterday.value) || isEmpty(data_sensors_today.value)) {
        // init var
        let data_sensors_once = await getDataSensorsByDesc(device_name);
        let data_today;
        const device = device_data.value;
        const data_timestamp = _.map(data_sensors_once, 'created_at');

        // check null or not
        if(isEmpty(data_sensors_once)) {
            // create dummy data
            data_sensors_once.push({
                PM10: {
                    value: 0
                },
                CO2: {
                    value: 0
                },
                Temperature: {
                    value: 0
                },
                Humidity: {
                    value: 0
                }
            });
        } else {
            data_sensors_once = _.map(data_sensors_once, 'data_sensors');
            data_today = {
                PM10: _.get(_.map(data_sensors_once, 'PM10'), '[0].value'),
                CO2: _.get(_.map(data_sensors_once, 'CO2'), '[0].value'),
                Temperature: _.get(_.map(data_sensors_once, 'Temperature'), '[0].value'),
                Humidity: _.get(_.map(data_sensors_once, 'Humidity'), '[0].value')
            };
        }

        // convert timestamp to date and time
        const millisTime = data_timestamp[0]._seconds * 1000;
        const date_info =  new Date(millisTime).toLocaleTimeString() + ', ' + new Date(millisTime).toDateString();

        // mean data sensors yesterday dummy
        const data_persentage = {
            PM10: 0,
            CO2: 0,
            Temperature: 0,
            Humidity: 0
        };

        // store in one objects
        const result = {
            date_info,
            device,
            data_today,
            data_persentage
        };

        return result;


    } else {
        // condition check
        if(conditions[0] && conditions[1] && conditions[2]) {
        
            // var data
            const only_data_sensors_yesterday = _.map(data_sensors_yesterday.value, 'data_sensors');
            const only_data_sensors_today = _.map(data_sensors_today.value, 'data_sensors');
            const device = device_data.value;
            const data_timestamp = _.map(data_sensors_today.value, 'created_at');


            // convert timestamp to date and time
            const millisTime = data_timestamp[0]._seconds * 1000;
            const date_info =  new Date(millisTime).toLocaleTimeString() + ', ' + new Date(millisTime).toDateString();

            // mean data sensors yesterday
            const mean_data_yesterday = {
                PM10: Math.round(_.meanBy(_.map(only_data_sensors_yesterday, 'PM10'), 'value')),
                CO2: Math.round(_.meanBy(_.map(only_data_sensors_yesterday, 'CO2'), 'value')),
                Temperature: Math.round(_.meanBy(_.map(only_data_sensors_yesterday, 'Temperature'), 'value')),
                Humidity: Math.round(_.meanBy(_.map(only_data_sensors_yesterday, 'Humidity'), 'value')),
            };

            // store data today
            const data_today = {
                PM10: _.get(_.map(only_data_sensors_today, 'PM10'), '[0].value'),
                CO2: _.get(_.map(only_data_sensors_today, 'CO2'), '[0].value'),
                Temperature: _.get(_.map(only_data_sensors_today, 'Temperature'), '[0].value'),
                Humidity: _.get(_.map(only_data_sensors_today, 'Humidity'), '[0].value'),
            };

            // simple func to calculate persentage
            const persentange = (valueToday, valueYesterday) => {
                const result = (valueToday - valueYesterday) / valueToday * 100;

                // logic slice
                if(result < 0) {
                    return result.toString().slice(0,5);
                } else {
                    return result.toString().slice(0,4);
                }
            };
            
            // store data persentage today and yesterday
            const data_persentage = {
                PM10: persentange(data_today.PM10, mean_data_yesterday.PM10),
                CO2: persentange(data_today.CO2, mean_data_yesterday.CO2),
                Temperature: persentange(data_today.Temperature, mean_data_yesterday.Temperature),
                Humidity: persentange(data_today.Humidity, mean_data_yesterday.Humidity),
            };

            // store in one objects
            const result = {
                date_info,
                device,
                data_today,
                data_persentage
            };

            return result;

        } else {
            console.log(`the promises is rejected`);
        }
    }
}

module.exports.info_body = async () => {
    // get data
    const devices = await getAllDevices();
    const dataGeo = await geoJSON();

    if(isEmpty(devices)) {
        const totalDevices = 0;
        const sensors = ['No Sensors'];

        const result = {
            totalDevices,
            sensors
        };

        return result;
    } else {
        // count length device
        const totalDevices = devices.length;

        // get sensors list
        const sensors_list = _.map(devices, 'sensors');
        const sensors_list_index = sensors_list.map(item => item.length);
    
        // get once data
        const sensors = sensors_list[sensors_list_index.indexOf(Math.max(...sensors_list_index))];

        const result = {
            totalDevices,
            sensors,
            dataGeo
        }

        return result;
    }
        
}

module.exports.chart_data = async () => {
    // data init
    const daily = moment().subtract(3, 'day').startOf('day').toDate();
    const weekly = moment().subtract(21, 'day').startOf('day').toDate();
    const [data_sensors_daily, data_sensors_weekly] = await Promise.allSettled([getsDataFrom(daily, device_name), getsDataFrom(weekly, device_name)]);

    // logic promises
    if(data_sensors_daily.status == 'fulfilled' && data_sensors_weekly.status == 'fulfilled') {
        // store the value data
        const data_daily = data_sensors_daily.value;
        const data_weekly = data_sensors_weekly.value;

        // check data not null
        if(data_daily.length > 0 && data_weekly.length > 0) {

            // filter data sensors between dates
            const filterBetweenDates = (start, end, objects) => {
                // convert user input to timestamp
                const start_date = moment().subtract(start, 'day').startOf('day').toDate().getTime();
                const end_date = moment().subtract(end, 'day').startOf('day').toDate().getTime();

                // filter data object
                const result = objects.filter(data => {
                    let time = data.created_at._seconds * 1000;
                    return (start_date < time && time < end_date);
                })
                return result;
            }

            // data sensors daily filter 
            const one_day_ago = filterBetweenDates(1, 0, data_daily);
            const two_day_ago = filterBetweenDates(2, 1, data_daily);
            const three_day_ago = filterBetweenDates(3, 2, data_daily);

            // data sensors weekly filter 
            const one_week_ago = filterBetweenDates(7, 0, data_weekly);
            const two_week_ago = filterBetweenDates(14, 7, data_weekly);
            const three_week_ago = filterBetweenDates(21, 14, data_weekly);

            // mean data sensors 
            const daily_mean_data_sensors = {
                PM10: [
                    (three_day_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(three_day_ago, 'data_sensors'), 'PM10'), 'value')) : 0,
                    (two_day_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(two_day_ago, 'data_sensors'), 'PM10'), 'value')) : 0,
                    (one_day_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(one_day_ago, 'data_sensors'), 'PM10'), 'value')) : 0,
                ],
                CO2: [
                    (three_day_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(three_day_ago, 'data_sensors'), 'CO2'), 'value')) : 0,
                    (two_day_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(two_day_ago, 'data_sensors'), 'CO2'), 'value')) : 0,
                    (one_day_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(one_day_ago, 'data_sensors'), 'CO2'), 'value')) : 0,
                ],
                Temperature: [
                    (three_day_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(three_day_ago, 'data_sensors'), 'Temperature'), 'value')) : 0,
                    (two_day_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(two_day_ago, 'data_sensors'), 'Temperature'), 'value')) : 0,
                    (one_day_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(one_day_ago, 'data_sensors'), 'Temperature'), 'value')) : 0,
                ],
                Humidity: [
                    (three_day_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(three_day_ago, 'data_sensors'), 'Humidity'), 'value')) : 0,
                    (two_day_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(two_day_ago, 'data_sensors'), 'Humidity'), 'value')) : 0,
                    (one_day_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(one_day_ago, 'data_sensors'), 'Humidity'), 'value')) : 0,
                ]
            };
            const weekly_mean_data_sensors = {
                PM10: [
                    (three_week_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(three_week_ago, 'data_sensors'), 'PM10'), 'value')) : 0,
                    (two_week_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(two_week_ago, 'data_sensors'), 'PM10'), 'value')) : 0,
                    (one_week_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(one_week_ago, 'data_sensors'), 'PM10'), 'value')) : 0,
                ],
                CO2: [
                    (three_week_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(three_week_ago, 'data_sensors'), 'CO2'), 'value')) : 0,
                    (two_week_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(two_week_ago, 'data_sensors'), 'CO2'), 'value')) : 0,
                    (one_week_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(one_week_ago, 'data_sensors'), 'CO2'), 'value')) : 0,
                ],
                Temperature: [
                    (three_week_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(three_week_ago, 'data_sensors'), 'Temperature'), 'value')) : 0,
                    (two_week_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(two_week_ago, 'data_sensors'), 'Temperature'), 'value')) : 0,
                    (one_week_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(one_week_ago, 'data_sensors'), 'Temperature'), 'value')) : 0,
                ],
                Humidity: [
                    (three_week_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(three_week_ago, 'data_sensors'), 'Humidity'), 'value')) : 0,
                    (two_week_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(two_week_ago, 'data_sensors'), 'Humidity'), 'value')) : 0,
                    (one_week_ago.length > 0) ? Math.round(_.meanBy(_.map(_.map(one_week_ago, 'data_sensors'), 'Humidity'), 'value')) : 0,
                ]
            };

            // date info
            const daily_date_info = [
                moment().subtract(3, 'day').format('ddd, Do MMMM'),
                moment().subtract(2, 'day').format('ddd, Do MMMM'),
                moment().subtract(1, 'day').format('ddd, Do MMMM'),
            ]
            const weekly_date_info = [
                moment().subtract(15, 'day').format('ddd, Do MMMM'),
                moment().subtract(8, 'day').format('ddd, Do MMMM'),
                moment().subtract(1, 'day').format('ddd, Do MMMM'),
            ]

            // store in one object
            const result = {
                daily_mean_data_sensors,
                daily_date_info,
                weekly_mean_data_sensors,
                weekly_date_info
            }

            return result;

        } else {
            // create dummy data

            // mean data sensors 
            const daily_mean_data_sensors = {
                PM10: [0,0,0],
                CO2: [0,0,0],
                Temperature: [0,0,0],
                Humidity: [0,0,0]
            };
            const weekly_mean_data_sensors = {
                PM10: [0,0,0],
                CO2: [0,0,0],
                Temperature: [0,0,0],
                Humidity: [0,0,0]
            };
                
            // date info
            const daily_date_info = [
                moment().subtract(3, 'day').format('ddd, Do MMMM'),
                moment().subtract(2, 'day').format('ddd, Do MMMM'),
                moment().subtract(1, 'day').format('ddd, Do MMMM'),
            ]
            const weekly_date_info = [
                moment().subtract(15, 'day').format('ddd, Do MMMM'),
                moment().subtract(8, 'day').format('ddd, Do MMMM'),
                moment().subtract(1, 'day').format('ddd, Do MMMM'),
            ]

            // store in one object
            const result = {
                daily_mean_data_sensors,
                daily_date_info,
                weekly_mean_data_sensors,
                weekly_date_info
            }

            return result;
        }
    } else {
        console.error('promises rejected');
    }
}

// export some func 
