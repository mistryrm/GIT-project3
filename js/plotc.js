
// function count by key
function countByKey( jsonData , countKey ){
    // json = [ {} , {} ]
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

// line for import and not 
function rangeSearch(){
    d3.json(met_url).then(function(met_data){

        let idHigh = d3.select("#highLight").property("value");
        let fromY = d3.select("#from").property("value") ;
        let toY = d3.select("#to").property("value") ;

        if( idHigh == "true" ){
            var isHigh = true;
            var selectData = met_data.filter( object => object.isHighlight == isHigh ).filter( object => object.year >= fromY ).filter(object => object.year <= toY );
        }else if( idHigh == "false" ){
            var isHigh = false;
            var selectData = met_data.filter( object => object.isHighlight == isHigh ).filter( object => object.year >= fromY ).filter(object => object.year <= toY );
        }else{
            var selectData = met_data.filter( object => object.year >= fromY ).filter(object => object.year <= toY );
        }

        console.log("PC BAR selectData:", selectData);

        // group by for yearcentry
        let yearGroup = countByKey( selectData, "yearCentury" );
        let yearKeys = Object.keys( yearGroup );

        
        // create set for team
        let teamGroup = countByKey( selectData , "team") ;        
        // add sum to team
        teamGroup[ "sum" ] = 0 ;
        let teamKeys = Object.keys(teamGroup) ;
        console.log( "PC BAR teamKeys:" , teamKeys) ;

        // group by [year][team][value_counts]
        // base 0 {}
        let groupBy = {};
        for( i in yearKeys ){
            let keyone = yearKeys[i] ;
            groupBy[keyone] = {}  ;
            for( j in teamKeys ){
                let keytwo = teamKeys[j] ;
                groupBy[keyone][keytwo] = 0 ;
            }
        }
        console.log( "PC BAR initial:", groupBy) ;
        // value counts
        for( i in selectData ){
            let year = selectData[i]["yearCentury"];
            let team = selectData[i]["team"] ;
        
            if( year == null ){ // skip data with blank content
                console.log( "PC BAR:" , year );
            }else if( team == null ){
                console.log( "PC BAR:" , team );
            }else{
                groupBy[ year ][ team ] = groupBy[ year ][ team ] + 1 ; // sum doesn't exist in selectData object info, will keep as 0
            }
        }

        //add sum
        for( i in yearKeys ){
            let keyone = yearKeys[i] ;            
            let tempSum = 0;
            for( j in teamKeys ){
                let keytwo = teamKeys[j] ;
                tempSum = tempSum + groupBy[keyone][keytwo];
            }
            groupBy[keyone]["sum"] = tempSum ;
        }
        
        console.log( "PC BAR groupBy count:", groupBy);

        // switch strchture to mach plot

        // var traceCAT = {
        //     y: [ yearCenture listed by yearCentryInt - yearName
        //     x: [ count of the yearCentry - catCount
        //     name: 'Cat',
        //     type: 'bar' ,
        //     marker:{
        //         color: "#" }
        // };

        // sort out right alpabatic order of the year
        let yearIntSort = selectData.sort( ( a, b ) => a.yearCenturyInt - b.yearCenturyInt ) 
        console.log( "PC BAR year sort:", yearIntSort) ;

        // extrack yearCenturyInt and yearCentury as strcture
        // structure = { 0 : { numInt : yearCenturyInt , nameStr : yearCentury } ...
        let yearList = []
        let initStr = "" ;
        j = 0 ;
        for( i in selectData ){
            
            tempObject = selectData[i]

            if( tempObject.yearCentury != null ){
                if( tempObject.yearCentury != initStr ){
                    
                    yearList[ j ] = {
                        "numInt" : tempObject.yearCenturyInt,
                        "nameStr" : tempObject.yearCentury
                    }

                    j += 1 ;
                    initStr = tempObject.yearCentury ;
                }
            }
        } 

        console.log( "PC BAR yearList:" , yearList ) ;

        let nameGroup = countByKey( yearList , "nameStr" ) ;
        let yearName = Object.keys( nameGroup );
        console.log( "PC BAR yearName:" , yearName ) ;

        //setup bar value : pick year by yearName which is alreayd sorted, use value from groupBy = year.team.value_count
        let catBar = [] ;
        let bothBar = [] ;
        let dogBar = [] ;

        for( i in yearName ){ // sum = 0 data doesn't exist on this list. since yearName is sorted based on exist objects
            // pick the year
            let year = yearName[i]
            let yearCount = groupBy[ year ] ;

            catBar[i] = yearCount.cat ;
            bothBar[i] = yearCount.both ;
            dogBar[i] = yearCount.dog ;
        }

        // plot data
        // vertical
        var traceCat = {
            x: yearName, 
            y: catBar ,
            name: 'Cat', 
            type: 'bar' ,
            marker:{
                color: "#C84F56" }
        };

        var traceBoth = {
            x: yearName,
            y: bothBar ,
            name: 'Cat & Dog',
            type: 'bar',
            marker:{
                color: "#E9BE68" }
        };

        var traceDog = {
            x: yearName,
            y: dogBar , 
            name: 'Dog',
            type: 'bar',
            marker:{
                color: "#52C5CA" }
        };

        var data = [traceCat, traceBoth , traceDog];

        var layout = {
            
            showlegend: true,
            // margin: {
            //     l: 10,
            //     r: 30,
            //     b: 50,
            //     t: 70,
            //     pad:10
            //   },

            title: {
                text : "Important Object of Cat & Dog</br></br>Objects from The Metropolitan Museum of Art" ,
                font : {
                    family: "Helvetica",
                    size: 14,
                    color: "#52C5CA"
                }
            },
            xaxis: {
                title: {
                    text: 'Century',
                    font: {
                    family: 'Helvetica',
                    size: 12,
                    color: '#E9BE68'
                    }
                },
                },

                yaxis: {
                automargin: true,
                title: {
                    text: 'Object Count',
                    font: {
                    family: 'Helvetica',
                    size: 12,
                    color: '#E9BE68'
                    }
                }
                }
        };

        Plotly.newPlot('plotc', data, layout);

    });
}

rangeSearch();











