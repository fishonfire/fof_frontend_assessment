import drawEventLine from "./drawEventline.js";

const onPointClicked = (index, points) => {
  console.log(index);

  drawEventLine(svg, [index], points);
};

const drawBoxes = (svg, points, maxHeight) => {
  const boxWidth = points[1].x - points[0].x; // Half the distance between red dots

  svg
    .selectAll(".red-link-box")
    .data(points)
    .enter()
    .append("a")
    .on("click", (_, i) => {
      onPointClicked(i, points);
    })
    .append("rect")
    .attr("class", "red-link-box")
    .attr("x", (d) => d.x - boxWidth / 2)
    .attr("y", 0)
    .attr("width", boxWidth)
    .attr("height", maxHeight)
    .style("fill", "transparent");
};

export default drawBoxes;
