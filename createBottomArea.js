const createBottomArea = (svg, points, maxHeight) => {
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

export default createBottomArea;
