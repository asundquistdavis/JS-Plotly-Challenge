function isId(sample, id) {
    return (sample.id == id);
};

function top10OTUForSample(data, id) {
    return data.samples.filter(sample => (sample.id == id))
};



d3.json('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json')
    .then(function(data) {
        let id = "940"
        console.log({'x': top10OTUForSample(data, id).map(sample => sample.sample_values)[0].slice(0, 10)});
        console.log({'y': top10OTUForSample(data, id).map(sample => sample.otu_ids)[0].slice(0, 10).map(otu_id => `OTU ${otu_id}`)});
        console.log({'text': top10OTUForSample(data, id).map(sample => sample.otu_labels)[0].slice(0, 10)});
        let plotData = [{'x': top10OTUForSample(data, id).map(sample => sample.sample_values)[0].slice(0, 10),
                         'y': top10OTUForSample(data, id).map(sample => sample.otu_ids)[0].slice(0, 10).map(otu_id => `OTU ${otu_id}`),
                         'text': top10OTUForSample(data, id).map(sample => sample.otu_labels)[0].slice(0, 10),
                         'type': 'bar',
                         'orientation': 'h'}];
        
        let plotLayout = {'yaxis.type': 'category'
                          }

        Plotly.newPlot('bar', plotData, plotLayout)
    }
);

