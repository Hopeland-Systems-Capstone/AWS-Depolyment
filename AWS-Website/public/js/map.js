var map = L.map('map').setView([33.5, -112.5], 9);

const initialize = async () => {

  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  
  query = `/users/:user_id/sensors`

  //Pass the query and user's token into the /data route
  const response = await fetch('/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token, query })
  });
  
  const sensors = await response.json();

  sensors.forEach(async sensor => {
  
    query = `/sensors/${sensor}`
    
    const response = await fetch('/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, query })
    });

    createMarker(await response.json());
  });
}

//accepts sensor data structure and creates a marker on the map for that sensor
function createMarker(sensor) {

  var latlng;

  try {
    
    //latitude and longitude are swapped between API and Leaflet
    var temp_latlng = sensor.geolocation.coordinates;
    latlng = [temp_latlng[1],temp_latlng[0]]

    var sensorIcon;
    if (sensor.status === "Online") {
      if (sensor.type == "Forest") sensorIcon = forestOnlineIcon;
      if (sensor.type == "Flood") sensorIcon = floodOnlineIcon;
      if (sensor.type == "Gateway") sensorIcon = gatewayOnlineIcon;
    }
    else {
      if (sensor.type == "Forest") sensorIcon = forestOfflineIcon;
      if (sensor.type == "Flood") sensorIcon = floodOfflineIcon;
      if (sensor.type == "Gateway") sensorIcon = gatewayOfflineIcon;
    }

    var marker = new customMarker(latlng, {icon: sensorIcon}).addTo(map);
    var popuptext = markerMouseOverGenerate(sensor);
    var popup = new L.popup({ offset:[0,15] }).setContent(popuptext);
    marker.bindPopup(popup, { showOnMouseOver: true, maxWidth: 500 });

    return marker;
  }
  catch (error) {
    console.log(error);
  }
}

map.on('moveend', initialize);

//In Leaflet, Tooltips that appear when hovering over Markers work a bit stupidly: 
//Moving your mouse ONTO the Tooltip causes it to go away. This customMarker extention of the default
//Marker behavior fixes that
var customMarker = L.Marker.extend({
  
  bindPopup: function(htmlContent, options) {

    if (options && options.showOnMouseOver) {
      L.Marker.prototype.bindPopup.apply(this, [htmlContent, options]);
      this.off("click",this.openPopup, this);
      this.on("mouseover", function(e) {
        var target = e.originalEvent.fromElement || e.originalEvent.relatedTarget;
        var parent = this._getParent(target, "leaflet-popup");

        if (parent == this._popup._container)
          return true;

        this.openPopup();
      }, this);

      this.on("mouseout", function(e) {
        var target = e.originalEvent.toElement || e.originalEvent.relatedTarget;

        if (this._getParent(target, "leaflet-popup")) {
          L.DomEvent.on(this._popup._container, "mouseout", this._popupMouseOut, this);
          return true;
        }
        this.closePopup();
      }, this);
    }
  },

  _popupMouseOut: function(e) {
    L.DomEvent.off(this._popup, "mouseout", this._popupMouseOut, this);
    var target = e.toElement || e.relatedTarget;
    if (this._getParent(target, "leaflet-popup")) return true;
    if (target == this._icon) return true;

    this.closePopup();
  },

  _getParent: function(element, className) {
    var parent = element.parentNode;
    while(parent != null) {
      if (parent.className && L.DomUtil.hasClass(parent, className)) return parent;
      parent = parent.parentNode;
    }

    return false;
  }
});

//Currently, the map layer is being provided by OpenStreetMap.
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/*
The icons for markers are roughly based off the ones in the Figma.
TODO: 
  Edit icons to make sure they are consistent with the Figma.
  Make sure popup behavior is acceptable.
*/
var DeviceIcon = L.Icon.extend({
  options: {
    iconSize: [37,68],
    iconAnchor: [17,60],
    popupAnchor: [17,-10]
  }
});

var forestOnlineIcon = new DeviceIcon({iconUrl: './images/map/forest-online.png'}),
    forestOfflineIcon = new DeviceIcon({iconUrl: './images/map/forest-offline.png'}),
    floodOnlineIcon = new DeviceIcon({iconUrl: './images/map/flood-online.png'}),
    floodOfflineIcon = new DeviceIcon({iconUrl: './images/map/flood-offline.png'}),
    gatewayOnlineIcon = new DeviceIcon({iconUrl: './images/map/gateway-online.png'}),
    gatewayOfflineIcon = new DeviceIcon({iconUrl: './images/map/gateway-offline.png'});


function markerMouseOverGenerate(sensor) {
  const battery = Math.round(sensor.battery.at(-1)?.value ?? 100);
  const co2 = Math.round(sensor.co2.at(-1).value);
  const temperature = Math.round(sensor.temperature.at(-1).value*100)/100;
  const humidity = Math.round(sensor.humidity.at(-1).value*10)/10;
  const pressure = Math.round(sensor.pressure.at(-1).value);

  return (
    `<div class='markerHoverBox'>
      <div class='markerHoverBoxDeviceName'>
        <h5>${sensor.name} - ${sensor.type}</h5>
      </div>
      <div class='markerHoverBoxDeviceInfo'>
        <div class='markerHoverBoxDeviceStatus'>
          <b>Data</b><br>
          Battery: <span class="device-detail">${battery}%</span><br>
          Temperature: <span class="device-detail">${temperature}C </span><br>
          CO2: <span class="device-detail">${co2} ppm</span><br>
          Humidity: <span class="device-detail">${humidity}%</span><br>
          Barometric Pressure: <span class="device-detail">${pressure} hPa</span><br>
        </div>
      </div>
    </div>`
  );
}

window.onload = initialize;
