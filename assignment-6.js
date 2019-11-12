'use strict';

const width = 700;
const height = 500;

const svg = d3.select("#viz")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const neighborhoods = svg.append("g");

let albersProjection = d3.geoAlbers()
    .scale(190000)
    .rotate([71.057, 0])
    .center([0, 42.313])
    .translate([width/2, height/2]);

let geoPath = d3.geoPath()
    .projection(albersProjection)

d3.json('./data/neighborhoods.json', (mapCoord) => {
    neighborhoods.selectAll("path")
        .data(mapCoord.features)
        .enter()
        .append("path")
        .attr("fill", "#ccc")
        .attr("d", geoPath)
    d3.json('./data/points.json', (data) => {
        let points = svg.append("g");
        points.selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr('fill', '#900')
            .attr('stroke', '#999')
            .attr('d', geoPath);
        let links = generateLineObjects(data);

        // Code from: http://bl.ocks.org/erikhazzard/6201948
        var tweenDash = function tweenDash() {
            //This function is used to animate the dash-array property, which is a
            //  nice hack that gives us animation along some arbitrary path (in this
            //  case, makes it look like a line is being drawn from point A to B)
            var len = this.getTotalLength(),
                interpolate = d3.interpolateString("0," + len, len + "," + len);

            return function(t) { return interpolate(t); };
        };

        document.querySelector("#start").addEventListener("click", (event) => {
            event.preventDefault();
            let path = svg.append("g");
            let pathArcs = path.selectAll(".arc")
                .data(links)
                .enter()
                .append("path")
                .attr("class", "arc")
                .attr("fill", "none")
                .attr("d", geoPath)
                .style("stroke", '#0000ff')
                .style('stroke-width', '2px')
                .transition()
                .duration(5500)
                .attrTween("stroke-dasharray", tweenDash);
        });
    });
});

// Generate Line Objects 
// Code from: http://bl.ocks.org/erikhazzard/6201948 
function generateLineObjects(data) {
    let links = [];
    console.log(data)
    data = data.features;
    let len = data.length - 1;
    for(let i = 0; i < len; i++){
    // (note: loop until length - 1 since we're getting the next
    //  item with i+1)
        let coor = data[i].geometry.coordinates;
        let lon = coor[0];
        let lat = coor[1];
        let coor2 = data[i + 1].geometry.coordinates;
        let lon2 = coor2[0];
        let lat2 = coor2[1];
        links.push({
            type: "LineString",
            coordinates: [
                [ lon, lat ],
                [ lon2, lat2 ]
            ]
        });
    }
    return links;
}