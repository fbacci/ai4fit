function drawPieChart(percent) {
    var width = 450, height = 350, margin = 40;
    var legendRectSize = 18, legendSpacing = 4;

    var radius = Math.min(width, height) / 2 - margin;

    var svg = d3.select("#piechart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// set the color scale
    var color = d3.scaleOrdinal()
        .domain(percent)
        .range(["#FF7193", "#FAB82A", "#0300BD", "#963FB8", "#f07bec", "#f0d47b", "#15cb26"]);

    var pie = d3.pie()
        .value(function (d) {
            if(d.value !== 0) {
                return d.value;
            } else return null;
        });

    var data_ready = pie(d3.entries(percent))
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

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
        .style("stroke-width", "1px")

// Now add the annotation. Use the centroid method to get the best coordinates
    svg.selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function (d) {
            if(d.value !== 0) {
                return d.value + "%";
            } else return null;
        })
        .attr("transform", function (d) {
            return "translate(" + arcGenerator.centroid(d) + ")";
        })
        .style("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", 17);

    var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = height * color.domain().length / 2;
            var horz = -2 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(150, ' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d) {
            return d;
        });

    d3.selectAll(".bar")
        .on("mouseover", function (d) {
            d3.selectAll('.tooltip').transition()
                .duration(200)
                .style("opacity", .9);
            d3.selectAll('.tooltip').html(d.item_user_id + " - " + d.avg + "<br/>" + d.eta)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

            d3.select(this)
                .style('fill', function (d) {
                    if (d.eta > 17 && d.eta < 25) {
                        return "#FF7193";
                    }

                    if (d.eta > 24 && d.eta < 40) {
                        return "#FAB82A";
                    }

                    if (d.eta > 39 && d.eta < 56) {
                        return "#0300BD";
                    }

                    if (d.eta > 55 && d.eta < 69) {
                        return "#963FB8";
                    }
                });

        })
        .on("mouseout", function (d) {
            d3.selectAll('.tooltip').transition()
                .duration(500)
                .style("opacity", 0);

            d3.select(this).style('fill', 'dodgerblue');
        });
}