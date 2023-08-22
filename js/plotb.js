// time line. refresh when click suprise me

// let met_url = "https://raw.githubusercontent.com/Urja1529/Project-3/main/data/met_data.json"
// let map_url = "https://raw.githubusercontent.com/Urja1529/Project-3/main/data/map_point.json";

// everytime when click suppise me, add new group of picture to timeline
// random pike team -> cat or dog, both don't have enough data
// then pick geoCode
// find one object in each 500 year range
// less than 5 object then select random without year limit
// reorder the object by year
// add div to html

    // when refresh clean div
function timeLine(){
    document.getElementById("plotb").innerHTML = "";

    d3.json(met_url).then(function(met_data){

        // console.log(met_data);
        d3.json(map_url).then(function(map_data){

            // drop object has no image
            let imageTrue = met_data.filter( metObject =>metObject.isImage ) ;

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
            
            // create set for team
            let teamGroup = ['cat' , 'dog'];

            // pick a random team
            let teamRandom = teamGroup[generateRandom( teamGroup.length )] ;
            console.log( "PB TIMEL teamSelect:" , teamRandom );

            let teamItems = imageTrue.filter( metObject =>metObject.team === teamRandom ) ;
            console.log( "PB TIMEL teamFilter:", teamItems);

            // keep geoCode with more than 50 count
            let geoGroup =  Object.keys(map_data);
            // base group
            let geoCount = {};
            for( geo in geoGroup ){
                geoCount[ geoGroup[geo] ] = 0;
            };

            // count each geo in this filtered data
            for( one in teamItems ){
                geoCount[ teamItems[one].geoCode ] += 1 ;
            };
            console.log( "PB TIMEL geoCount:" , geoCount );
            
            // filter out location > 20 objects
            let geoFinal = [];
            j = 0;
            for( geo in geoCount ){
                if( geoCount[ geo ] > 20 ){
                    geoFinal[j] = geo ;
                    j += 1;
                };
            };
            console.log("PB TIMEL geoFinal:" , geoFinal );

            // pick a random geo area
            let geoRandom = geoFinal[generateRandom( geoFinal.length )] ;
            console.log( "PB TIMEL geoSelect:" , geoRandom );

            let geoItems = teamItems.filter( metObject => metObject.geoCode === geoRandom ) ;
            console.log( "PB TIMEL geoFilter:", geoItems);

            // create set for yearCenturyMultiple
            let yearGroup = {};

            for( i = 0; i < met_data.length; i ++ ){
                let year = met_data[i]['yearCenturyMultiple'] ;
                if (!(year in yearGroup )) {
                    yearGroup[ year ] = 1;
                };
            };

            console.log( "PB TIMEL yearGroup:" , yearGroup) ;

            // pick one item for each yearGroup
            j = 0 ;
            let objectSeleted = [] ;

            for( year in yearGroup ){

                let yearObject = geoItems.filter( metObject => metObject.yearCenturyMultiple === year ) ;
                let oneObject = yearObject[ generateRandom(yearObject.length) ] ;
                
                if( oneObject != null ){ // skip undifined, na return from year selecting
                    objectSeleted[j] = oneObject ;
                    j += 1;
                };
            }

            // when selected objects is less than 5
            if( objectSeleted.length < 5 ){

                // remove selecte objects
                for( i=0; i < objectSeleted.length ; i++ ){
                    geoItems = geoItems.filter( metObject => metObject.objectID != objectSeleted[i].objectID ) ;
                };

                // reapeat select till find 5 objects
                while( objectSeleted.length < 5){
                    let oneObject = geoItems[ generateRandom(geoItems.length) ] ;
                    objectSeleted[j] = oneObject ;
                    geoItems = geoItems.filter( metObject => metObject.objectID != objectSeleted[i].objectID ) ;
                    j += 1;
                }
            };

            console.log( "PB TIMEL objectSeleted" , objectSeleted );

            // sort the selected items
            // collect years, sort year
            let yearSort = [];
            j = 0 ;
            for( i = 0; i <objectSeleted.length; i ++ ){
                let year = objectSeleted[i]['year'] ;
                if (!(year in yearSort )) {
                    yearSort[ j ] = year;
                    j++ ;
                };
            };
            
            // sort years
            yearSort.sort((firstNum, secondNum) => firstNum - secondNum);
            console.log( "PB TIMEL yearSort" , yearSort );

            // order objets by years only use unique value
            let objectSort = [];
            j = 0;
            for( i in yearSort ){
                if( i==0 ){ // run first number
                    tempYear = yearSort[i] ;
                    let yearOne = objectSeleted.filter( metObject => metObject.year === yearSort[i] ) ;
                    for( one in yearOne ){
                        objectSort[j] = yearOne[one];
                        j ++ ;
                    }
                }else if( yearSort[i] !== tempYear ){ // if next is same as preivous year, then skip
                    tempYear = yearSort[i] ;
                    let yearOne = objectSeleted.filter( metObject => metObject.year === yearSort[i] ) ;
                    for( one in yearOne ){
                        objectSort[j] = yearOne[one];
                        j ++ ;
                    }
                };
            };

            console.log( "PB TIMEL objectSort:" , objectSort );

            // html for the timeline
            function htmlCreater( tempObject ){

                tempCulture = [ tempObject.artist, tempObject.region, tempObject.culture] ;
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

                tempHTML = `
                <div class="container right">
                <div class="content">
                    <h4><a href="${tempObject.objectURL}">Title: ${tempObject.title}</a></h4>
                    <p>Date: ${ tempObject.year + ", "+ tempObject.yearCentury}</p>
                    <p>From: ${tempCtext}</p>
                    <p>Medium: ${tempObject.medium}</p>
                    <img src="${tempObject.objectImage}" alt="${tempObject.title}" style="max-width:200px;max-height:200px;" >
                </div>
                </div>`;

                return tempHTML ;

            };

            let htmlText = "" ;
            for( i in objectSort ){
                let tempObject = objectSort[i] ;
                htmlText = htmlText + htmlCreater( tempObject ) ;
            }

            // console.log(htmlText) ;

            // add content by id 
            document.getElementById("plotb").innerHTML += `<div class="timeline">
            ${htmlText}
            </div>`
        });

    });
};

timeLine();