const addGradient = (defs) => {
  const gradient = defs
    .append("linearGradient")
    .attr("id", "area-gradient")
    .attr("gradientTransform", "rotate(67)");

  // Add gradient stops
  gradient.append("stop").attr("offset", "0%").attr("stop-color", "#10A79E");

  gradient.append("stop").attr("offset", "100%").attr("stop-color", "#1C5B88");
};

export default addGradient;
