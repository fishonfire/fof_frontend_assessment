// Constants
const SEED = 567899; // Seed value for random number generation
const NUM_POINTS = 100; // Number of data points
const NODE_DISTANCE = 100; // Distance between each data point
const MIN_HEIGHT = 300; // Minimum height of data points
const CURVE_HEIGHT = 30; // Height of the curve
const EVENT_CIRCLE_RADIUS = 36; // Radius of the event circle
const EVENT_LINE_OFFSET = 80; // Offset of the event line from the data point
const EVENT_TEXT_OFFSET_X = 45; // X offset of the event text from the data point
const EVENT_TEXT_OFFSET_Y = 125; // Y offset of the event text from the data point
const AREA_CURVE_OFFSET = 9; // Offset of the bottom area curve
const CIRCLE_RADIUS = 4; // Radius of the data point circle
const GRADIENT_ROTATION = 67; // Rotation angle of the gradient
const GRADIENT_START_COLOR = "#10A79E"; // Start color of the gradient
const GRADIENT_END_COLOR = "#1C5B88"; // End color of the gradient
const LINE_CLASS_BACK = "road-line-back"; // CSS class for the back line
const LINE_CLASS_FRONT = "road-line"; // CSS class for the front line
const LINK_BOX_CLASS = "red-link-box"; // CSS class for the link box
const TRANSPARENT_FILL = "transparent"; // Transparent fill color
const BLACK_STROKE = "black"; // Stroke color for the lines
const RED_FILL = "red"; // Fill color for the data points

let seed = SEED; // Seed value for random number generation

// Generate a random value based on seed
function generateSeedBasedSeed() {
    const randomValue = Math.sin(seed++) * 100000;
    return randomValue - Math.floor(randomValue);
}

// Event handler for when a data point is clicked
const onPointClicked = index => {
    console.log(index);
    addEventMarker([index]);
};

// Setup the SVG container
const setupSvgContainer = () => {
    const svg = d3.select("#svg-container");
    const graphElement = document.getElementById("svg-container");

    const width = (500) + NUM_POINTS * NODE_DISTANCE;
    const maxHeight = parseInt(graphElement.getAttribute('height'), 10);
    graphElement.setAttribute('width', width);

    return { svg, graphElement, width, maxHeight };
};

// Initialize the SVG container
const { svg, graphElement, width, maxHeight } = setupSvgContainer();

// Generate the data points
const generatePoints = () => {
    let stepHeight = 0;
    return Array.from({ length: NUM_POINTS }, (_, i) => {
        stepHeight += 2;
        return {
            x: (i / (NUM_POINTS - 1)) * width,
            y: Math.floor(generateSeedBasedSeed() * (maxHeight - CURVE_HEIGHT - MIN_HEIGHT + 1)) + MIN_HEIGHT - stepHeight,
        };
    });
};

const points = generatePoints(); // Generate the data points

const eventPointIndices = [4, 6, 10]; // Array of event indices

// Add event markers to the SVG
const addEventMarker = drawEvents => {
    drawEventCircle(svg, points, drawEvents);
    drawEventLine(svg, points, drawEvents);
    drawEventText(svg, points, drawEvents);
};

// Draw event circles on the SVG
const drawEventCircle = (svg, points, drawEvents) => {
    svg.selectAll("eventCircle")
        .data(drawEvents)
        .enter().insert("circle", ":first-child")
        .attr("cx", eventIndex => points[eventIndex].x)
        .attr("cy", eventIndex => points[eventIndex].y - EVENT_LINE_OFFSET)
        .attr("r", EVENT_CIRCLE_RADIUS)
        .attr("fill-opacity", "0")
        .attr("stroke", "#036974")
        .attr("stroke-width", "3");
};

// Draw event lines on the SVG
const drawEventLine = (svg, points, drawEvents) => {
    const eventLine = d3.line()
        .x(event => event[0])
        .y(event => event[1]);
    svg.selectAll("eventLine")
        .data(drawEvents)
        .enter().insert("path", ":first-child")
        .attr("d", eventIndex => eventLine([
            [points[eventIndex].x, points[eventIndex].y],
            [points[eventIndex].x, points[eventIndex].y - EVENT_LINE_OFFSET + EVENT_CIRCLE_RADIUS]
        ]))
        .attr("stroke", "#036974")
        .attr("stroke-width", "2");
};

// Draw event text on the SVG
const drawEventText = (svg, points, drawEvents) => {
    svg.selectAll("text")
        .data(drawEvents)
        .enter().insert("text", ":first-child")
        .text(d => `EVENT TITLE ${d}`)
        .attr("x", eventIndex => points[eventIndex].x - EVENT_TEXT_OFFSET_X)
        .attr("y", eventIndex => points[eventIndex].y - EVENT_TEXT_OFFSET_Y)
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("fill", "#036974");
};

addEventMarker(eventPointIndices); // Add event markers to the SVG

// Create the bottom area curve
function createBottomArea(maxHeight) {
    return d3.area()
        .x(d => d.x)
        .y0(maxHeight)
        .y1(d => d.y + AREA_CURVE_OFFSET)
        .curve(d3.curveNatural);
}

// Draw the bottom area curve on the SVG
function drawBottomArea(svg, points, bottomArea) {
    svg.append("path")
        .datum(points)
        .attr("d", bottomArea)
        .attr("class", "bg-bottom");
}

// Create the line
function createLine() {
    return d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveNatural);
}

// Define the gradient for the lines
function defineGradient(svg) {
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", "area-gradient")
        .attr("gradientTransform", `rotate(${GRADIENT_ROTATION})`);

    gradient.append("stop").attr("offset", "0%").attr("stop-color", GRADIENT_START_COLOR);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", GRADIENT_END_COLOR);

    return gradient;
}

// Draw the lines on the SVG
function drawLine(svg, points, line) {
    svg.append("path")
        .datum(points)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "url(#area-gradient)")
        .attr("class", LINE_CLASS_BACK);

    svg.append("path")
        .datum(points)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", BLACK_STROKE)
        .attr("class", LINE_CLASS_FRONT);
}

// Draw the link boxes on the SVG
function drawLinkBoxes(svg, points, maxHeight) {
    const boxWidth = points[1].x - points[0].x;

    svg.selectAll(`.${LINK_BOX_CLASS}`)
        .data(points)
        .enter().append("a")
        .attr("onclick", (_, i) => `onPointClicked(${i})`)
        .append("rect")
        .attr("class", LINK_BOX_CLASS)
        .attr("x", d => d.x - boxWidth / 2)
        .attr("y", 0)
        .attr("width", boxWidth)
        .attr("height", maxHeight)
        .style("fill", TRANSPARENT_FILL);
}

// Draw the data points on the SVG
function drawDataPoints(svg, points) {
    svg.selectAll("circle")
        .data(points)
        .enter().append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", CIRCLE_RADIUS)
        .attr("fill", RED_FILL);
}

const bottomArea = createBottomArea(maxHeight); // Create the bottom area curve
drawBottomArea(svg, points, bottomArea); // Draw the bottom area curve on the SVG

const line = createLine(); // Create the line
defineGradient(svg); // Define the gradient for the lines
drawLine(svg, points, line); // Draw the lines on the SVG

drawLinkBoxes(svg, points, maxHeight); // Draw the link boxes on the SVG
drawDataPoints(svg, points); // Draw the data points on the SVG
