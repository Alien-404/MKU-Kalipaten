const {getAllDevices, getAllDevicesHealth} = require('../../models/fetching');
const _ = require('lodash');

// (async () => {

// })();

module.exports.sensors_list = async () => {
    // get two data from DB
    const [data_device_health, data_devices] = await Promise.allSettled([getAllDevicesHealth(), getAllDevices()]);

    // check
    if(data_device_health.status == 'fulfilled' && data_devices.status == 'fulfilled') {
        const device_health = data_device_health.value;
        const devices = data_devices.value;

        if(device_health.length > 0 && devices.length > 0) {
            // merge data by device_id
            const merged_data = _(devices).keyBy('id').merge(_.keyBy(device_health, 'device_id.id')).values().value();
            return merged_data;
        } else {
            // create dummy data
            const merged_data = [
                {
                    sensors: [],
                    device_name: 'No device',
                    id: null,
                    status: false,
                    connection: false
                }
            ];
            return merged_data;
        }
    } else {
        console.log(`promises rejected`);
    }
}