var trace1 = {
    y: ['giraffes', 'orangutans', 'monkeys'],
    x: [10, 15, 12],
    name: 'SF Zoo',
    orientation: 'h',
    type: 'bar' ,
    marker:{
        color: "#52C5CA" }
};

var trace2 = {
    y: ['giraffes', 'orangutans', 'monkeys'],
    x: [5, 1, 8],
    name: 'LA Zoo',
    orientation: 'h',
    type: 'bar',
    marker:{
        color: "#E9BE68" }
};

var trace3 = {
    y: ['giraffes', 'orangutans', 'monkeys'],
    x: [15, 14, 10],
    name: 'MC Zoo',
    orientation: 'h',
    type: 'bar',
    marker:{
        color: "#C84F56" }
};

var data = [trace1, trace2 , trace3];

var layout = {
    barmode: 'stack',
    yaxis: {automargin: true},
};

Plotly.newPlot('plota', data, layout);
