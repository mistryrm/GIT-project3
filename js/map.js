

var myMap = L.map('map').setView([0, 0], 2);

// Define base tile layers
let street_tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let esri_tile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

let topo_tile = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Define baseLayers object
var baseLayers = {
    "Street": street_tile,
    "Satellite": esri_tile,
    "Topographic": topo_tile
};


let met_url = "https://raw.githubusercontent.com/Urja1529/Project-3/main/data/met_data.json"
let map_url = "https://raw.githubusercontent.com/Urja1529/Project-3/main/data/map_point.json";


// Fetch JSON data for MET data
Promise.all([
    d3.json(met_url),
    d3.json(map_url)
]).then(function([met_data, map_data]) {
    console.log(met_data);
    console.log(map_data);

    // Add latitude and longitude information to met_data using the geoCode
    met_data.forEach(function(item) {
        var geoCode = item.geoCode;
        var location = map_data[geoCode];
        if (location) {
            item.latitude = location.latitude;
            item.longitude = location.longitude;
        } else {
            console.log('Location not found for geoCode:', geoCode);
        }
    });

    // Group data by team
    var groupedData = {
        cat: [],
        dog: [],
        both: []
    };
    met_data.forEach(function(item) {
        var team = item.team;
        groupedData[team].push(item);
    });

    // Define custom icons for Cat, Dog, and Both
    var catIcon = L.icon({
        iconUrl: 'img/cat_6.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
    });
    var dogIcon = L.icon({
        iconUrl: 'img/dog_3.png',
        iconSize: [32, 32],
        iconAnchor: [-16, 32]
    });
    var bothIcon = L.icon({
        iconUrl: 'img/heart.png',
        iconSize: [32, 32],
        iconAnchor: [0, 50]
    });

    // Define overlays using the provided object
    var layers = {
        BC: new L.LayerGroup(),
        ADI: new L.LayerGroup(),
        ADII: new L.LayerGroup(),
        ADIII: new L.LayerGroup(),
        ADIV: new L.LayerGroup(),
        BOTH: new L.LayerGroup()
    };

    var overlays = {
        "B.C.": layers.BC,
        "1st to 5th Century": layers.ADI,
        "6th to 10th Century": layers.ADII,
        "11th to 15th Century": layers.ADIII,
        "16th to 21st Century": layers.ADIV,
        // "Cats & Dogs": layers.BOTH
    };
    console.log('Overlays:', overlays);
    // Loop through each team in the groupedData
    for (var team in groupedData) {
        var teamData = groupedData[team];
        console.log(team + ' data:', teamData);
        // Loop through the items in the teamData array
        teamData.forEach(function(item) {
            if (item.latitude !== undefined && item.longitude !== undefined) {
                var latitude = item.latitude;
                var longitude = item.longitude;
                var yearCenturyMultiple = item.yearCenturyMultiple;
    
                var icon;
                if (team === 'cat') {
                    icon = catIcon;
                } else if (team === 'dog') {
                    icon = dogIcon;
                } else {
                    icon = bothIcon;
                }
    
                var marker = L.marker([latitude, longitude], { icon: icon });
    
                // Call the function to set popup content
                setPopupContent(marker, item);
    
                // Add marker to the appropriate overlay layer
                overlays[yearCenturyMultiple].addLayer(marker);
            }
        });
    }

    // Add the overlays to the map
    // for (var key in overlays) {
    //     overlays[key].addTo(myMap);
    // }
    overlays['B.C.'].addTo(myMap);

    // Add the default esri_tile layer to the map
    esri_tile.addTo(myMap);

    // Add overlay layers control to the map
    L.control.layers(baseLayers, overlays, {
        collapsed: false
    }).addTo(myMap);
});
function setPopupContent(marker, item) {
        let tempCulture = [item.artist, item.region, item.culture];
        let tempC = [];
        let tempCtext = "";
        let j = 0;
        for (j in tempCulture) {
            if (tempCulture[j].length > 0) {
                if (!(tempCulture[j] in tempC)) {
                    tempC[tempC.length] = tempCulture[j];
                    if (tempCtext.length == 0) {
                        tempP = "";
                    } else {
                        tempP = ", ";
                    }
                    tempCtext = tempCtext + tempP + tempCulture[j];
                }
            }
        }
    
        // Additional data for the popup
        var yearCenturyMultiple = item.yearCenturyMultiple || "";
        var country = item.country || "";
        var yearDecade = item.yearDecade || "";
        var objectImage = item.objectImage ? `<img src="${item.objectImage}" alt="Object Image" style="max-width: 100px;">` : "";
    
        // Set the content of the popup
        var popupContent = `
            <b>Team: ${item.team}</b><br>
            ${tempCtext}<br>
            Year Century Multiple: ${yearCenturyMultiple}<br>
            Country: ${country}<br>
            Year Decade: ${yearDecade}<br>
            ${objectImage}
            <!-- Other information you want to display in the popup -->
        `;
    
        // Bind the content to the marker's popup
        marker.bindPopup(popupContent);
        
    }
    