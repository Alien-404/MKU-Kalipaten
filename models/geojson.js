const {
    getDataSensorsByDesc,
    getAllDevices
} = require('../models/fetching');
const moment = require('moment');


const geoJSON = async () => {
    // get all devices
    const devices = await getAllDevices();

    // set geojson format
    let data = [{
        "type": "FeatureCollection",
        "features": []
    }];
    
    // looping for get data sensors each device
    for(const device of devices) {
        const data_sensors = await getDataSensorsByDesc(device.device_name);

        // check if data sensors is null
        if(data_sensors.length > 0) {
            data[0].features.push({
                "type": "Feature",
                "properties": {
                    "device_id": device.id,
                    "device_name": device.device_name,
                    "device_location_name": device.device_location_name,
                    "data_sensors": data_sensors[0].data_sensors,
                    "condition": data_sensors[0].condition,
                    "created_at": moment(data_sensors[0].created_at._seconds * 1000).format('hh:mm a, MMM dddd Do YYYY')
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [device.device_location._longitude, device.device_location._latitude]
                }
    
            });
        }  
    } // end for loop

    return data;
}

module.exports = {
    geoJSON
}