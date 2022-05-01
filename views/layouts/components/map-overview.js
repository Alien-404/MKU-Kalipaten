const map = L.map('map').setView([-6.228902040320491, 106.6316989921065], 16);
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Pradita University'
}).addTo(map);

// get data from firebase
const dataGeoJSON = <%- JSON.stringify(data_info.dataGeo[0]) %>

// config the circle style
function style() {
    return {
        fillColor: '#3740CA',
        radius: 15,
        weight: 0.1,
        opacity: 1,
        fillOpacity: 1
    };
}

// each dot on click
function onEachFeature(feature, layer) {
    const popup = L.responsivePopup({ hasTip: false }).setContent(`<p class="font-modern">${feature.properties.device_name}</p>`);
    layer.bindPopup(popup);
}

L.geoJSON(dataGeoJSON, {
    onEachFeature,
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, style())
    }
}).addTo(map);
