// path to json source 
let url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// populate selection with list ids
function populateSelect() {
    d3.json(url).then(function(data) {
        // get an array of all ids 
        ids = data.samples.map(sample => sample.id);
        // declare variable to store html that will be inserted into <select> element 
        let html = '';
        // loop through all ids 
        for (let i = 0; i < ids.length; i ++) {
            // concatinate html with <options> element with value and text of id
            html = html + `<option value='${ids[i]}'>${ids[i]}</option>`};
        // insert html (options) into the <select> element
        d3.select("#selDataset").html(html)})};

// return sample with given id
function getSampleFromId(data, id) {
    // filter samples (in data) for sample(s) with given id and return the first (only) match
    return data.samples.filter(sample => (sample.id == id))[0]};

// plots bar plot
function barPlot(id) {
    // call json and wait for promise to fulfill 
    d3.json(url).then(function(data) {
        // get the sample with matching id
        let sample = getSampleFromId(data, id);
        // define plot data
        let plotData = [{
            x: sample.sample_values.slice(0, 10).reverse(),
            y: sample.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
            text: sample.otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'}]; 
        let layout = {     
            title: {
                text: 'Top 10 OTU Samples Chart',
                font: {
                    size: 20}}};
        Plotly.newPlot('bar', plotData, layout);});};

// assigns colors to each value in an array: max value maps to rgb(red, green, 255), value of 0 maps to rgb(red, green, 0) and linear interpolation in between
function colorIdMap(otu_ids, red, green) {
    let normalization = 255/Math.max(...otu_ids);
    return otu_ids.map(otu_id => `rgb(${red}, ${green}, ${Math.floor(otu_id*normalization)})`);};


// displays bubble plot
function bubblePlot(id) {
    d3.json(url).then(function(data) {
        let plotData = [{
            x: getSampleFromId(data, id).otu_ids,
            y: getSampleFromId(data, id).sample_values,
            mode: 'markers',
            marker: {
                color: colorIdMap(getSampleFromId(data, id).otu_ids, 40, 175),
                opacity: getSampleFromId(data, id).otu_ids.map(id => .75),
                size: getSampleFromId(data, id).sample_values},
            text: getSampleFromId(data, id).otu_labels}];
        let layout = {     
            title: {
                text: 'OTU Samples Bubble Chart',
                font: {
                    size: 20}}};
        Plotly.newPlot('bubble', plotData, layout);});};

// return metadata with given id
function getMdEntryFromId(data, id) {
    return data.metadata.filter(mdEntry => mdEntry.id == id)[0];};

// displays gauge plot
function gaugePlot(id) {
    d3.json(url).then(function(data) {
        let plotData = [{
            domain: {
                x: [0, 1],
                y: [0, 1]},
            value: getMdEntryFromId(data, id)['wfreq'],
            title: {text: "Belly Button Washing Frequency"},
            type: "indicator",
            mode: "gauge+value",
            gauge: {
                axis: {
                    range: [null, 9]},
                steps: [
                    {range: [0,1], color: "gray"},
                    {range: [1,2], color: "gray"},
                    {range: [2,3], color: "gray"},
                    {range: [3,4], color: "gray"},
                    {range: [4,5], color: "gray"},
                    {range: [5,6], color: "gray"},
                    {range: [6,7], color: "gray"},
                    {range: [7,8], color: "gray"},
                    {range: [8,9], color: "gray"},]}}];
        let plotLayout = {};
        Plotly.newPlot('gauge', plotData);});};

// displays the meta data for given id
function metaDataField(id) {
    d3.json(url).then(function(data) {
        let mdEntry = getMdEntryFromId(data, id);
        let keys = Object.keys(mdEntry);
        let html = '';
        for (let i = 0; i < keys.length; i ++) {
            html += (`<p>${keys[i]}: ${mdEntry[keys[i]]}</p>`);   };
        d3.select('#sample-metadata').html(html);   });  };

// displays demographics statistics
function demographics() {
    let ethnicities = ['Caucasian', 'Black', 'Pacific Islander', 'Latino', 'Asian']
    d3.json(url).then(function(data) {
        // get metadata from json call
        metaData = data.metadata;
        // config plotly
        let config = {responsive: true}
        // compute ethnicity stats 
        let numCaucasion = metaData.filter(mdEntry => (mdEntry.ethnicity == 'Caucasian' || mdEntry.ethnicity == 'Caucasian/Midleastern' || mdEntry.ethnicity == 'European' || mdEntry.ethnicity == 'Caucasian/Jewish' || mdEntry.ethnicity == 'Caucasion' || mdEntry.ethnicity == 'White')).length;
        let numBlack = metaData.filter(mdEntry => (mdEntry.ethnicity == 'Black')).length;
        let numHispanic = metaData.filter(mdEntry => (mdEntry.ethnicity == 'Hispanic')).length;
        let numAsian = metaData.filter  (mdEntry => (mdEntry.ethnicity == 'Asian(South)' || mdEntry.ethnicity == 'Asian(American)' || mdEntry.ethnicity == 'Caucasian/Asian')).length;
        let numPC = metaData.filter(mdEntry => (mdEntry.ethnicity == 'PacificIslander')).length;
        // create ethnicity trace object
        let ethnicityPlot = {
            title: {
                text: 'Ethnicities',
                font: {
                    size: 20}},
            values: [numCaucasion, numBlack, numHispanic, numAsian, numPC],
            labels: ['Caucasian', 'Blcak', 'Hipanic', 'Asian', 'Pacific Islander'],
            type: 'pie',
            rotation: -11.75,
            hoverinfo: 'label+value',
            domain: {row: 0, column: 0}};
        // compute gneder stats
        let numMale = metaData.filter(mdEntry => (mdEntry.gender == 'M' || mdEntry.gender == 'm')).length;
        let numFem = metaData.filter(mdEntry => (mdEntry.gender == 'F' || mdEntry.gender == 'f')).length;
        // create gender trace object
        let genderPlot = {
            title: {
                text: 'Genders',
                font: {
                    size: 20}},
            values: [numFem, numMale],
            labels: ['Female', 'Male'],
            type: 'pie',
            hoverinfo: 'label+value',
            domain: {row:0, column: 1}};
        // create plots object 
        let piePlots = [ethnicityPlot, genderPlot];
        // create layout object 
        let pieLayout = {
            height: 250,
            width: 500,
            margin: {"t": 0, "b": 0, "l": 0, "r": 0},
            showlegend: false,
            grid: {rows: 1, columns: 2}};
        // plot at 'eth-gen-stats' div 
        Plotly.newPlot('eth-gen-stats', piePlots, pieLayout, config);
        // compute age stats 
        ages = metaData.map(mdEntry => mdEntry.age);
        // create age trace object 
        let agePlot = [{
            x: ages,
            type: 'histogram',
            xbins: {
                start: 0,
                size: 5}}];
        // create age plot layout object 
        let ageLayout = {
            title: {
                text: 'Ages',
                font: {
                    size: 20}},
            xaxis: {title: 'Age (yrs)'},
            margin: {"t": 50, "b": 30, "l": 20, "r": 0},
            height: 250,
            width: 250};
        // plot at 'age-stats' div 
        Plotly.newPlot('age-stats', agePlot, ageLayout, config);
        // compute wFreq stats 
        wFrs = metaData.map(mdEntry => mdEntry.wfreq);
        // create wash frequency trace object 
        let wFrPlot = [{
            x: wFrs,
            type: 'histogram',
            xbins: {
                start: 0,
                size: 1}}]
        // create wash frequency layout object
        let wFrLayout = {
            title: {
                text: 'Wash Frequencies',
                font: {
                    size: 20}},
            xaxis: {title: 'Number of Washes per Week'},
            margin: {"t": 50, "b": 30, "l": 20, "r": 0},
            height: 250,
            width: 250};
        // plot at 'wFr-Stats' div
        Plotly.newPlot('wFr-stats', wFrPlot, wFrLayout, config);})};

// code to run on start up - calls all three plot funcitons and metadata for the first id number in the data 
function init() {
    d3.json(url).then(function(data) {
        populateSelect();
        let id = data.samples[0].id;
        barPlot(id);
        bubblePlot(id);
        gaugePlot(id)
        metaDataField(id);
        demographics(id);});};      

// target of the 'onchange' attr of html select element - calls all graphics with new id
function optionChanged(id) {
    console.log(id);
    barPlot(id);
    bubblePlot(id);
    gaugePlot(id);
    metaDataField(id);};

// run the startup code
init();