import { EVENT_CIRCLE_SELECTOR, EVENT_LINE_SELECTOR } from "./constants.js";

const EVENT_LINE_COLOR = "#036974";
const EVENT_TEXT_COLOR = "#036974";

const drawEventLine = (svg, drawEvents, points) => {
  svg
    .selectAll(EVENT_CIRCLE_SELECTOR)
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
    .selectAll(EVENT_LINE_SELECTOR)
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
    .append("g")
    .selectAll("text")
    .data(drawEvents)
    .enter()
    .insert("text", ":first-child")
    .attr("x", (eventIndex) => points[eventIndex].x - 45)
    .attr("y", (eventIndex) => points[eventIndex].y - 125)
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .attr("fill", EVENT_TEXT_COLOR)
    .text((d) => `EVENT TITLE ${d}`);
};

export default drawEventLine;
