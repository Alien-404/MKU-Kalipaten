const fireDB = require('../config/firebase/config');
const moment = require('moment');


/**
 * Func for get device id by device name
 * @param {String} device_name
 */
const getDeviceIdByName = async (device_name) => {
    const snapshot = await fireDB.collection('device').where('device_name', '==', device_name).get();

    let device_id = '';
    
    if(snapshot.empty) {
        console.log(`oops device '${device_name}' not found in DB`);
        return;
    } else {
        snapshot.forEach(doc => {
            device_id += doc.id;
        });
        device_id = fireDB.collection('device').doc(device_id);
    }
    return device_id;
};


/**
 * Func for get data sensors from {date} end today
 * @param {Date} dateAt
 * @param {String} device_name
 */
module.exports.getsDataFrom = async (dateAt, device_name) => {
    // init const variables
    const reference = await getDeviceIdByName(device_name);
    const today = moment().startOf('day').toDate();

    // store data from DB
    let data_sensors = [];

    // query DB
    const snapshot = await fireDB.collection('data_sensors').where('device_id', '==', reference).where('created_at', '<=', today).where('created_at', '>', dateAt).get();

    // condition check
    if(snapshot.empty) {
        console.log(`oops the data sensors from '${dateAt}' not found at DB `);
        return data_sensors;
    } else {
        snapshot.forEach(doc => {
            data_sensors.push({...doc.data(), id:doc.id})
        });
    }

    return data_sensors;
};


/**
 * Func for get deviceById
 * @param {String} device_name
 */
module.exports.getDeviceById = async (device_name) => {
    // init const variables
    const reference = await getDeviceIdByName(device_name);

    // query DB
    const doc_device = await fireDB.collection('device').doc(reference.id).get();

    if(!doc_device.exists) {
        console.log(`oops device not found!`);
    } else {
        return doc_device.data();
    }

};


/**
 * Func for get new data sensors today with limit
 * @param {number} limit
 * @param {String} device_name
 */
module.exports.getsDataToday = async (limit = 1, device_name) => {
    // init var
    const reference = await getDeviceIdByName(device_name);
    const today = moment().startOf('day').toDate();

    // query to DB
    const snapshot = await fireDB.collection('data_sensors').where('device_id', '==', reference).where('created_at', '>=', today).orderBy('created_at', 'desc').limit(limit).get();

    // store data
    let data_sensors = [];

    // conditions check
    if(snapshot.empty) {
        console.log(`oops the data sensors at '${today}' not found in DB `);
        return data_sensors;
    } else {
        snapshot.forEach(doc => {
            data_sensors.push({...doc.data(), id:doc.id})
        });
    };

    return data_sensors;
};

/**
 * Func for get new data sensors with limit
 * @param {number} limit
 * @param {String} device_name
 */
module.exports.getDataSensorsByDesc = async (device_name, limit = 1) => {
    // get reference
    const reference = await getDeviceIdByName(device_name);

    // query DB
    const snapshot = await fireDB.collection('data_sensors').where('device_id', '==', reference).limit(limit).orderBy('created_at', 'desc').get();

    // store data
    let devices = [];

    // logic check
    if(snapshot.empty) {
        console.log(`oops data device not found`);
    } else {
        snapshot.forEach(doc => {
            devices.push({...doc.data(), id:doc.id})
        });
    }
    
    return devices
};

/**
 * Func for get all devices from DB
 */
module.exports.getAllDevices = async () => {
    // query DB
    const snapshot = await fireDB.collection('device').get();
    let devices = [];

    // condition check
    if(snapshot.empty) {
        console.log(`device not found in DB`);
        return devices;
    } else {
        snapshot.forEach(doc => {
            devices.push({...doc.data(), id:doc.id});
        })
    }

    return devices;
}

/**
 * Func for get all devices health from DB
 */
module.exports.getAllDevicesHealth = async () => {
    const snapshot = await fireDB.collection('device_health').get();
    let device_health = [];

    if(snapshot.empty) {
        return device_health;
    } else {
        snapshot.forEach(doc => {
            device_health.push({...doc.data(), device_health_id:doc.id});
        });
    }

    return device_health;
}

// (async () => {


// })();