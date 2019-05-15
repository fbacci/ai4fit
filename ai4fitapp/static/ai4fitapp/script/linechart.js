var width = 850;
var height = 300;
var duration = 250;

var margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 50
};

/* Add Axis into SVG */
var xScale = d3.scalePoint().range([0, 600]);

var yScale = d3.scaleLinear()
  .range([height, 0])
  .domain(d3.extent(results, function(d) {
    return d[1];
  }));

var xAxis = d3.axisBottom(xScale).ticks(7),
  yAxis = d3.axisLeft(yScale).ticks(5);

var plotLine = d3.line()
  .curve(d3.curveLinear)
  .x(function(d) {
    return xScale(d[0]);
  })
  .y(function(d) {
    return yScale(d[1]);
  });

xScale.domain(results.map(function(d) {
    return d[0];
}));

var svg = d3.select("#linechart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
  .call(xAxis);

svg.append("text")
    .attr("transform", "translate(630, 350)")
    .text("Data")

svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .call(yAxis);

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20)
    .attr("x",-120)
    .text("Totale accessi");

var line = svg.append("path").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .data([results])
        .attr("d", plotLine)
        .attr("stroke", "dodgerblue")
        .attr("stroke-width", "2")
        .attr("fill", "none");

/* Add circles in the line */
var toolt = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

svg.selectAll("dot")
    .data(results)
    .enter().append("circle")
    .attr("r", 3.5)
    .attr("cx", function(d) { return xScale(d[0]) + 50; })
    .attr("cy", function(d) { return yScale(d[1]) + 20; })
    .attr("fill", "#1034A6")
    .on("mouseover", function(d) {
            toolt.transition()
                .duration(200)
                .style("opacity", .9);
            toolt.html("Accessi: " + "<br/>" + d[1])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");

    })
    .on("mouseout", function(d) {
        toolt.transition()
            .duration(500)
            .style("opacity", 0);
    });