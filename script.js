import addGradient from "./addGradient.js";
import drawEventLine from "./drawEventline.js";
import drawCurvedLine from "./drawCurvedLine.js";
import createBottomArea from "./createBottomArea.js";
import drawBoxes from "./drawBoxes.js";
const RANDOM_SEED = 567899;
const NUM_POINTS = 100;
const NODE_DISTANCE = 100;
const MIN_HEIGHT = 300;
const CURVE_HEIGHT = 30;

const random = () => {
  var x = Math.sin(seed++) * 100000;
  return x - Math.floor(x);
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

drawEventLine(svg, events, points);
createBottomArea(svg, points, maxHeight);

// Create a line function that curves between points
const line = d3
  .line()
  .x((d) => d.x)
  .y((d) => d.y)
  .curve(d3.curveNatural);

// Add a 'defs' element to the SVG for defining gradients
const defs = svg.append("defs");

addGradient(defs);
drawCurvedLine(svg, points, line);
drawBoxes(svg, points, maxHeight);

// // Draw circles at the data points
// svg.selectAll("circle")
//   .data(points)
//   .enter().append("circle")
//   .attr("cx", d => d.x)
//   .attr("cy", d => d.y)
//   .attr("r", 4)
//   .attr("fill", "red")
