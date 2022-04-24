const {getAllDevices, getDataSensorsByDesc, getDeviceHealthIdByDeviceName} = require('./fetching');
const fireDB = require('../config/firebase/config');
const { FieldValue } = require('firebase-admin/firestore');
const moment = require('moment');

// (async () => {

// })();

module.exports.UpdatingDeviceHealth = async () => {
    const devices = await getAllDevices();
    
    devices.forEach(async device => {
        const data_sensors = await getDataSensorsByDesc(device.device_name);

        const milisDate = data_sensors[0].created_at._seconds * 1000;
        const sensors_date = moment(milisDate).toDate();

        // rule status and connection 
        const hours = moment().subtract(3, 'hours').toDate();
        const days = moment().subtract(1, 'days').toDate();

        if(sensors_date < days) {
            // get device health id first
            const device_health_id = await getDeviceHealthIdByDeviceName(device.device_name);

            // set firedb doc
            const healthRef = fireDB.collection('device_health').doc(device_health_id[0].device_health_id);

            const res = await healthRef.update({
                status: false,
                connection: false,
                updated_at: FieldValue.serverTimestamp()
            });

        } else if(sensors_date < hours) {
            // get device health id first
            const device_health_id = await getDeviceHealthIdByDeviceName(device.device_name);

            // set firedb doc
            const healthRef = fireDB.collection('device_health').doc(device_health_id[0].device_health_id);

            const res = await healthRef.update({
                status: true,
                connection: false,
                updated_at: FieldValue.serverTimestamp()
            });
        }
    })
}