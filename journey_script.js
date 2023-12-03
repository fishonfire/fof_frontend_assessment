// Constants for configuration
const CONFIG = {
    seed: 567899,
    numPoints: 100,
    nodeDistance: 100,
    minHeight: 300,
    curveHeight: 30,
    eventCircleRadius: 36,
    boxWidthFactor: 2,
    defaultEvents: [4, 6, 10],
};

function seededRandom() {
    var x = Math.sin(CONFIG.seed++) * 100000
    return x - Math.floor(x)
}

function onPointClicked(index) {
    console.log(index)

    drawEventLine([index])
}

// SVG container
const svg = d3.select("#svg-container")

const graphElement = document.getElementById("svg-container")
graphElement.setAttribute('width', calculateWidth())


const maxHeight = parseInt(graphElement.getAttribute('height'), 10)

function calculateWidth() {
    return (500) + CONFIG.numPoints * CONFIG.nodeDistance;
}

// Generate random vertical points
let stepHeight = 0
const points = Array.from({ length: CONFIG.numPoints }, (_, i) => {
    stepHeight += CONFIG.boxWidthFactor;
    return {
        x: (i / (CONFIG.numPoints - 1)) * calculateWidth(),
        y: Math.floor((seededRandom()) * (maxHeight - CONFIG.curveHeight - CONFIG.minHeight + 1)) + CONFIG.minHeight - stepHeight,
    }
})

function drawEventLine(drawEvents) {
    svg.selectAll("eventCircle")
        .data(drawEvents)
        .enter().insert("circle", ":first-child")
        .attr("cx", eventIndex => points[eventIndex].x)
        .attr("cy", eventIndex => points[eventIndex].y - 80)
        .attr("r", CONFIG.eventCircleRadius)
        .attr("fill-opacity", "0")
        .attr("stroke", "#036974")
        .attr("stroke-width", "3")

    const eventLine = d3.line()
        .x(event => event[0])
        .y(event => event[1]);

    svg.selectAll("eventLine")
        .data(drawEvents)
        .enter().insert("path", ":first-child")
        .attr("d", eventIndex => eventLine([
            [points[eventIndex].x, points[eventIndex].y],
            [points[eventIndex].x, points[eventIndex].y - 80 + CONFIG.eventCircleRadius]
        ]))
        .attr("stroke", "#036974")
        .attr("stroke-width", "2")

    svg.selectAll("text")
        .data(drawEvents)
        .enter().insert("text", ":first-child")
        .text(d => `EVENT TITLE ${d}`)
        .attr("x", eventIndex => points[eventIndex].x - 45)
        .attr("y", eventIndex => points[eventIndex].y - 125)
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("fill", "#036974");

}

drawEventLine(CONFIG.defaultEvents)

// Create an area function
const bottomArea = d3.area()
    .x(d => d.x)
    .y0(maxHeight)
    .y1(d => d.y + 9)
    .curve(d3.curveNatural);

// Draw the filled area under the line
svg.append("path")
    .datum(points)
    .attr("d", bottomArea)
    .attr("class", "bg-bottom")

// Create a line function that curves between points
const line = d3.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveNatural)

// Add a 'defs' element to the SVG for defining gradients
const defs = svg.append("defs");

// Define the linear gradient
const gradient = defs.append("linearGradient")
    .attr("id", "area-gradient")
    .attr("gradientTransform", "rotate(67)");

// Add gradient stops
gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#10A79E");

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#1C5B88");

// Draw the curved line    
svg.append("path")
    .datum(points)
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "url(#area-gradient)")
    .attr("class", "road-line-back")

svg.append("path")
    .datum(points)
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("class", "road-line")

// Draw boxes around red circles
const boxWidth = (points[1].x - points[0].x) // Half the distance between red dots

svg.selectAll(".red-link-box")
    .data(points)
    .enter().append("a")
    .attr("onclick", (_, i) => `onPointClicked(${i})`)
    .append("rect")
    .attr("class", "red-link-box")
    .attr("x", d => d.x - boxWidth / 2)
    .attr("y", 0)
    .attr("width", boxWidth)
    .attr("height", maxHeight)
    .style("fill", "transparent")

// Draw circles at the data points
svg.selectAll("circle")
    .data(points)
    .enter().append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 4)
    .attr("fill", "red")
