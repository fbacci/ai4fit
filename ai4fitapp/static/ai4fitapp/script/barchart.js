function drawChart(data) {
    $('#barchartV').addClass('hidden');
    $('#asseX').removeClass('hidden');
    $('#barchart').removeClass('hidden');

    var w = $('#barchartDiv').width(), h = $('#barchartDiv').height();
    var wX = $('#asseX').width(), hX = $('#asseX').height();

    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = 700;
    var height = getHeight(data) + margin.bottom;

    if (data.length < 20 && ($('#piechartDiv').hasClass('hidden'))) {
        var y = d3.scalePoint()
            .domain(data.map(function (d) {
                return d.item_user_id;
            }))
            .range([getHeight(data), 0]).padding(0.55);
    } else {
        var y = d3.scalePoint()
            .domain(data.map(function (d) {
                return d.item_user_id;
            }))
            .range([getHeight(data), 0]).padding(0.55);
    }

    var x = d3.scaleLinear()
        .range([2, width])
        .domain([0, d3.max(data, function (d) {
            return d.orderField;
        })]);

    var xAxis = d3.scaleLinear()
        .range([2, width + 200])
        .domain([0, d3.max(data, function (d) {
            return d.orderField;
        })]);

    if (!($('#inputQuestion').val().includes('login'))) {
        if (!$('#inputQuestion').val().includes('ordina')) {
            $('#barchart').css('height', '480px');
        } else {
            if ($('#curCriterio').text() === 'voto') {
                $('#barchart').css('height', '400px');
            } else {
                $('#barchart').css('height', '480px');
            }
        }
    } else {
        if ($('#inputQuestion').val().includes('raggruppati')) {
            $('#barchart').css('height', '200px');
        } else {
            $('#barchart').css('height', '480px');
        }
    }

    var svg = d3.select("#barchart")
        .append("svg")
        .attr("id", "svgBar")
        .attr('viewBox', function () {
            if (!($('#inputQuestion').val().includes('login'))) {
                if (!($('#inputQuestion').val().includes('raggruppati'))) {
                    return '0 0 ' + (w - 298) + ' ' + height;
                } else {
                    return '0 0 ' + (w + 150) + ' ' + height;
                }
            } else {
                if (!($('#inputQuestion').val().includes('raggruppati'))) {
                    if (data.length > 20) {
                        return '0 0 ' + (w + 170) + ' ' + height;
                    } else {
                        return '0 0 ' + (w + 170) + ' ' + height * 2;
                    }
                } else {
                    return '0 0 ' + (w * 1.2) + ' ' + height;
                }
            }
        })
        .append("g")
        .attr("transform",
            function () {
                if ($('#inputQuestion').val().includes('raggruppati')) {
                    return "translate(" + margin.left * 1.3 + ', ' + margin.top + ")";
                } else {
                    if ($('#inputQuestion').val().includes('login')) {
                        return "translate(" + margin.left + ', ' + margin.top + ")"
                    } else {
                        return "translate(" + (margin.left * 2 + 2) + ', ' + margin.top + ")"
                    }
                }
            });

    populateBar(data, svg, x, y, height);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                return -95;
            } else {
                if ($('#inputQuestion').val().includes('login')) {
                    return -85;
                } else {
                    return -65;
                }
            }
        })
        .attr("x", -80)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                return "20px";
            } else {
                if ($('#inputQuestion').val().includes('login')) {
                    return "20px"
                } else {
                    return "13px";
                }
            }
        })
        .text("Codice atleta");

    d3.select("#asseX").append('svg')
        .attr('id', 'xAxis')
        .attr("viewBox", function () {
            if (!($('#inputQuestion').val().includes('login'))) {
                if (!($('#inputQuestion').val().includes('raggruppati'))) {
                    return (-margin.left * 2.55) + ' 0 ' + (wX - 10) + ' ' + hX;
                } else {
                    return (-margin.left - 52) + ' 0 ' + wX * 1.6 + ' ' + hX;
                }
            } else {
                if ($('#inputQuestion').val().includes('raggruppati')) {
                    return (-margin.left - 51) + ' -2 ' + (wX * 1.5 + 55) + ' ' + hX;
                } else {
                    return (-margin.left - 20) + ' -2 ' + (wX * 1.5 + 110) + ' ' + hX;
                }
            }
        })
        .append("g")
        .style("font-size", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                return "18px";
            } else {
                if ($('#inputQuestion').val().includes('login')) {
                    return "17px"
                } else {
                    return "10px";
                }
            }
        })
        .call(d3.axisBottom(xAxis).ticks(6));

    d3.select('#asseX').select('svg')
        .append("text")
        .attr("y", 38)
        .attr("x", function () {
            if ($('#piechartDiv').hasClass('hidden')) {
                if ($('#inputQuestion').val().includes('login')) {
                    return $('#asseX').width() + 200;
                } else {
                    return $('#asseX').width() - 450;
                }
            } else {
                return $('#asseX').width() + 100;
            }
        })
        .style("text-anchor", "middle")
        .style("font-size", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                return "20px";
            } else {
                if ($('#inputQuestion').val().includes('login')) {
                    return "25px"
                } else {
                    return "15px";
                }
            }
        })
        .text(setAxisText());

    var toolt = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
}

function populateBar(list, svgVar, newx, newy) {
    svgVar.selectAll(".bar")
        .data(list)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("width", function (d) {
            return newx(d.orderField);
        })
        .attr("height", function () {
            if (list.length < 20 && ($('#piechartDiv').hasClass('hidden'))) {
                return 20;
            } else {
                return 15;
            }
        })
        .attr("y", function (d) {
            if (list.length < 20 && ($('#piechartDiv').hasClass('hidden'))) {
                return newy(d.item_user_id) - 11.5;
            } else {
                return newy(d.item_user_id) - 7.5;
            }
        })
        .on("mouseover", function (d) {
                d3.selectAll('.tooltip').transition()
                    .duration(200)
                    .style("opacity", .9);
                d3.selectAll('.tooltip').html(function () {
                    if ($('#inputQuestion').val().includes('migliori')) {
                        return "<b>id: </b>" + d.item_user_id + "<br/><b>" + $('#dropdownMenu4').text() + ": </b>" + d.orderField
                    } else {
                        return "<b>id: </b>" + d.item_user_id + "<br/><b>" + $('#curCriterio').text() + ": </b>" + d.orderField
                    }
                })
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            d3.selectAll('.tooltip').transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this).attr("class", "bar");
        });

    svgVar.append("g")
        .style("font-size", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                return "15px";
            } else {
                if ($('#inputQuestion').val().includes('login')) {
                    return "15px"
                } else {
                    return "10px";
                }
            }
        })
        .call(d3.axisLeft(newy));
}

function drawVerChart(data) {
    $('#barchart').addClass('hidden');
    $('#asseX').addClass('hidden');
    $('#barchartV').removeClass('hidden');

    if (data.length > 20) {
        $('#barchartV').css('overflow-x', 'scroll');
    } else {
        if ($('#inputQuestion').val().includes('login') && data.length > 5) {
            $('#barchartV').css('overflow-x', 'scroll');
        } else $('#barchartV').css('overflow-x', 'hidden');
    }

    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = getWidth(data), height = 440;
    var w = $('#barLineCol').width(), h = $('#barLineCol').height(),
        wY = $('#asseY').width(), hY = $('#asseY').height();

    if ($('#inputQuestion').val().includes('raggruppati')) {
        $('#barchartV').css('width', (w - 50));
    } else if ($('#inputQuestion').val().includes('login')) {
        $('#barchartV').css('width', (w / 2));
    } else {
        $('#barchartV').css('width', '');
    }

    var x = d3.scalePoint()
        .range([getWidth(data), 0])
        .domain(data.map(function (d) {
            return d.item_user_id;
        })).padding(0.35);

    var y = d3.scaleLinear()
        .range([height - 80, 0])
        .domain([0, d3.max(data, function (d) {
            return d.orderField;
        })]);

    var svg = d3.select("#barchartV").append("svg")
        .attr('height', function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                if ($('#inputQuestion').val().includes('ordina') && $('#curCriterio').text() === 'voto') {
                    return h - 120;
                } else {
                    return h - 100;
                }
            } else {
                if ($('#inputQuestion').val().includes('ordina') && $('#curCriterio').text() === 'voto') {
                    return h - 180;
                } else {
                    return h - 120;
                }
            }
        })
        .attr("id", "svgBarVer")
        .attr('viewBox', function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                return (-margin.bottom - 10) + ' 0 ' + (width + 120) + ' ' + (h - 120)
            } else {
                if (data.length < 16 && (($('#inputQuestion').val().includes('migliori') ||
                    $('#inputQuestion').val().includes('atleti con')) &&
                    (!$('#inputQuestion').val().includes('raggruppati')
                        || !$('#inputQuestion').val().includes('login')))) {
                    return (-margin.bottom - 10) + ' ' + margin.top / 2 + ' ' + (width + width / 2) + ' ' + (h - 130);
                }
                if (data.length < 20 && (($('#inputQuestion').val().includes('migliori') ||
                    $('#inputQuestion').val().includes('atleti con')) &&
                    (!$('#inputQuestion').val().includes('raggruppati')
                        || !$('#inputQuestion').val().includes('login')))) {
                    return (-margin.bottom - 10) + ' ' + margin.top / 2 + ' ' + (width + width / 1.5) + ' ' + (h - 130);
                } else {
                    return (-margin.bottom - 10) + ' ' + margin.top / 2 + ' ' + (width + 65) + ' ' + (h - 130);
                }
            }
        })
        .append("g")
        .attr("transform", function () {
                if (data.length < 16 && (($('#inputQuestion').val().includes('migliori') ||
                    $('#inputQuestion').val().includes('atleti con')) &&
                    ((!($('#inputQuestion').val().includes('raggruppati')))
                        && (!$('#inputQuestion').val().includes('login'))))) {
                    return "translate(" + margin.left * 2 + ', ' + margin.top + ")"
                } else if (data.length < 20 && (($('#inputQuestion').val().includes('migliori') ||
                    $('#inputQuestion').val().includes('atleti con')) &&
                    ((!$('#inputQuestion').val().includes('raggruppati'))
                        && (!$('#inputQuestion').val().includes('login'))))) {
                    return "translate(" + margin.left + ', ' + margin.top + ")"
                } else {
                    return "translate(" + margin.top + ', ' + margin.top + ")"
                }
            }
        );

    populateVerBar(data, svg, x, y, height);

    svg.append("g").attr('transform', 'translate(0,' + (height - 50) + ')')
        .call(d3.axisBottom(x)).selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    svg.append("g").attr('transform', 'translate(0, ' + margin.bottom + ')')
        .call(d3.axisLeft(y)).selectAll("text")
        .style("text-anchor", "middle")
        .attr("dx", "-.8em")
        .attr("dy", ".15em");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -45)
        .attr("x", -margin.left * 2)
        .style("font-size", "17px")
        .text(setAxisText());

    svg.append("text")
        .attr("y", height)
        .attr("x", function () {
            if ($('#inputQuestion').val().includes('ordina') && $('#curCriterio').text() === 'voto') {
                return $('#barchartV').width() - 200;
            } else {
                return $('#barchartV').width() - 380;
            }
        })
        .style("font-size", "14px")
        .text('Codice Atleta');

    var toolt = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
}

function populateVerBar(list, svgVar, newx, newy, height) {
    svgVar.selectAll(".bar")
        .data(list)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("width", 25)
        .attr("height", function (d) {
            return height - newy(d.orderField) - 80;
        })
        .attr("x", function (d) {
            return newx(d.item_user_id) - 10.5;
        })
        .attr("y", function (d) {
            return (newy(d.orderField) + 30);
        })
        .on("mouseover", function (d) {
            d3.selectAll('.tooltip').transition()
                .duration(200)
                .style("opacity", .9);
            d3.selectAll('.tooltip').html(function () {
                if ($('#inputQuestion').val().includes('migliori')) {
                    return "<b>id: </b>" + d.item_user_id + "<br/><b>" + $('#dropdownMenu4').text() + ": </b>" + d.orderField
                } else {
                    return "<b>id: </b>" + d.item_user_id + "<br/><b>" + $('#curCriterio').text() + ": </b>" + d.orderField
                }
            })
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

        })
        .on("mouseout", function (d) {
            d3.selectAll('.tooltip').transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this).attr("class", "bar");
        });
}

function setAxisText() {
    var value = $('#inputQuestion').val();

    if (value.includes('ordina') || value.includes('migliori')) {
        var currentMode;

        if (value.includes('ordina')) {
            currentMode = $('#curCriterio').text()
        } else {
            currentMode = $('#dropdownMenu4').text()
        }

        if (currentMode === 'calorie') {
            return 'Calorie';
        } else if (currentMode === 'velocità') {
            return 'Velocità media';
        } else {
            return 'Voto';
        }
    } else if (value.includes('atleti con')) {
        if (value.includes('atleti con bpm')) {
            return "bpm";
        } else if (value.includes('atleti con età')) {
            return "Età"
        }
    }
}

$(document).ready(function () {
    var sliderRange = d3.sliderBottom()
        .min(1)
        .max(5)
        .step(1)
        .width(250)
        .ticks(5)
        .default([1, 5])
        .fill('dodgerblue');

    document.dispatchEvent(new Event("setListenerSlider"));

    document.addEventListener('setListenerSlider', () => {
        sliderRange.on('onchange', val => {
            $.ajax({
                url: '',
                type: 'POST',
                data: {
                    question: $('#inputQuestion').val(),
                    orderMode: $('#dropdownMenu1').text().toLowerCase(),
                    criterio: $('#curCriterio').text()
                },
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select("#barchart").select("#svgBar").remove();
                    d3.select("#barchartV").select("#svgBarVer").remove();
                    d3.select("#asseX").select("#xAxis").remove();
                    data = getNewList(data, sliderRange.value()[0], sliderRange.value()[1]);

                    setNumRes($('#inputQuestion').val(), data);

                    if ($('#dropdownMenu3').text().includes('Orizzontale')) {
                        drawChart(data);
                    } else {
                        drawVerChart(data);
                    }
                },
                error: function () {
                    console.log("errore 4");
                }
            })
        })
    });

    var gRange = d3
        .select('div#slider-range')
        .append('svg')
        .attr('width', 300)
        .attr('height', 80)
        .append('g')
        .attr('transform', 'translate(20,30)');

    gRange.call(sliderRange);

    document.addEventListener('setListenerDropdown', () => {
        $('#ordinamento').on("click", function () {
            $.ajax({
                url: '',
                type: 'POST',
                data: (!($('#inputQuestion').val().includes('migliori'))) ?
                    {
                        question: $('#inputQuestion').val(),
                        criterio: $('#curCriterio').text(),
                        orderMode: $('#dropdownMenu1').text().toLowerCase(),
                        group: $('#curGroup').text()
                    } : {
                        question: $('#inputQuestion').val(),
                        criterio: $('#dropdownMenu4').text(),
                        group: $('#curGroup').text(),
                        orderMode: $('#dropdownMenu1').text().toLowerCase()
                    },
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select('#barchart').select("#svgBar").remove();
                    d3.select("#barchartV").select("#svgBarVer").remove();
                    d3.select("#asseX").select("#xAxis").remove();

                    if ($('#inputQuestion').val().includes('ordina') && $('#curCriterio').text() === 'voto') {
                        data = getNewList(data, sliderRange.value()[0], sliderRange.value()[1])
                    }

                    var val = $('#inputQuestion').val();

                    setNumRes(val, data);

                    if (val.includes('login') && val.includes('raggruppati') &&
                        (val.includes('migliori') || val.includes('atleti con'))) {
                        $('#dropdownMenu3').text('Orizzontale');
                    }

                    //// PROBLEMA QUERY GRANDE
                    if ($('#dropdownMenu3').text().includes('Orizzontale')) {
                        if ($('#inputQuestion').val().includes('login')) {
                            drawChart(data.slice(0, data.length - 1));
                        } else drawChart(data)
                    } else {
                        if ($('#inputQuestion').val().includes('login')) {
                            drawVerChart(data.slice(0, data.length - 1));
                        } else drawVerChart(data)
                    }

                },
                error: function () {
                    console.log("errore");
                }
            })
        });

        $('#orientamento').on("click", function () {
            $.ajax({
                url: '',
                type: 'POST',
                data: (!($('#inputQuestion').val().includes('migliori'))) ?
                    {
                        question: $('#inputQuestion').val(),
                        criterio: $('#curCriterio').text(),
                        orderMode: $('#dropdownMenu1').text().toLowerCase(),
                        group: $('#curGroup').text(),
                    } : {
                        question: $('#inputQuestion').val(),
                        criterio: $('#dropdownMenu4').text(),
                        group: $('#curGroup').text(),
                        orderMode: $('#dropdownMenu1').text().toLowerCase()
                    },
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select('#barchart').select("#svgBar").remove();
                    d3.select("#barchartV").select("#svgBarVer").remove();
                    d3.select("#asseX").select("#xAxis").remove();

                    if ($('#inputQuestion').val().includes('ordina') && $('#curCriterio').text() === 'voto') {
                        data = getNewList(data, sliderRange.value()[0], sliderRange.value()[1])
                    }

                    setNumRes($('#inputQuestion').val(), data)

                    if ($('#dropdownMenu3').text().includes('Orizzontale')) {
                        if ($('#inputQuestion').val().includes('login')) {
                            drawChart(data.slice(0, data.length - 1));
                        } else drawChart(data)
                    } else {
                        if ($('#inputQuestion').val().includes('login')) {
                            drawVerChart(data.slice(0, data.length - 1));
                        } else drawVerChart(data)
                    }
                },
                error: function () {
                    console.log("errore hor");
                }
            })
        });

        $('#criterio').on("click", function () {
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
                    d3.select("#barchart").select("#svgBar").remove();
                    d3.select("#barchartV").select("#svgBarVer").remove();
                    d3.select("#asseX").select("#xAxis").remove();
                    d3.select("#asseX").select("#xAxis").remove();

                    if ($('#dropdownMenu4').text() !== 'voto' || $('#inputQuestion').val().includes('migliori')) {
                        $('#sliderVoto').addClass('hidden');
                    } else {
                        $('#sliderVoto').removeClass('hidden');
                    }

                    setNumRes($('#inputQuestion').val(), data)

                    if ($('#dropdownMenu3').text().includes('Orizzontale')) {
                        if ($('#inputQuestion').val().includes('login')) {
                            drawChart(data.slice(0, data.length - 1));
                        } else drawChart(data)
                    } else {
                        if ($('#inputQuestion').val().includes('login')) {
                            drawVerChart(data.slice(0, data.length - 1));
                        } else drawVerChart(data)
                    }
                },
                error: function () {
                    console.log('errore 3')
                }
            })
        });

        $('#queryCriterio').on("click", function () {
            $.ajax({
                url: '',
                type: 'POST',
                data: {
                    question: $('#inputQuestion').val(),
                    criterio: $('#curCriterio').text(),
                    group: $('#curGroup').text(),
                    orderMode: $('#dropdownMenu1').text().toLowerCase()
                },
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select("#barchart").select("#svgBar").remove();
                    d3.select("#barchartV").select("#svgBarVer").remove();
                    d3.select("#asseX").select("#xAxis").remove();
                    d3.select("#asseY").select("#yAxis").remove();

                    if ($('#curCriterio').text() !== 'voto' || $('#inputQuestion').val().includes('migliori')) {
                        $('#sliderVoto').addClass('hidden');
                    } else {
                        $('#sliderVoto').removeClass('hidden');
                    }

                    setNumRes($('#inputQuestion').val(), data)

                    if ($('#dropdownMenu3').text().includes('Orizzontale')) {
                        if ($('#inputQuestion').val().includes('login')) {
                            drawChart(data.slice(0, data.length - 1));
                        } else drawChart(data)
                    } else {
                        if ($('#inputQuestion').val().includes('login')) {
                            drawVerChart(data.slice(0, data.length - 1));
                        } else drawVerChart(data)
                    }
                },
                error: function () {
                    console.log('errore 3')
                }
            })
        });
    });

});