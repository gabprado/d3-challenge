const svgWidth = 960
const svgHeight = 500
let margin = {
  top: 40,
  right: 90,
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

let xSelection = "poverty"
let ySelection = "healthcare"

function xScale(data, xSelection) {
    let xLinearScale = d3
        .scaleLinear()
        .domain([
            d3.min(data.map(d => parseInt(d[xSelection]))) * 0.8,
            d3.max(data.map(d => parseInt(d[xSelection]))) * 1.2
        ])
        .range([0, width])
    return xLinearScale
}

function yScale(data, ySelection) {
    let yLinearScale = d3
        .scaleLinear()
        .domain([
            d3.min(data.map(d => parseInt(d[ySelection]))) * 0.8,
            d3.max(data.map(d => parseInt(d[ySelection]))) * 1.2
        ])
        .range([height, 0])
    return yLinearScale
}

function renderXAxes(newXScale, xAxis){
    let bottomAxis = d3.axisBottom(newXScale)
    xAxis
        .transition()
        .duration(1000)
        .call(bottomAxis)
    return xAxis
}

function renderYAxes(newYScale, yAxis){
    let leftAxis = d3.axisLeft(newYScale)
    yAxis
        .transition()
        .duration(1000)
        .call(leftAxis)
    return yAxis
}

function renderCircles(circlesGroup, newXScale, xSelection, newYScale, ySelection){
    circlesGroup
        .transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[xSelection]))
        .attr("cy", d => newYScale(d[ySelection]))
    return circlesGroup
}

function renderCirclesTextGroup(circlesTextGroup, newXScale, xSelection, newYScale, ySelection){
    circlesTextGroup
        .transition()
        .duration(1000)
        .attr("x", d => newXScale(d[xSelection]))
        .attr("y", d => newYScale(d[ySelection]))
    return circlesTextGroup
}

function renderPlot() {
    d3.csv("assets/data/data.csv").then(data => {
        let xLinearScale = xScale(data, xSelection)
        let yLinearScale = yScale(data, ySelection)
        let bottomAxis = d3.axisBottom(xLinearScale)
        let leftAxis = d3.axisLeft(yLinearScale)
        xAxis = chartGroup
            .append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis)
        yAxis = chartGroup
            .append("g")
            .classed("y-axis", true)
            .call(leftAxis)
        let circlesGroup = chartGroup
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[xSelection]))
            .attr("cy", d => yLinearScale(d[ySelection]))
            .attr("r", 12)
            .attr("fill", "red")
            .attr("opacity", ".3")
        let circlesTextGroup = chartGroup
            .selectAll()
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d[xSelection]))
            .attr("y", d => yLinearScale(d[ySelection]))
            .style("font-size", "10px")
            .style("fill", "black")
            .style("text-acnhor", "middle")
            .text(d => d.abbr)
        let xLabels = chartGroup
            .append("g")
            .attr("transform", `translate(${width / 2}, 
                    ${height + 20})`)
        let yLables = chartGroup
            .append("g")
            .attr("transform", "rotate(-90)")
        xLabels
            .append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty")
            .classed("active", true)
            .text("In Poverty")
        xLabels
            .append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age")
            .classed("inactive", true)
            .text("Age")
        yLables
            .append("text")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .attr("value", "healthcare")
            .classed("active", true)
            .text("Healthcare")
        yLables
            .append("text")
            .attr("y", 20 - margin.left)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .attr("value", "smokes")
            .classed("inactive", true)
            .text("Smokes")
        
        xLabels.selectAll("text").on("click", function() {
            let xValue = d3.select(this).attr("value")
            if (xValue !== xSelection) {
                xSelection = xValue
                xLinearScale = xScale(data, xSelection)
                xAxis = renderXAxes(xLinearScale, xAxis)
                circlesGroup = renderCircles(
                    circlesGroup,
                    xLinearScale,
                    xSelection,
                    yLinearScale,
                    ySelection
                )
                circlesTextGroup = renderCirclesTextGroup(
                    circlesTextGroup,
                    xLinearScale,
                    xSelection,
                    yLinearScale,
                    ySelection
                )
            }
        })
        yLables.selectAll("text").on("click", function() {
            let yValue = d3.select(this).attr("value")
            if (yValue !== ySelection) {
                ySelection = yValue
                yLinearScale = yScale(data, ySelection)
                yAxis = renderYAxes(yLinearScale, yAxis)
                circlesGroup = renderCircles(
                    circlesGroup,
                    xLinearScale,
                    xSelection,
                    yLinearScale,
                    ySelection
                )
                circlesTextGroup = renderCirclesTextGroup(
                    circlesTextGroup,
                    xLinearScale,
                    xSelection,
                    yLinearScale,
                    ySelection
                )
            }
        })
    })
}
renderPlot()