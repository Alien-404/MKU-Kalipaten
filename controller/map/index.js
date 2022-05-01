const {geoJSON} = require('../../models/geojson');

module.exports.mapInfo = async () => {
    // get data
    const dataGeo = await geoJSON();

    // logic check
    if(dataGeo.length > 0){
        return dataGeo;
    }
}