function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
    d3.json("/metadata/"+sample).then(function(metadata){
        var level="";
        metapanel=d3.select('#sample-metadata');
        metapanel.html("");
        for (let key of Object.keys(metadata)) {
            if (key== "WFREQ") level=metadata[key];
            else{
            val = metadata[key];
          metapanel.append("p").html(key+" : "+val) .style("word-wrap", "break-word");
         }
        }
    
  
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

        // Trig to calc meter point
        var degrees = 180 - (level*18),
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var greenShades=['rgba(142, 184, 169, .5)', 'rgba(153, 191, 177, .5)',
        'rgba(164, 198, 186, .5)', 'rgba(175, 205, 194, .5)',
        'rgba(187, 212, 203, .5)', 'rgba(198, 219, 212, .5)',
        'rgba(209, 226, 220, .5)', 'rgba(221, 233, 229 .5)',
        'rgba(221, 233, 229, .5)', 'rgba(255, 255, 255, 0)'];

        var gdata = [{ type: 'scatter',
        x: [0], y:[0],
            marker: {size: 28, color:'a26a9a'},
            showlegend: false,
            name: 'scrubs',
            text: level,
            hoverinfo: 'text+name'},
        { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3','1-2', '0-1'],
        textinfo: 'text',
        textposition:'inside',	  
        marker: {colors:greenShades},
        labels: ['8-9','7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
        }];

        var glayout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: 'a26a9a',
            line: {
                color: 'a26a9a'
            }
            }],
        title: '<b>Belly button washing frequency</b><br>Scrubs per week',
       
        xaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]}
        };

        Plotly.newPlot('gauge', gdata, glayout);
    });

}



function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/"+sample).then((data) => {
    //console.log(data);
    // @TODO: Build a Bubble Chart using the sample data
        var bubbtrace = {
            x: data['otu_ids'],
            y: data['sample_values'],
            text:data['otu_labels'],
            mode: 'markers',
            marker: {
                size: data['sample_values'],
                opacity:0.6,
                color:data['otu_ids']
              }
        };
        
        var bubbdata = [bubbtrace];
        
        var bubblayout = {
            title: '<b>Bacteria sample values</b>',
            showlegend: false,
            height: 480,
            width: 826
        };
        
        Plotly.newPlot('bubble', bubbdata, bubblayout);

        console.log(data);
        //JSON array is an array of objects . .custom sort based on bubble sort
      /*  datarray=[data];
        copydata=datarray;
        var swap=false;
        var temp;
       while (!swap){
            swap=true;
            for ( var i=1; i<datarray[0].sample_values.length; i++){ 
                if (datarray[0].sample_values[i-1]< datarray[0].sample_values[i]){
                    swap=false;
                    temp=datarray[0].sample_values[i];
                    datarray[0].sample_values[i]= datarray[0].sample_values[i-1];
                    datarray[0].sample_values[i-1]=temp;
                    temp=datarray[0].otu_ids[i];
                    datarray[0].otu_ids[i]= datarray[0].otu_ids[i-1];
                    datarray[0].otu_ids[i-1]=temp;
                    temp=datarray[0].otu_labels[i];
                    datarray[0].otu_labels[i]= datarray[0].otu_labels[i-1];
                    datarray[0].otu_labels[i-1]=temp;
                }//compare
            }//for
        }//while*/
    
     //data is pre sorted 
        let pievals=data.sample_values.slice(0,10);
        let pielabels=data.otu_ids.slice(0,10);
        let pietext= data.otu_labels.slice(0,10);

        var piedata = [{
            values: pievals,
            labels: pielabels,
            text: pietext,
            type: 'pie',
            marker:{colors: ['rgb(56, 175, 126)', 'rgb(18, 136, 37)', 'rgb(34, 153, 101)', 'rgb(36, 155, 57)', 'rgb(6, 114, 4)',
            'rgb(133, 175, 99)', 'rgb(79, 129, 102)', 'rgb(151, 179, 100)', 'rgb(175, 149, 35)', 'rgb(36, 173, 147)' ]},
            hoverinfo: 'label+text+percent',
            textinfo: 'percent'
          }];
          
          var pielayout = {
            title: '<b>Operational taxonomic units for sample</b> '
          };

        Plotly.newPlot('pie', piedata,pielayout);
    });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
