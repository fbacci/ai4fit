function drawPieChart(percent) {
    var width = 500, height = 447, margin = 40;
    var legendRectSize = 18, legendSpacing = 4;

    var radius = Math.min(width, height) / 2 - margin;

    var w = $('#piechartDiv').width(), h = $('#piechartDiv').height() - margin;

    var svg = d3.select("#piechart")
        .append("svg")
        .attr("id", "svgPie")
        .attr("preserveAspectRatio", "xMinYMin")
        .attr('viewBox', function () {
            if (!($('#inputQuestion')).val().includes('login')) {
                return '0 0 ' + w + ' ' + h;
            } else {
                return '0 0 ' + w + ' ' + (h + h / 2);
            }
        })
        .append('g')
        .attr('transform', function () {
            if ($('#rowLine').hasClass('hidden') && $('#rowBar').hasClass('hidden')) {
                return 'translate(' + ($('#svgPie').width() / 2 - 45) + ', ' + ($('#piechartDiv').height() / 2 - 30) + ')'
            } else {
                return 'translate(' + ($('#svgPie').width() / 2 - 45) + ', ' + (($('#piechartDiv').height() / 2) - 10) + ')'
            }
        });

// set the color scale
    var color = d3.scaleOrdinal()
        .domain(percent)
        .range(["#FF7193", "#FAB82A", "#0300BD", "#963FB8", "#f07bec", "#f0d47b", "#15cb26"]);

    var pie = d3.pie()
        .value(function (d) {
            if (d.value !== 0) {
                return d.value;
            } else return null;
        });

    var data_ready = pie(d3.entries(percent));

    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function (d) {
            return (color(d.data.key))
        })
        .attr("stroke", "black")
        .style("stroke-width", "1px");

// Now add the annotation. Use the centroid method to get the best coordinates
    svg.selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function (d) {
            if (d.value !== 0 && d.value > 7) {
                return d.value + "%";
            } else return null;
        })
        .attr("transform", function (d) {
            return "translate(" + arcGenerator.centroid(d) + ")";
        })
        .style("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", 15);

    var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = height * color.domain().length / 2;
            var horz = -2 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(210, ' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing - 1)
        .text(function (d) {
            return d;
        })
        .style("font-size", "10pt");

}

$(document).ready(function () {
    document.addEventListener('setListenerDropdown', () => {
        $('#queryGroup').on('click', function () {
            var dropCrt = $('#queryCriterio').clone(), dropGroup = $('#queryGroup').clone();

            $.ajax({
                url: '',
                type: 'POST',
                data: $('#curLogin').text() !== '' ? {
                        question: $('#inputQuestion').val(),
                        criterio: $('#dropdownMenu4').text(),
                        group: $('#curGroup').text(),
                        orderMode: $('#dropdownMenu1').text().toLowerCase(),
                        intervallo: $('#curLogin').text()
                    } :
                    {
                        question: $('#inputQuestion').val(),
                        criterio: $('#dropdownMenu4').text(),
                        group: $('#curGroup').text(),
                        orderMode: $('#dropdownMenu1').text().toLowerCase()
                    },
                success: function (data) {
                    data = JSON.parse(data);

                    d3.select("#piechartDiv").select('#svgPie').remove();
                    d3.select("#linechart").select('#svgbar').remove();
                    d3.select("#barchartV").select('#svgBarVer').remove();
                    d3.select("#barchart").select('#svgBar').remove();
                    d3.select("#asseX").select('#xAxis').remove();

                    reset();
                    drawCharts($('#inputQuestion').val(), data);
                },
                error: function () {
                    console.log('errore 3')
                }
            })
        });
    });
});