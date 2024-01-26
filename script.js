const RANDOM_SEED = 567899;
const NUM_POINTS = 100;
const NODE_DISTANCE = 100;
const MIN_HEIGHT = 300;
const CURVE_HEIGHT = 30;
const EVENT_LINE_COLOR = "#036974";
const EVENT_FILL_COLOR = "#036974";

const random = () => {
  var x = Math.sin(seed++) * 100000;
  return x - Math.floor(x);
};

const onPointClicked = (index) => {
  console.log(index);

  drawEventLine([index]);
};

const drawEventLine = (drawEvents) => {
  svg
    .selectAll("eventCircle")
    .data(drawEvents)
    .enter()
    .insert("circle", ":first-child")
    .attr("cx", (eventIndex) => points[eventIndex].x)
    .attr("cy", (eventIndex) => points[eventIndex].y - 80)
    .attr("r", 36)
    .attr("fill-opacity", "0")
    .attr("stroke", EVENT_LINE_COLOR)
    .attr("stroke-width", "3");

  const eventLine = d3
    .line()
    .x((event) => event[0])
    .y((event) => event[1]);

  svg
    .selectAll("eventLine")
    .data(drawEvents)
    .enter()
    .insert("path", ":first-child")
    .attr("d", (eventIndex) =>
      eventLine([
        [points[eventIndex].x, points[eventIndex].y],
        [points[eventIndex].x, points[eventIndex].y - 80 + 36],
      ])
    )
    .attr("stroke", EVENT_LINE_COLOR)
    .attr("stroke-width", "2");

  svg
    .selectAll("text")
    .data(drawEvents)
    .enter()
    .insert("text", ":first-child")
    .text((d) => `EVENT TITLE ${d}`)
    .attr("x", (eventIndex) => points[eventIndex].x - 45)
    .attr("y", (eventIndex) => points[eventIndex].y - 125)
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .attr("fill", EVENT_FILL_COLOR);
};

const createBottomArea = () => {
  // Create an area function
  const bottomArea = d3
    .area()
    .x((d) => d.x)
    .y0(maxHeight)
    .y1((d) => d.y + 9)
    .curve(d3.curveNatural);

  // Draw the filled area under the line
  svg
    .append("path")
    .datum(points)
    .attr("d", bottomArea)
    .attr("class", "bg-bottom");
};

const addGradient = () => {
  const gradient = defs
    .append("linearGradient")
    .attr("id", "area-gradient")
    .attr("gradientTransform", "rotate(67)");

  // Add gradient stops
  gradient.append("stop").attr("offset", "0%").attr("stop-color", "#10A79E");

  gradient.append("stop").attr("offset", "100%").attr("stop-color", "#1C5B88");
};

const drawCurvedLine = () => {
  // Draw the curved line
  svg
    .append("path")
    .datum(points)
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "url(#area-gradient)")
    .attr("class", "road-line-back");

  svg
    .append("path")
    .datum(points)
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("class", "road-line");
};

const drawBoxes = () => {
  const boxWidth = points[1].x - points[0].x; // Half the distance between red dots

  svg
    .selectAll(".red-link-box")
    .data(points)
    .enter()
    .append("a")
    .attr("onclick", (_, i) => `onPointClicked(${i})`)
    .append("rect")
    .attr("class", "red-link-box")
    .attr("x", (d) => d.x - boxWidth / 2)
    .attr("y", 0)
    .attr("width", boxWidth)
    .attr("height", maxHeight)
    .style("fill", "transparent");
};

// SVG container
const svg = d3.select("#svg-container");

window.svg = svg;
const graphElement = document.getElementById("svg-container");

// Set a seed for reproducibility
let seed = RANDOM_SEED;

// Height range for the points
const width = 500 + NUM_POINTS * NODE_DISTANCE;
const maxHeight = parseInt(graphElement.getAttribute("height"), 10);

//  Setting width dynamically based on number of points and node distance.
graphElement.setAttribute("width", width);

// Generate random vertical points
let stepHeight = 0;

const points = [...new Array(NUM_POINTS)].map((_, i) => {
  stepHeight += 2;
  return {
    x: (i / (NUM_POINTS - 1)) * width,
    y:
      Math.floor(random() * (maxHeight - CURVE_HEIGHT - MIN_HEIGHT + 1)) +
      MIN_HEIGHT -
      stepHeight,
  };
});

const events = [4, 6, 10];

drawEventLine(events);
createBottomArea();

// Create a line function that curves between points
const line = d3
  .line()
  .x((d) => d.x)
  .y((d) => d.y)
  .curve(d3.curveNatural);

// Add a 'defs' element to the SVG for defining gradients
const defs = svg.append("defs");

addGradient();
drawCurvedLine();
drawBoxes();

// // Draw circles at the data points
// svg.selectAll("circle")
//   .data(points)
//   .enter().append("circle")
//   .attr("cx", d => d.x)
//   .attr("cy", d => d.y)
//   .attr("r", 4)
//   .attr("fill", "red")
