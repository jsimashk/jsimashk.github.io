d3.json("samples.json").then(function(data) {
    //console.log(data.names);
    //console.log(data.metadata);
    //console.log(data.metadata[0].id);
    //console.log(data.samples);
    console.log(data.samples[0].otu_ids.slice(0,10));
    console.log(data.samples[0].sample_values.slice(0,10));
    console.log(data.samples[0].otu_labels.slice(0,10));

    //populate drown down list with ids
    var selDataset = d3.select("#selDataset")

    selDataset.selectAll("option")
        .data(data.names)
        .enter().append("option")
        .attr("value", function(d){return d;})
        .text(function(d){return d;})


    //populate demographic information with default (first sample)
    populateDemographicInfo(data, 0);
    
    //plot the bar graph for with default (first sample)
    plotBarGraph(data, 0);

    plotBubbleGraph(data, 0);

    plotGaugeGraph(data, 0);

  });
  
function optionChanged(id){

    var sampleMetadata = d3.select("#sample-metadata");

    d3.json("samples.json").then(function(data){

        console.log(data.names);
        var index = data.names.indexOf(id);
        console.log(index);

        populateDemographicInfo(data, index);

        plotBarGraph(data, index);

        plotBubbleGraph(data, index);

        plotGaugeGraph(data, index);

    });
}

function populateDemographicInfo(data, index){

    var sampleMetadata = d3.select("#sample-metadata");

    var filteredData = data.metadata[index];

    console.log(filteredData);
    
    //clear existing data
    sampleMetadata.html("");

    //add data for selected id
    sampleMetadata.append("ul").html(`<b>id:</b> ${filteredData.id}`);
    sampleMetadata.append("ul").html(`<b>ethnicity:</b> ${filteredData.ethnicity}`);
    sampleMetadata.append("ul").html(`<b>gender:</b> ${filteredData.gender}`);
    sampleMetadata.append("ul").html(`<b>location:</b> ${filteredData.location}`);
    sampleMetadata.append("ul").html(`<b>bbtype:</b> ${filteredData.bbtype}`);
    sampleMetadata.append("ul").html(`<b>wfreq:</b> ${filteredData.wfreq}`);
}

function plotBarGraph(data, index){
    //prepare data arrays
    var otu_ids = data.samples[index].otu_ids.slice(0,10).map(id => `OTU ID ${id}`);
    var sample_values = data.samples[index].sample_values.slice(0,10);
    var otu_labels = data.samples[index].otu_labels.slice(0,10);

    console.log(otu_ids);

    // Create the Trace
    var trace1 = {
    x: sample_values,
    y: otu_ids,
    type: "bar",
    text: otu_labels,
    orientation: 'h',
    marker: {
        width: 2
      },
    };

    // Create the data array for the plot
    var data = [trace1];

    // Define the plot layout
    var layout = {
    width: 500,
    height: 500,
    title: "Top 10 OTU samples",
    xaxis: { title: "Sample Values" },
    //yaxis: { title: "OTU ID" }
    yaxis: {autorange: "reversed"}
    };

    // Plot the chart to a div tag with id "bar-plot"
    Plotly.newPlot("bar", data, layout);
}


function plotBubbleGraph(data, index){

    //prepare data arrays
    var otu_ids = data.samples[index].otu_ids; //.slice(0,10);
    var sample_values = data.samples[index].sample_values; //.slice(0,10);
    var otu_labels = data.samples[index].otu_labels; //.slice(0,10);


    var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'OTU Samples',
        showlegend: false,
        height: 500,
        width: 1000
      };
      
      Plotly.newPlot('bubble', data, layout);
}

function plotGaugeGraph(data, index){
    
    var scrubs_per_week = data.metadata[index].wfreq;

    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: scrubs_per_week,
            title: { text: "Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkgreen" },
                bar: { color: "green" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                  { range: [0, 1], color: "rgba(232, 226, 202, .5)"},
                  { range: [1, 2], color: "rgba(210, 206, 145, .5)" },
                  { range: [2, 3], color: "rgba(202, 209, 95, .5)" },
                  { range: [3, 4], color: "rgba(170, 202, 42, .5)" },
                  { range: [4, 5], color: "rgba(110, 154, 22, .5)" },
                  { range: [5, 6], color: "rgba(90, 150, 15, .5)" },
                  { range: [6, 7], color: "rgba(50, 127, 10, .5)" },
                  //{ range: [7, 8], color: "rgba(14, 127, 5, .5)" },
                  //{ range: [8, 9], color: "rgba(5, 100, 0, .5" }
                  { range: [7, 8], color: "green" },
                  { range: [8, 9], color: "darkgreen" }
                ]
            }
        }
    ];
    
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    
    Plotly.newPlot('gauge', data, layout);

}