const svgWidth = 960
const svgHeight = 500
let margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
}
let width = svgWidth - margin.left - margin.right
let height = svgHeight - margin.top - margin.bottom
let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
let chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
// View selection - changing this triggers transition
let currentSelection = "poverty"
let currentYSelection = "healthcare"
/**
 * Returns a updated scale based on the current selection.
 **/
function xScale(data, currentSelection) {
  let xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(data.map(d => parseInt(d[currentSelection]))) * 0.8,
      d3.max(data.map(d => parseInt(d[currentSelection]))) * 1.2
    ])
    .range([0, width])
  return xLinearScale
}
function yScale(data, currentYSelection){
    let yLinearScale = d3
    .scaleLinear()
    .domain([
        d3.min(data.map(d => parseInt(d[currentYSelection]))) * 0.8,
        d3.max(data.map(d => parseInt(d[currentYSelection]))) * 1.2
    ])
    .range([height, 0])
    return yLinearScale
}
/**
 * Returns and appends an updated x-axis based on a scale.
 **/
function renderAxes(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale)
  xAxis
    .transition()
    .duration(1000)
    .call(bottomAxis)
  return xAxis
}
/**
 * Returns and appends an updated circles group based on a new scale and the currect selection.
 **/
function renderCircles(circlesGroup, newXScale, currentSelection) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[currentSelection]))
  return circlesGroup
}
;(function() {
  d3.csv("assets/data/data.csv").then(data => {
    let xLinearScale = xScale(data, currentSelection)
    let yLinearScale = yScale(data, currentYSelection)
    let bottomAxis = d3.axisBottom(xLinearScale)
    // console.log(bottomAxis)
    let leftAxis = d3.axisLeft(yLinearScale)
    xAxis = chartGroup
      .append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis)
    chartGroup.append("g").call(leftAxis)
    let circlesGroup = chartGroup
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[currentSelection]))
      .attr("cy", d => yLinearScale(d[currentYSelection]))
      .attr("r", 10)
      .attr("fill", "blue")
      .attr("opacity", ".9")

    let labelsGroup = chartGroup
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`)
    labelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty")
      .classed("active", true)
      .text("In Poverty")
    labelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age")
      .classed("inactive", true)
      .text("Age")
    chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("value", "healthcare")
      .classed("active", true)
      .text("Health Care")
    chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 20 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Smokes")
    // Crate an event listener to call the update functions when a label is clicked
    labelsGroup.selectAll("text").on("click", function() {
      let value = d3.select(this).attr("value")
      if (value !== currentSelection) {
        currentSelection = value
        xLinearScale = xScale(data, currentSelection)
        xAxis = renderAxes(xLinearScale, xAxis)
        circlesGroup = renderCircles(
          circlesGroup,
          xLinearScale,
          currentSelection
        )
      }
    }
    )
    // chartGroup.selectAll("text").on("click", function(){
    //     let yValue = d3.select(this).attr("value")
    //     if (yValue !== currentYSelection){
    //         currentYSelection = yValue
    //         yLinearScale = yScale(data, currentYSelection)  
    //     }
    //     console.log(yValue)
    // })
    console.log(currentYSelection)
    console.log(currentSelection)  
}
  )
  
})()
