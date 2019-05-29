function drawLineChart(data) {
    var width = 700, height = setLinechartHeight();

    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    };

    /* Add Axis into SVG */
    var xScale = d3.scalePoint().range([0, width - 100]);

    var yScale = d3.scaleLinear()
        .range([height - 50, 0])
        .domain([0, d3.max(data, function (d) {
            return d[1];
        })]);

    var xAxis = d3.axisBottom(xScale).ticks(7),
        yAxis = d3.axisLeft(yScale).ticks(5);

    var plotLine = d3.line()
        .curve(d3.curveLinear)
        .x(function (d) {
            return xScale(d[0]);
        })
        .y(function (d) {
            return yScale(d[1]);
        });

    xScale.domain(data.map(function (d) {
        return d[0];
    }));

    var svg = d3.select("#linechart").append("svg")
        .attr('id', 'svgbar')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + (height - 30) + ")")
        .call(xAxis).selectAll("text")
        .style("text-anchor", "middle");

    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(yAxis);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20)
        .attr("x", -120)
        .text("Totale accessi");

    var line = svg.append("path").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .data([data])
        .attr("d", plotLine)
        .attr("stroke", "dodgerblue")
        .attr("stroke-width", "2")
        .attr("fill", "none");

    /* Add circles in the line */
    var toolt = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function (d) {
            return xScale(d[0]) + 50;
        })
        .attr("cy", function (d) {
            return yScale(d[1]) + 20;
        })
        .attr("fill", "#1034A6")
        .on("mouseover", function (d) {
            toolt.transition()
                .duration(200)
                .style("opacity", .9);
            toolt.html("Accessi: " + "<br/>" + d[1])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");

        })
        .on("mouseout", function (d) {
            toolt.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

$(document).ready(function () {
    var currentRange = $('#dropdownMenu5').text();

    $('#intervallo').on("click", function () {
        if (currentRange !== $('#dropdownMenu5').text()) {
            currentRange = $('#dropdownMenu5').text();
            $.ajax({
                url: '',
                type: 'POST',
                data: {
                    question: $('#inputQuestion').val(),
                    intervallo: currentRange
                },
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select("#linechart").select("#svgbar").remove();
                    manageErrors();
                    setFeedbackColor();
                    if ($('#barchartDiv').hasClass('hidden')) {
                        $('#numres').text('Risultati trovati: '.concat(getNumRes(data)));
                        drawLineChart(data)
                    } else {
                        drawLineChart(data[(data.length) - 1])
                    }
                },
                error: function () {
                    console.log('errore 3')
                }
            })
        }
    });

    $('#btnDate').on("click", function () {
        $.ajax({
            url: '',
            type: 'POST',
            data: {question: $('#inputQuestion').val(), data1: $('#d1').val(), data2: $('#d2').val()},
            success: function (data) {
                data = JSON.parse(data);
                d3.select("#linechart").select('#svgbar').remove();
                drawLineChart(data);
            },
            error: function () {
                console.log("errore 6");
            }
        })
    });
});