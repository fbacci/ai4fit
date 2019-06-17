function drawLineChart(data) {
    data = manageDateFormat(data);

    var height;
    var w = $('#barLineCol').width(), h = $('#barLineCol').height();

    if ($('#inputQuestion').val().includes('login') && ($('#inputQuestion').val().includes('atleti con')
        || $('#inputQuestion').val().includes('migliori')) && $('#inputQuestion').val().includes('raggruppati')) {
        height = 250;
        $('#linechart').addClass('pt-3');
    } else {
        if ($('#inputQuestion').val().includes('atleti con') || $('#inputQuestion').val().includes('migliori')) {
            height = 510;
            $('#chooseDate').addClass('mt-5');
        } else {
            if (!$('#inputQuestion').val().includes('raggruppati')) {
                height = 400;
                $('#chooseDate').removeClass('mt-5');
            } else {
                height = 700;
                $('#chooseDate').addClass('mt-5');
            }
        }

        $('#linechart').removeClass('pt-3');
    }

    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    };

    /* Add Axis into SVG */
    var xScale = d3.scalePoint().range([0, w]);

    if ($('#inputQuestion').val().includes('raggruppati')) {
        if ($('#inputQuestion').val().includes('atleti con') || $('#inputQuestion').val().includes('migliori')) {
            var yScale = d3.scaleLinear()
                .range([height - 50, 0])
                .domain([0, d3.max(data, function (d) {
                    return d[1];
                })]);
            $('#linechart').css('width', '');
        } else {
            var yScale = d3.scaleLinear()
                .range([height + 100, 0])
                .domain([0, d3.max(data, function (d) {
                    return d[1];
                })]);

            $('#linechart').css('width', w / 2);
        }
    } else {
        if ($('#inputQuestion').val().includes('atleti con') || $('#inputQuestion').val().includes('migliori')) {
            var yScale = d3.scaleLinear()
                .range([height * 2, 0])
                .domain([0, d3.max(data, function (d) {
                    return d[1];
                })]);
            $('#linechart').css('width', '');
        } else {
            var yScale = d3.scaleLinear()
                .range([height - 50, 0])
                .domain([0, d3.max(data, function (d) {
                    return d[1];
                })]);

            $('#linechart').css('width', '');
        }
    }

    var xAxis = d3.axisBottom(xScale).ticks(7),
        yAxis = d3.axisLeft(yScale).ticks(5);

    var plotLine = d3.line()
        .curve(d3.curveLinear)
        .x(function (d) {
            return xScale(d[0]);
        })
        .y(function (d) {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                if ($('#inputQuestion').val().includes('atleti con') || $('#inputQuestion').val().includes('migliori')) {
                    return yScale(d[1]);
                } else {
                    return yScale(d[1]) - 15;
                }
            } else {
                if ($('#inputQuestion').val().includes('atleti con') || $('#inputQuestion').val().includes('migliori')) {
                    return yScale(d[1]) - 20;
                } else {
                    return yScale(d[1]);
                }
            }
        });

    xScale.domain(data.map(function (d) {
        return d[0];
    }));

    var svg = d3.select("#linechart").append("svg")
        .attr('id', 'svgbar')
        .attr('viewBox', function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                if ($('#inputQuestion').val().includes('atleti con') || $('#inputQuestion').val().includes('migliori')) {
                    return '-40 0 ' + (w + 120) + ' ' + height;
                } else {
                    return '-40 0 ' + (w + 200) + ' ' + (height + 200);
                }
            } else {
                if ($('#inputQuestion').val().includes('atleti con') || $('#inputQuestion').val().includes('migliori')) {
                    return '-40 -10 ' + (w + 200) + ' ' + (height * 2 + 50);
                } else {
                    return '-40 0 ' + (w + 130) + ' ' + height;
                }
            }
        })
        .attr('transform', function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                if ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con')) {
                    return "translate(" + margin.left / 2 + ', ' + -margin.top / 2 + ")"
                } else {
                    return "translate(" + margin.left + ", " + margin.top + ")"
                }
            } else {
                if ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con')) {
                    return "translate(" + margin.bottom + ", 5)"
                } else {
                    return "translate(" + (margin.bottom + 20) + ', ' + -margin.top / 2 + ")"
                }
            }
        });

    svg.append("g")
        .attr("transform", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                if ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con')) {
                    return "translate(" + margin.left + "," + (height - 30) + ")"
                } else {
                    return "translate(" + margin.left + "," + (height + 105) + ")"
                }
            } else {
                if ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con')) {
                    return "translate(" + margin.left + "," + (height + 510) + ")"
                } else {
                    return "translate(" + margin.left + "," + (height - 30) + ")"
                }
            }
        })
        .call(xAxis).selectAll("text")
        .style("text-anchor", "middle")
        .style("font-size", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                if ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con')) {
                    return "15px"
                } else {
                    return "25px";
                }
            } else {
                if ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con')) {
                    return "25px";
                } else {
                    return "15px";
                }
            }
        });

    svg.append("g")
        .attr("transform", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                if ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con')) {
                    return "translate(" + margin.left + "," + margin.top + ")"
                } else {
                    return "translate(" + margin.left + ", 5)"
                }
            } else {
                if ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con')) {
                    return "translate(" + margin.left + ",0)"
                } else {
                    return "translate(" + margin.left + "," + margin.top + ")"
                }
            }
        })
        .style("font-size", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                if ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con')) {
                    return "15px"
                } else {
                    return "25px";
                }
            } else {
                if ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con')) {
                    return "25px";
                } else {
                    return "15px";
                }
            }
        })
        .call(yAxis);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                if ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con')) {
                    return -15;
                } else {
                    return -10;
                }
            } else {
                if ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con')) {
                    return -10;
                } else {
                    return -15;
                }
            }
        })
        .attr("x", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                if ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con')) {
                    return -150;
                } else {
                    return -230;
                }
            } else {
                if ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con')) {
                    return -230;
                } else {
                    return -150;
                }
            }
        })
        .style("font-size", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                if ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con')) {
                    return "20px";
                } else {
                    return "40px";
                }
            } else {
                if ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con')) {
                    return "40px"
                } else return "20px";
            }
        })
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
            if ($('#inputQuestion').val().includes('raggruppati')) {
                if ($('#inputQuestion').val().includes('atleti con') || $('#inputQuestion').val().includes('migliori')) {
                    return yScale(d[1]) + 20;
                } else {
                    return yScale(d[1]) + 5;
                }
            } else {
                if ($('#inputQuestion').val().includes('atleti con') || $('#inputQuestion').val().includes('migliori')) {
                    return yScale(d[1]);
                } else {
                    return yScale(d[1]) + 20;
                }
            }
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
    document.addEventListener('setListenerDropdown', () => {
        $('#queryLogin').on("click", function () {
            $('#d1').val('');
            $('#d2').val('');

            $.ajax({
                url: '',
                type: 'POST',
                data: (!($('#inputQuestion').val().includes('migliori'))) ?
                    {
                        question: $('#inputQuestion').val(),
                        criterio: $('#curCriterio').text(),
                        orderMode: $('#dropdownMenu1').text().toLowerCase(),
                        group: $('#curGroup').text(),
                        intervallo: $('#curLogin').text()
                    } : {
                        question: $('#inputQuestion').val(),
                        criterio: $('#dropdownMenu4').text(),
                        group: $('#curGroup').text(),
                        intervallo: $('#curLogin').text(),
                        orderMode: $('#dropdownMenu1').text().toLowerCase()
                    },
                success: function (data) {
                    data = JSON.parse(data);

                    d3.select("#linechart").select('#svgbar').remove();
                    d3.select("#piechartDiv").select('#svgPie').remove();
                    d3.select("#barchartV").select('#svgBarVer').remove();
                    d3.select("#barchart").select('#svgBar').remove();
                    d3.select("#asseX").select('#xAxis').remove();

                    if ($('#inputQuestion').tagsinput('items').length === 1) {
                        setNumRes($('#inputQuestion').val(), data);
                        drawLineChart(data);
                    } else {
                        reset();
                        drawCharts($('#inputQuestion').val(), data)
                    }
                },
                error: function () {
                    console.log('errore 3')
                }
            })
        });

        $('#btnDate').on("click", function () {
            $.ajax({
                url: '',
                type: 'POST',
                data: {
                    question: $('#inputQuestion').val(),
                    criterio: $('#curCriterio').text(),
                    group: $('#curGroup').text(),
                    orderMode: $('#dropdownMenu1').text().toLowerCase(),
                    data1: $('#d1').val(), data2: $('#d2').val()
                },
                success: function (data) {
                    data = JSON.parse(data);
                    setValue($('#inputQuestion').val());

                    d3.select("#linechart").select('#svgbar').remove();
                    d3.select("#piechartDiv").select('#svgPie').remove();
                    d3.select("#barchartV").select('#svgBarVer').remove();
                    d3.select("#barchart").select('#svgBar').remove();
                    d3.select("#asseX").select('#xAxis').remove();

                    if ($('#inputQuestion').tagsinput('items').length == 1) {
                        setNumRes($('#inputQuestion').val(), data);
                        drawLineChart(data);
                    } else {
                        reset();
                        drawCharts($('#inputQuestion').val(), data)
                    }
                },
                error: function () {
                    console.log("errore 6");
                }
            })
        });
    });
});

function manageDateFormat(d) {
    var i;

    if ($('#curLogin').text() === 'anno' || d.length > 9) {
        for (i = 0; i < d.length; i++) {
            d[i][0] = d[i][0].substr(d[i][0].length - 7)
        }
    }

    return d;
}