// Set the url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data from url show it on console
d3.json(url).then((data) => {
                    console.log(data);
});

// Initialize the dashboard
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then((data) => {
        
        // Set a variable for the sample names
        let sampleNames = data.names;

        // Loop over all the names
        sampleNames.forEach((id) => {
            // Log the id
            console.log(id);

            // Add id to dropdown menu
            dropdownMenu.append("option").text(id).property("value",id);
        });

        // Set the first sample from the list
        let firstSample = sampleNames[0];

        // Build the initial plots
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
};

// Function to build bar and bubble chart
function buildCharts(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Get all the sample data
        let sampleData = data.samples;

        // Filter based on the value of the sample
        let values = sampleData.filter(result => result.id == sample);

        // Get the first index from the array
        let value= values[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = value.otu_ids;
        let sample_values = value.sample_values;
        let otu_labels = value.otu_labels;

        // Log the data to the console
        console.log(otu_ids,sample_values,otu_labels);

        // Set top ten items to display in descending order
        let x_value = sample_values.slice(0,10).reverse();
        let y_value = otu_ids.slice(0,10).map(id => 'OTU '+id).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace = [{
            x: x_value,
            y: y_value,
            text: labels,
            type: "bar",
            orientation: "h"
        }];

        // Setup the layout for the bar chart
        let layout = {
            title: "Top 10 OTUs"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", trace, layout)

        // Set up the trace for the bubble chart
        let trace1 = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];

        // Set the layout for the bubble chart
        let layout1 = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", trace1, layout1)
        
    });
};

// Function to create metadata
function buildMetadata(sample){
    d3.json(url).then((data) => {

        // Get all the sample data
        let metaData = data.metadata;

        // Filter based on the value of the sample
        let values = metaData.filter(result => result.id == sample);

        // Get the first index from the array
        let value= values[0];

        // Use d3 to select the panel data
        let panelData = d3.select("#sample-metadata");

        // Clear the panel data
        panelData.html("");

        // Add key and values to the metadata
        Object.entries(value).forEach(([k, v]) => {
            panelData.append("h5").text(`${k}:${v}`)
        })
    });
};

// Function that updates dashboard when sample is changed
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    buildCharts(value);
    buildMetadata(value);
};

// Call the initialize function
init();
