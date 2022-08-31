function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
          // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }
  
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samples = data.samples;
     // console.log(samples);
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var samplearray = samples.filter(sampleObj => sampleObj.id == sample);
    //  console.log(samplearray);
      //  5. Create a variable that holds the first sample in the array.
      var samplevar = samplearray[0];
    //  console.log(samplevar);
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var sample_otu_ids = samplevar.otu_ids;
    //  console.log(sample_otu_ids);
      var sample_otu_labels = samplevar.otu_labels;
     // console.log(sample_otu_labels);
      var sample_sample_values = samplevar.sample_values;
      //console.log(sample_sample_values);
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var washing_freq = result.wfreq;
      
    console.log(washing_freq)
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
      var yticks = sample_otu_ids.slice(0,10).reverse();
      var yticklabels = yticks.map(function(y){
        return 'OTU '+String(y);
      });
     // console.log(yticklabels); 
     // console.log(sample_sample_values.slice(0,10).reverse());
  
      // 8. Create the trace for the bar chart. 
      var barData = [{
        x:sample_sample_values.slice(0,10).reverse(),  
        y: yticklabels,
        text: sample_otu_labels.slice(0,10).reverse(),
        type: 'bar',
        orientation: 'h'
      }];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        yaxis: {
          tickmode:"array",
          ticktext: yticks
        },
       
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot('bar', barData, barLayout);
      // 1. Create the trace for the bubble chart.
      var bubbleData = [{
        x: sample_otu_ids,
        y: sample_sample_values,
        text: sample_otu_labels,
        mode: 'markers',
        marker: {
          size: sample_sample_values.map(numb => numb * .6),
          color: sample_otu_ids,
          colorscale: 'Earth'
        }
  
      }];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        hovermode: 'closest',
        xaxis: {title:"OTU ID"}
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
      var gaugeData = [{
        domain: {x:[0,1],y:[0,1]},
        value: washing_freq,
        gauge:{
          axis:{range:[0,10]},
          bar: {color:'black'},
          steps:[
            {range:[0,2],color:'red'},
            {range:[2,4], color:'darkorange'},
            {range:[4,6],color:'yellow'},
            {range:[6,8], color: 'lime'},
            {range:[8,10], color: 'green'}
          ]},
        title: {text: "Belly Button Washing Frequency <br> Scrubs per Week", font:{size:18}},
        type: "indicator",
        mode:"gauge+number"
      }];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = {width: 400, height: 500, margin:{t:0,b:0}};
       
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  
    });
  }