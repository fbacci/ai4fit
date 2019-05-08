var margin = {top: 20, right: 20, bottom: 30, left: 80},
width = 660 - margin.left - margin.right,
height = 1000 - margin.top - margin.bottom;

var y = d3.scaleBand()
      .range([height, 0])
      .padding(0.15);

var x = d3.scaleLinear()
      .range([2, width]);

var svg = d3.select("#barchart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height +  margin.top + 1)
    .append("g")
        .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


x.domain([0, d3.max(results, function(d){ return d[1]; })])
y.domain(results.map(function(d) { return d[0]; }));

populateBar(results, x, y);

var toolt = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

function populateBar(list, newx, newy){
    svg.selectAll(".bar")
      .data(list)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("width", function(d) {return newx(d[1]); } )
      .attr("y", function(d) { return newy(d[0]); })
      .attr("height", 15)
      .on("mouseover", function(d) {
                toolt.transition()
                    .duration(200)
                    .style("opacity", .9);
                toolt.html(d[0] + "<br/>"  + d[1])
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");

            })
      .on("mouseout", function(d) {
            toolt.transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this).attr("class", "bar");
        });

    svg.append("g")
        .call(d3.axisLeft(newy));
}

if(mode === 2){
    var sliderRange = d3.sliderBottom()
        .min(1)
        .max(5)
        .step(1)
        .width(250)
        .ticks(5)
        .default([1, 5])
        .fill('dodgerblue')
        .on('onchange', val =>{
            changeBar();
        });

    var gRange = d3
        .select('div#slider-range')
        .append('svg')
        .attr('width', 300)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(20,30)');

    gRange.call(sliderRange);

    function changeBar(){
        newData = getListByMark(results, sliderRange.value()[0], sliderRange.value()[1]);
        x.domain([sliderRange.value()[0], sliderRange.value()[1]])
        y.domain(newData.map(function(d) { return d[0]; }));
        svg.selectAll('.bar').remove();
        svg.selectAll('g').remove();
        populateBar(newData, x, y);
        d3.select("#xAxis").select("g")
            .call(d3.axisBottom(x).ticks(5));
    }
}

svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -65)
      .attr("x",-margin.left*1.7)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Nome atleta");

d3.select("#xAxis")
    .attr("height", margin.top)
    .attr("width", 650)
    .append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisBottom(x).ticks(5));