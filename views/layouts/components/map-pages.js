const map = L.map('map').setView([-6.228976732651597, 106.62777225140692], 16);
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Pradita University'
}).addTo(map);

// get data from firebase
const dataGeo = <%- JSON.stringify(map_info[0]) %>;

// get color as indeks
function getColor(d) {

    return d > 300 ? '#a06a7b' :
           d > 200  ? '#a070b6' :
           d > 101  ? '#FF6464' :
           d > 51  ? '#FFE162' :
           d > 0   ? '#8BDB81' :
                      '#3740CA';
}

// get icon 
function getIcon(d) {
    let uri = '';
    switch (d.toLowerCase()) {
        case 'good':
            uri += '/img/air_quality/good.svg';
            break;
        case 'moderate':
            uri += '/img/air_quality/moderate.svg';
            break;
        case 'unhealthy':
            uri += '/img/air_quality/unhealthy.svg';
            break;
        case 'very unhealthy':
            uri += '/img/air_quality/very-unhealthy.svg';
            break;
        case 'dangerous':
            uri += '/img/air_quality/dangerous.svg';
            break;
        default:
            break;
    }
    return uri;
}

// config the circle style
function style(feature) {
    return {
        fillColor: getColor(feature.properties.data_sensors.PM10.value),
        color: '#000',
        radius: 15,
        weight: 0.9,
        opacity: 1,
        fillOpacity: 1
    };
}

// change element with dom
function domSide(e) {
    $('.device-name').text(e.target.feature.properties.device_name);
    $('.device-location').text(e.target.feature.properties.device_location_name);

    // title
    const condition = e.target.feature.properties.condition.toLowerCase();
    switch (condition) {
        case 'good':
            $('.title').text(`Clean Air!`);
            $('.sub-title').text(`Today's air is still acceptable and breathable by most people, not so bad!`);
            $('.cover-svg').attr('src', '/img/air_quality/good.svg');
            break;
        case 'moderate':
            $('.title').text(`Pretty Good!`);
            $('.sub-title').text(`Today's air is still acceptable and breathable by most people, not so bad!`);
            $('.cover-svg').attr('src', '/img/air_quality/moderate.svg');
            break;
        case 'unhealthy':
            $('.title').text(`Polluted Air!`);
            $('.sub-title').text(`Today's air is quite bad. You may experience health effects if you continue to be exposed to the surrounding air!`);
            $('.cover-svg').attr('src', '/img/air_quality/unhealthy.svg');
            break;
        case 'very unhealthy':
            $('.title').text(`Unacceptable Air!`);
            $('.sub-title').text(`The air here is mostly polluted, it is not recommended to leave the house or approach the surrounding area!`);
            $('.cover-svg').attr('src', '/img/air_quality/very-unhealthy.svg');
            break;
        case 'dangerous':
            $('.title').text(`Hazardous Air!`);
            $('.sub-title').text(`Everyone without exception may experience more serious health effects if they continue to be here!`);
            $('.cover-svg').attr('src', '/img/air_quality/dangerous.svg');
            break;
        default:
            break;
    }

    // sensors
    $('.pm10').text(e.target.feature.properties.data_sensors.PM10.value);
    $('.co2').text(e.target.feature.properties.data_sensors.CO2.value);
    $('.temperature').text(e.target.feature.properties.data_sensors.Temperature.value);
    $('.humidity').text(e.target.feature.properties.data_sensors.Humidity.value);

    // detail time
    $('.updated-at').text(e.target.feature.properties.created_at);
}

// each dot on click
function onEachFeature(feature, layer) {
    layer.on('click', domSide);
    const properties = feature.properties;
    const popup = L.responsivePopup({ hasTip: false }).setContent(`<div class="max-w-md px-4 py-2 mx-auto rounded-lg text-slate-100 divide-y font-modern">
	<div class="my-4 border-b-2">
        <h3 class="text-base my-2 text-slate-500">${properties.device_location_name}</h3>
    </div>
	<div class="flex justify-between space-x-8 bg-[${getColor(properties.data_sensors.PM10.value)}] rounded-md p-2">
        <div class="flex flex-col items-center">
            <img src="${getIcon(properties.condition)}"  alt="very good air quality" class="h-12 w-12">
        </div>
		<span class="font-bold text-base my-auto text-white">${properties.data_sensors.PM10.value} - ${properties.condition}</span>
	</div>
	<div class="flex justify-between mt-8 space-x-4 text-slate-400">
		<div class="flex flex-col items-center space-y-1">
			<span class="uppercase">CO2</span>
            <img src="/img/icons/prime/co2.svg" alt="pm10 icon" class="h-8 w-8">
			<span>${properties.data_sensors.CO2.value} ppm</span>
		</div>
		<div class="flex flex-col items-center space-y-1">
			<span class="uppercase">Temperature</span>
            <img src="/img/icons/prime/temperature.svg" alt="pm10 icon" class="h-8 w-8">
			<span>${properties.data_sensors.Temperature.value}°</span>
		</div>
		<div class="flex flex-col items-center space-y-1">
			<span class="uppercase">Humidity</span>
			<img src="/img/icons/prime/humidity.svg" alt="pm10 icon" class="h-8 w-8">
			<span>${properties.data_sensors.Humidity.value}%</span>
		</div>
	</div>
    <div class="my-4">
        <h3 class="text-xs my-2 text-slate-400">updated-at : ${properties.created_at}</h3>
    </div>
</div>`);
    layer.bindPopup(popup, {className: "popup-maps"});
}

L.geoJSON(dataGeo, {
    onEachFeature,
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, style(feature))
    }
}).addTo(map);