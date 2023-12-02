function random() {
    var x = Math.sin(seed++) * 100000
    return x - Math.floor(x)
}

function onPointClicked(index) {
    console.log(index)

    drawEventLine([index])
}

// SVG container
const svg = d3.select("#svg-container")

window.svg = svg
const graphElement = document.getElementById("svg-container")

// Set a seed for reproducibility
let seed = 567899

// Number of vertical points
const numPoints = 100

// Height range for the points
const nodeDistance = 100
const width = (500) + numPoints * nodeDistance
const minHeight = 300
const maxHeight = parseInt(graphElement.getAttribute('height'), 10)
const curveHeigth = 30

//  Setting width dynamically based on number of points and node distance.
graphElement.setAttribute('width', width)

// Generate random vertical points
let stepHeight = 0
const points = Array.from({ length: numPoints }, (_, i) => {
    stepHeight += 2;
    return {
        x: (i / (numPoints - 1)) * width,
        y: Math.floor((random()) * (maxHeight - curveHeigth - minHeight + 1)) + minHeight - stepHeight,
    }
})

const events = [4, 6, 10]

function drawEventLine(drawEvents) {
    svg.selectAll("eventCircle")
        .data(drawEvents)
        .enter().insert("circle", ":first-child")
        .attr("cx", eventIndex => points[eventIndex].x)
        .attr("cy", eventIndex => points[eventIndex].y - 80)
        .attr("r", 36)
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
            [points[eventIndex].x, points[eventIndex].y - 80 + 36]
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

drawEventLine(events)

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
