
//
console.log( "MAP" );

// function count by key
function countByKey( jsonData , countKey ){
    
    // find all values
    let tempSet = {};
    for( i = 0; i < jsonData.length; i ++ ){
        let findValue = jsonData[i][countKey];
        if( findValue != null ){
            tempSet[ findValue ] = 1  ;
        }
    };

    let tempCount = {};
    // base set 0
    for( i in Object.keys( tempSet ) ){
        tempCount[ Object.keys( tempSet )[ i ] ] = 0 ;
    }

    // value counts
    for( i = 0; i < jsonData.length; i ++ ){
        let findValue = jsonData[i][countKey];
        if( findValue!= null ){
            tempCount[ findValue ] = tempCount[ findValue ] + 1 ;
        }
    };
    console.log("----------function countByKey:", tempCount);
    return tempCount;
};

// random selector
function generateRandom( max ) {
    min = 0
    // find diff
    let difference = max - min;
    // generate random number 
    let rand = Math.random();
    // multiply with difference 
    rand = Math.floor( rand * difference);
    // add with min value 
    rand = rand + min;
    return rand;
};

// Adding the tile layers
let esri_tile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

let topo_tile = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// let street_tile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// });

// Create a baseMaps object.
let baseMaps = {
    "Esri Map": esri_tile,
    "Topographic Map": topo_tile ,
    // "City Map" : street_tile
};

// Adding the group layers
// Initialize all the LayerGroups that we'll use.
var layers = {
    BC: new L.LayerGroup(),
    ADI: new L.LayerGroup(),
    ADII: new L.LayerGroup(),
    ADIII: new L.LayerGroup(),
    ADIV: new L.LayerGroup(),
    BOTH: new L.LayerGroup()
};
  
// Initialize an special icons. 
var leafIcon = {
    smallCat: L.Icon.extend({
        options: {
            iconSize:     [35, 35],
            iconAnchor:   [-15, 15]
        }
    }),

    bigCat: L.Icon.extend({
        options: {
            iconSize:     [45, 45],
            iconAnchor:   [-25 , 25]
        }
    }),

    smallDog: L.Icon.extend({
        options: {
            iconSize:     [35,35],
            iconAnchor:   [15, 15]
        }
    }),

    bigDog: L.Icon.extend({
        options: {
            iconSize:     [45, 45],
            iconAnchor:   [25, 25]
        }
    }),

    heart: L.Icon.extend({
        options: {
            iconSize:     [40, 50],
            iconAnchor:   [0, 40]
        }
    })
}

// Create the map with our layers.
let myMap = L.map("map", {
    center: [0, 0],
    zoom: 1,
    layers: [ esri_tile, layers.BC]
});

// Create an overlays object to add to the layer control.
let overlays = {
    "B.C.": layers.BC,
    "1st to 5th Century" :layers.ADI,
    "6th to 10th Century": layers.ADII,
    "11th to 15th Century": layers.ADIII,
    "16th to 20th Century": layers.ADIV,
    "Cats & Dogs" : layers.BOTH
};

// for later select
var layerName = {
    "B.C.": "BC",
    "1st to 5th Century" :"ADI",
    "6th to 10th Century": "ADII",
    "11th to 15th Century": "ADIII",
    "16th to 20th Century": "ADIV"
}
  
// Create a control for our layers, and add our overlays to it.
L.control.layers(
    baseMaps,
    overlays,
    {collapsed: false}
).addTo(myMap);

// data
let met_url = "https://raw.githubusercontent.com/Urja1529/Project-3/main/data/met_data.json"
let map_url = "https://raw.githubusercontent.com/Urja1529/Project-3/main/data/map_point.json";


d3.json(met_url).then(function(met_data){
    d3.json(map_url).then(function(map_data){

        // organize data, group by count
        // create set for yearCenturyMultiple
        let yearGroup = countByKey( met_data , "yearCenturyMultiple") ;
        let yearKeys = Object.keys(yearGroup) ;        
        console.log( "MAP yearKeys:" , yearKeys) ;

        // create set for geoCode
        let geoGroup = countByKey( met_data , "geoCode") ;
        let geoKeys = Object.keys(geoGroup) ;        
        console.log( "MAP geoKeys:" , geoKeys) ;
        
        // create set for team
        let teamGroup = countByKey( met_data , "team") ;        
        // add sum to team
        teamGroup[ "sum" ] = 0 ;
        let teamKeys = Object.keys(teamGroup) ;
        console.log( "MAP teamKeys:" , teamKeys) ;

        // group by [year][geo][team][value_counts]
        // base 0 {}
        let groupBy = {};
        for( i in yearKeys ){
            let keyone = yearKeys[i] ;
            groupBy[keyone] = {}  ;
            for( j in geoKeys ){
                let keytwo = geoKeys[j] ;
                groupBy[keyone][keytwo] = {}  ;
                for( k in teamKeys ){
                    let keythree = teamKeys[k] ;
                    groupBy[keyone][keytwo][keythree] = 0 ;
                }
            }
        }

        // value counts
        for( i in met_data ){
            let year = met_data[i]["yearCenturyMultiple"];
            let geo = met_data[i]["geoCode"] ;
            let team = met_data[i]["team"] ;
        
            if( year == null ){ // skip data with blank content
                console.log( "MAP" , year );
            }else if( geo == null ){
                console.log( "MAP", geo );
            }else if( team == null ){
                console.log( "MAP" , team );
            }else{
                groupBy[ year ][ geo ][ team ] = groupBy[ year ][ geo ][ team ] + 1 ; 
            }
        }

        //add sum
        for( i in yearKeys ){
            let keyone = yearKeys[i] ;
            for( j in geoKeys ){
                let keytwo = geoKeys[j] ;                
                let tempSum = 0;
                for( k in Object.keys(teamGroup) ){
                    let keythree = teamKeys[k] ;
                    tempSum = tempSum + groupBy[keyone][keytwo][keythree] ;
                }
                groupBy[keyone][keytwo]["sum"] = tempSum ;
            }
        }
        
        console.log( "MAP groupBy count:", groupBy);

        // add data to map
        // select data by drowdown year . Layer of the map
        // check each location on map
        // if a location has team count > 0 then add icon.
        // if dog > cat then use bigDog

        for( j in yearKeys ){

            let selectYear = yearKeys[j] ;
            // console.log(selectYear) ;
            let selectCount = groupBy[selectYear] ;
            // console.log( "MAP selectCount:" , selectCount );

            let selectLayer = layerName[selectYear] ;
            
            for( geo in map_data ){

                // i = c_n
                let tempGeo = map_data[ geo ] ; // lat, lon

                // console.log(selectCount[ tempGeo ][ "sum" ]);
                if( selectCount[ geo ][ "sum" ] > 0 ){

                    // add set Icon
                    // random for file
                    let catN = generateRandom( 6 ) + 1 ;
                    let dogN = generateRandom( 6 ) + 1 ;

                    // icon size
                    if( selectCount[ geo ][ "cat" ] > selectCount[ geo ][ "dog" ] ){
                        var catIcon = new leafIcon.bigCat( {iconUrl: `img/cat_${catN}.png`} ) ;
                        var dogIcon = new leafIcon.smallDog( {iconUrl: `img/dog_${dogN}.png`} )  ;

                    }else if( selectCount[ geo ][ "cat" ] < selectCount[ geo ][ "dog" ] ){
                        var catIcon = new leafIcon.smallCat( {iconUrl: `img/cat_${catN}.png`} )  ;
                        var dogIcon = new leafIcon.bigDog( {iconUrl: `img/dog_${dogN}.png`} )  ;

                    }else{
                        var catIcon = new leafIcon.smallCat( {iconUrl: `img/cat_${catN}.png`} )  ;
                        var dogIcon = new leafIcon.smallDog( {iconUrl: `img/dog_${dogN}.png`} )  ;
                    }

                    var heartIcon = new leafIcon.heart( { iconUrl: 'img/heart.png' } ) ;
                    
                    // one object image for each marker
                    var fullGroup = met_data.filter( item => item.yearCenturyMultiple == selectYear ).filter( item => item.geoCode == geo )

                    function oneObject(team ){

                        let textObject = fullGroup.filter(item => item.team == team ) ; // objects has at least text
                        let imageObject = textObject.filter(item => item.isImage ) ; // has image
                        let bestObject = imageObject.filter( item => item.isHighlight) ; // has image and important

                        if( bestObject.length > 0 ){ // then select a random object
                            let tempN = generateRandom( bestObject.length ) ;
                            var popupObject = bestObject[ tempN ] ; 
                        }else if( imageObject.length > 0 ){ // next best choice
                            let tempN = generateRandom( imageObject.length ) ;
                            var popupObject = imageObject[ tempN ] ; 
                        }else{
                            let tempN = generateRandom( textObject.length ) ;
                            var popupObject = textObject[ tempN ] ; 
                        }

                        tempCulture = [ popupObject.artist, popupObject.region, popupObject.culture] ;
                        tempC = [] ;
                        tempCtext = "" ;
                        j = 0;
                        for( j in tempCulture ){
                            if( tempCulture[j].length == 0 ){
                            }else if( !( tempCulture[j] in tempC ) ){
                                tempC[tempC.length] = tempCulture[j];
                                if( tempCtext.length == 0){ 
                                    tempP = "" ; 
                                }else{
                                    tempP = ", " ;
                                }; 
                                tempCtext = tempCtext + tempP + tempCulture[j] ;
                            };
                        };

                        if( popupObject.objectImage == "" ){ // add img html if the image exist
                            var picLine = "" ;
                        }else{
                            var picLine = `<img src="${popupObject.objectImage}" alt="${popupObject.title}" style="max-width:150px;max-height:150px;" >` ;
                        }

                        var popupHTML = `<p class="popupheader" ><a href="${popupObject.objectURL}">Title: ${popupObject.title}</a></p >
                        <p class="popup" >Date: ${ popupObject.year + ", "+ popupObject.yearCentury}</p>
                        <p class="popup" >From: ${tempCtext}</p>
                        ${picLine}`

                        return popupHTML ;
                    }

                    // when count > 0, add marker

                    if( selectCount[ geo ][ "both" ] > 0 ){
                        let heartMarker = L.marker( [ tempGeo["latitude"] , tempGeo["longitude"] ] , {
                            icon:  heartIcon
                        });
                        heartMarker.addTo( layers[ selectLayer ] ).bindPopup( oneObject("both") );
                        // add to another layer as well, difficult to click
                        heartMarker.addTo( layers[ "BOTH" ] ).bindPopup( oneObject("both") );
                    }

                    if( selectCount[ geo ][ "cat" ] > 0 ){

                        let catMarker = L.marker( [ tempGeo["latitude"] , tempGeo["longitude"] ] , {
                            icon: catIcon
                        });
                        catMarker.addTo( layers[ selectLayer ] ).bindPopup( oneObject("cat") ) ;
                    }

                    if( selectCount[ geo ][ "dog" ] > 0 ){
                        let dogMarker = L.marker( [ tempGeo["latitude"] , tempGeo["longitude"] ] , {
                            icon: dogIcon
                        });
                        dogMarker.addTo( layers[ selectLayer ] ).bindPopup( oneObject("dog") );
                    }

                }
            }

        }
        

    });
});
