
const SEED = 567899;
const NUM_POINTS = 100;
const NODE_DISTANCE = 100;
const MIN_HEIGHT = 300;
const CURVE_HEIGHT = 30;
const EVENT_CIRCLE_RADIUS = 36;
const EVENT_LINE_OFFSET = 80;
const EVENT_TEXT_OFFSET_X = 45;
const EVENT_TEXT_OFFSET_Y = 125;
const AREA_CURVE_OFFSET = 9;
const CIRCLE_RADIUS = 4;
const GRADIENT_ROTATION = 67;
const GRADIENT_START_COLOR = "#10A79E";
const GRADIENT_END_COLOR = "#1C5B88";
const LINE_CLASS_BACK = "road-line-back";
const LINE_CLASS_FRONT = "road-line";
const LINK_BOX_CLASS = "red-link-box";
const TRANSPARENT_FILL = "transparent";
const BLACK_STROKE = "black";
const RED_FILL = "red";

let seed = SEED;

function generateRandom() {
    const randomValue = Math.sin(seed++) * 100000;
    return randomValue - Math.floor(randomValue);
}

const onPointClicked = index => {
    console.log(index);
    addEventMarker([index]);
};

const setupSvgContainer = () => {
    const svg = d3.select("#svg-container");
    const graphElement = document.getElementById("svg-container");


    const width = (500) + NUM_POINTS * NODE_DISTANCE;
    const maxHeight = parseInt(graphElement.getAttribute('height'), 10);
    graphElement.setAttribute('width', width);

    return { svg, graphElement, width, maxHeight };
};

const { svg, graphElement, width, maxHeight } = setupSvgContainer();


const generatePoints = () => {
    let stepHeight = 0;
    return Array.from({ length: NUM_POINTS }, (_, i) => {
        stepHeight += 2;
        return {
            x: (i / (NUM_POINTS - 1)) * width,
            y: Math.floor(generateRandom() * (maxHeight - CURVE_HEIGHT - MIN_HEIGHT + 1)) + MIN_HEIGHT - stepHeight,
        };
    });
};

const points = generatePoints();

const events = [4, 6, 10];

const addEventMarker = drawEvents => {
    drawEventCircle(svg, points, drawEvents);
    drawEventLine(svg, points, drawEvents);
    drawEventText(svg, points, drawEvents);
};

const drawEventCircle = (svg, points, drawEvents) => {
    svg.selectAll("eventCircle")
        .data(drawEvents)
        .enter().insert("circle", ":first-child")
        .attr("cx", eventIndex => points[eventIndex].x)
        .attr("cy", eventIndex => points[eventIndex].y - EVENT_LINE_OFFSET)
        .attr("r", EVENT_CIRCLE_RADIUS)
        .attr("fill-opacity", "0")
        .attr("stroke", "#036974")
        .attr("stroke-width", "3")
};

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
        .attr("stroke-width", "2")
};

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

addEventMarker(events);





function createBottomArea(maxHeight) {
    return d3.area()
        .x(d => d.x)
        .y0(maxHeight)
        .y1(d => d.y + AREA_CURVE_OFFSET)
        .curve(d3.curveNatural);
}

function drawBottomArea(svg, points, bottomArea) {
    svg.append("path")
        .datum(points)
        .attr("d", bottomArea)
        .attr("class", "bg-bottom");
}

function createLine() {
    return d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveNatural);
}

function defineGradient(svg) {
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", "area-gradient")
        .attr("gradientTransform", `rotate(${GRADIENT_ROTATION})`);

    gradient.append("stop").attr("offset", "0%").attr("stop-color", GRADIENT_START_COLOR);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", GRADIENT_END_COLOR);

    return gradient;
}

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

function drawDataPoints(svg, points) {
    svg.selectAll("circle")
        .data(points)
        .enter().append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", CIRCLE_RADIUS)
        .attr("fill", RED_FILL);
}

const bottomArea = createBottomArea(maxHeight);
drawBottomArea(svg, points, bottomArea);

const line = createLine();
defineGradient(svg);
drawLine(svg, points, line);

drawLinkBoxes(svg, points, maxHeight);
drawDataPoints(svg, points);
