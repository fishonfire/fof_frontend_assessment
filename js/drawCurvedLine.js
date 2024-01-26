const drawCurvedLine = (svg, points, line) => {
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

export default drawCurvedLine;
