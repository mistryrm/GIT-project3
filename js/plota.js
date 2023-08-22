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
  
  
url_met = "https://raw.githubusercontent.com/Urja1529/Project-3/main/data/met_data.json";

d3.json(url_met).then(function(fetcheddata) {
console.log("museum:", fetcheddata);

    // group by for yearcentry
    let yearGroup = countByKey( fetcheddata, "yearCentury" );
    let yearKeys = Object.keys( yearGroup );

    
    // create set for team
    let teamGroup = countByKey( fetcheddata , "team") ;        
    // add sum to team
    teamGroup[ "sum" ] = 0 ;
    let teamKeys = Object.keys(teamGroup) ;
    console.log( "PA BAR teamKeys:" , teamKeys) ;

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

    // value counts
    for( i in fetcheddata ){
        let year = fetcheddata[i]["yearCentury"];
        let team = fetcheddata[i]["team"] ;
    
        if( year == null ){ // skip data with blank content
            console.log( "PA BAR:" , year );
        }else if( team == null ){
            console.log( "PA BAR:" , team );
        }else{
            groupBy[ year ][ team ] = groupBy[ year ][ team ] + 1 ; // sum doesn't exist in met_data object info, will keep as 0
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
    
    console.log( "PA BAR groupBy count:", groupBy);

    // switch strchture to mach plot

    // var traceCAT = {
    //     y: [ yearCenture listed by yearCentryInt - yearName
    //     x: [ count of the yearCentry / sum * 100 - catPercent
    //     name: 'Cat',
    //     orientation: 'h',
    //     type: 'bar' ,
    //     marker:{
    //         color: "#" }
    // };

    // sort out right alpabatic order of the year
    let yearIntSort = fetcheddata.sort( ( a, b ) => b.yearCenturyInt - a.yearCenturyInt ) // 20 AD as first will show 20 AD as bottom
    console.log( "PA BAR year sort:", yearIntSort) ;

    // extrack yearCenturyInt and yearCentury as strcture
    // structure = { 0 : { numInt : yearCenturyInt , nameStr : yearCentury } ...
    let yearList = []
    let initStr = "" ;
    j = 0 ;
    for( i in fetcheddata ){
        
        tempObject = fetcheddata[i]

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

    console.log( "PA BAR yearList:" , yearList ) ;

    let nameGroup = countByKey( yearList , "nameStr" ) ;
    let yearName = Object.keys( nameGroup );
    console.log( "PA BAR yearName:" , yearName ) ;

    //setup bar value : pick year by yearName which is alreayd sorted, use value from groupBy = year.team.value_count
    let catPercent = [] ;
    let bothPercent = [] ;
    let dogPercent = [] ;

    for( i in yearName ){ // sum = 0 data doesn't exist on this list. since yearName is sorted based on exist objects
        // pick the year
        let year = yearName[i]
        let yearCount = groupBy[ year ] ;

        tempSum = yearCount.sum ;

        tempCat = Math.round( yearCount.cat / tempSum * 100 ) ;
        tempBoth = Math.round( yearCount.both / tempSum * 100 )  ;
        tempDog = 100 - tempCat - tempBoth ; // since dog has more objecct Dog is the base to avoid persent total over 100

        catPercent[i] = tempCat ;
        bothPercent[i] = tempBoth ;
        dogPercent[i] = tempDog ;
    }


    

    // horizontal
    var traceCat = {
        y: yearName, 
        x: catPercent ,
        hovertemplate: '%{x}%' ,
        name: 'Cat',
        orientation: 'h',
        type: 'bar' ,
        marker:{
            color: "#C84F56" }
    };

    var traceBoth = {
        y: yearName,
        x: bothPercent ,
        hovertemplate: '%{x}%' ,
        name: 'Cat & Dog',
        orientation: 'h',
        type: 'bar',
        marker:{
            color: "#E9BE68" }
    };

    var traceDog = {
        y: yearName,
        x: dogPercent , 
        hovertemplate: '%{x}%' ,
        name: 'Dog',
        orientation: 'h',
        type: 'bar',
        marker:{
            color: "#52C5CA" }
    };

    var data = [traceCat, traceBoth , traceDog];

    var layout = {
        
        barmode: 'stack',
        showlegend: false,
        margin: {
            l: 10,
            r: 30,
            b: 50,
            t: 70,
            pad:10
            },

        title: {
            text : "Trend of Cat & Dog</br></br>Objects from The Metropolitan Museum of Art" ,
            font : {
                family: "Helvetica",
                size: 14,
                color: "#52C5CA"
            }
        },
        xaxis: {
            title: {
                text: '% Percentage of Total Objects in Century',
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
                text: 'Century',
                font: {
                family: 'Helvetica',
                size: 12,
                color: '#E9BE68'
                }
            }
            }
    };

    Plotly.newPlot('plota', data, layout);

    });
