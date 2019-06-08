function drawScatterPlot(data) {
    var h = 400;
    var padding = 40;

    var w = $('#scatterDiv').width(), height = $('#scatterDiv').height();

//scale function
    var xScale = d3.scaleLinear()
    //.domain(["Alabama","Alaska","Arizona","Arkansas","California"])
        .domain([0, d3.max(data, function (d) {
            return d.orderField;
        })])
        .range([padding, w - padding * 2]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.y;
        })])
        .range([h - padding, padding]);

    var xAxis = d3.axisBottom().scale(xScale).ticks(5);

    var yAxis = d3.axisLeft().scale(yScale).ticks(5);

//create svg element
    var svg = d3.select("#scatter")
        .append("svg")
        .attr('id', 'svgScat')
        .attr('viewBox', -padding + ' 0 ' + w + ' ' + height);

    console.log(data);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d.orderField);
        })
        .attr("cy", function (d) {
            return h - yScale(d.y);
        })
        .attr("r", 5)
        .attr("fill", function (d) {
            if (d.user_gender === 'M') {
                return 'blue';
            } else {
                return 'pink';
            }
        });

//x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

//y axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", -150)
        .style("font-size", "17px")
        .text("ASSE Y");

    svg.append("text")
        .attr("y", $('#scatterDiv').height() - 100)
        .attr("x", $('#scatterDiv').height()*2.15)
        .style("font-size", "17px")
        .text("ASSE X");
}