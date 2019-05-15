var margin = {top: 20, right: 20, bottom: 30, left: 80},
width = 660 - margin.left - margin.right,
height = getHeight(results) + 25;

var y = d3.scalePoint()
    .domain(results.map(function(d) { return d[0]; }))
    .range([getHeight(results), 0]).padding(0.35);

var x = d3.scaleLinear()
      .range([2, width])
      .domain([0, d3.max(results, function(d){ return d[1]; })]);

var svg = d3.select("#barchart").append("svg")
    .attr("id", "svgbar")
    .attr("padding_bottom", "25")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height)
    .append("g")
        .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

populateBar(results, x, y);

var toolt = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function populateBar(list, newx, newy){
    svg.selectAll(".bar")
          .data(list)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("width", function(d) { return newx(d[1]); } )
          .attr("height", 15)
          .attr("y", function(d) { return newy(d[0]) - 7.5; })
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
    $('document').ready(function () {
    var currentSort = $('#dropdownMenu1').html();

        $('#ordinamento').on("click", function () {
            if(currentSort !== $('#dropdownMenu1').html()){
                currentSort = $('#dropdownMenu1').html();
                var newData = changeSortMethod(results);
                changeSortBar(newData, x, y);
            }
        });
    });

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
        newData = getNewList(results, sliderRange.value()[0], sliderRange.value()[1]);
        x.domain([sliderRange.value()[0] - 1, sliderRange.value()[1]])
        y.domain(newData.map(function(d) { return d[0]; })).range([getHeight(newData), 0]);
        svg.selectAll('.bar').remove();
        svg.selectAll('g').remove();
        document.getElementById('svgbar').setAttribute("height", getHeight(newData) + 25);
        document.getElementById("numres").innerText=newData.length;
        d3.select(svg).remove();
        populateBar(newData, x, y);
        d3.select("#xAxis").select("g")
            .call(d3.axisBottom(x).ticks(6));
    }

    function changeSortBar(newData){
        if(entities.hasOwnProperty("get_vote")){
            newData = getNewList(newData, sliderRange.value()[0], sliderRange.value()[1]);
            x.domain([sliderRange.value()[0] - 1, sliderRange.value()[1]])
        } else if(entities.hasOwnProperty('get_calories') || entities.hasOwnProperty('get_avg_speed')){
            var min = d3.min(newData, function(d){ return d[1]; });
            var max = d3.max(newData, function(d){ return d[1]; });
            newData = getNewList(newData, min, max);
            x.domain([min, max])
        }

        y.domain(newData.map(function(d) { return d[0]; })).range([getHeight(newData), 0]);
        svg.selectAll('.bar').remove();
        svg.selectAll('g').remove();
        populateBar(newData, x, y);
        d3.select("#xAxis").select("g")
            .call(d3.axisBottom(x).ticks(6));
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
    .call(d3.axisBottom(x).ticks(6));

function getHeight(data){
    var h = 300;

    switch(data.length){
        case 10: return h;
        default: return h + (((data.length - 10)/10) * 250);
    }
}