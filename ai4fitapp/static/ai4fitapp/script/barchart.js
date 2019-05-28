function drawChart(data) {
    $('#barchartV').addClass('hidden');
    $('#barchart').removeClass('hidden');

    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = 660 - margin.left - margin.right;
    var height = getHeight(data) + 35;

    var y = d3.scalePoint()
        .domain(data.map(function (d) {
            return d.item_user_id;
        }))
        .range([getHeight(data), 0]).padding(0.55);

    var x = d3.scaleLinear()
        .range([2, width])
        .domain([0, d3.max(data, function (d) {
            return d.orderField;
        })]);

    var svg = d3.select("#barchart").append("svg")
        .attr("id", "svgbar")
        .attr("padding_bottom", "25")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    populateBar(data, svg, x, y);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -65)
        .attr("x", -50)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Nome atleta");

    d3.select("#xAxis")
        .attr("height", margin.top)
        .attr("width", 650)
        .append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisBottom(x).ticks(6));

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
        .attr("height", 15)
        .attr("y", function (d) {
            return newy(d.item_user_id) - 7.5;
        })
        .on("mouseover", function (d) {
            d3.selectAll('.tooltip').transition()
                .duration(200)
                .style("opacity", .9);
            d3.selectAll('.tooltip').html(d.item_user_id + "<br/>" + d.orderField)
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
        .call(d3.axisLeft(newy));
}

function drawVerChart(data) {
    $('#barchartV').removeClass('hidden');
    $('#barchart').addClass('hidden');
    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = getWidth(data);
    var height = 320;

    var x = d3.scalePoint()
        .range([getWidth(data), 0])
        .domain(data.map(function (d) {
            return d.item_user_id;
        })).padding(0.35);

    var y = d3.scaleLinear()
        .range([height - 50, 0])
        .domain([0, d3.max(data, function (d) {
            return d.orderField;
        })]);

    var svg = d3.select("#barchartV").append("svg")
        .attr("id", "svgbar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    populateVerBar(data, svg, x, y, height);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -65)
        .attr("x", -margin.left * 1.7)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Criterio di ordinamento");

    svg.append("g")
        .call(d3.axisLeft(y));
    svg.append("g").attr('transform', 'translate(0,' + (height - 50) + ')')
        .call(d3.axisBottom(x)).selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    var toolt = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
}

function populateVerBar(list, svgVar, newx, newy, height) {
    svgVar.selectAll(".bar")
        .data(list)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("width", 15)
        .attr("height", function (d) {
            return height - newy(d.orderField) - 50;
        })
        .attr("x", function (d) {
            return newx(d.item_user_id) - 7.5;
        })
        .attr("y", function (d) {
            return newy(d.orderField);
        })
        .on("mouseover", function (d) {
            d3.selectAll('.tooltip').transition()
                .duration(200)
                .style("opacity", .9);
            d3.selectAll('.tooltip').html(d.item_user_id + "<br/>" + d.orderField)
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

$(document).ready(function () {
    var currentMode = $('#dropdownMenu4').text();
    var currentSort = $('#dropdownMenu1').text();
    var currentOrient = $('#dropdownMenu3').text();

    var sliderRange = d3.sliderBottom()
        .min(1)
        .max(5)
        .step(1)
        .width(250)
        .ticks(5)
        .default([1, 5])
        .fill('dodgerblue')
        .on('onchange', val => {
            $.ajax({
                url: '',
                type: 'POST',
                data: {
                    question: $('#inputQuestion').val(),
                    orderMode: currentSort.toLowerCase(),
                    criterio: currentMode
                },
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select("#barchart").select("#svgbar").remove();
                    d3.select("#barchartV").select("#svgbar").remove();
                    d3.select("#xAxis").select("g").remove();
                    data = getNewList(data, sliderRange.value()[0], sliderRange.value()[1]);
                    $('#numres').text('Risultati trovati: '.concat(Object.keys(data).length));
                    if (currentOrient.includes('Orizzontale')) {
                        drawChart(data);
                    } else {
                        drawVerChart(data);
                    }
                },
                error: function () {
                    console.log("errore 4");
                }
            })
        });

    var gRange = d3
        .select('div#slider-range')
        .append('svg')
        .attr('width', 300)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(20,30)');

    gRange.call(sliderRange);

    $('#ordinamento').on("click", function () {
        if (currentSort !== $('#dropdownMenu1').text()) {
            currentSort = $('#dropdownMenu1').text();
            $.ajax({
                url: '',
                type: 'POST',
                data: {
                    question: $('#inputQuestion').val(),
                    criterio: currentMode,
                    orderMode: currentSort.toLowerCase()
                },
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select('#barchart').select("#svgbar").remove();
                    d3.select("#barchartV").select("#svgbar").remove();
                    d3.select('#xAxis').select("g").remove();

                    if(currentMode == 'voto')
                        if (sliderRange.value()[0] != 1 || sliderRange.value()[1] != 1) {
                            data = getNewList(data, sliderRange.value()[0], sliderRange.value()[1])
                        }

                    if (currentOrient.includes('Orizzontale')) {
                        drawChart(data);
                    } else {
                        drawVerChart(data);
                    }

                },
                error: function () {
                    console.log("errore");
                }
            })
        }
    });

    $('#orientamento').on("click", function () {
        if (currentOrient !== $('#dropdownMenu3').text()) {
            currentOrient = $('#dropdownMenu3').text();
            $.ajax({
                url: '',
                type: 'POST',
                data: {
                    question: $('#inputQuestion').val(),
                    criterio: currentMode,
                    orderMode: currentSort.toLowerCase()
                },
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select('#barchart').select("#svgbar").remove();
                    d3.select("#barchartV").select("#svgbar").remove();
                    d3.select('#xAxis').select("g").remove();

                    if(currentMode == 'voto') {
                        if ($('#inputQuestion').val().includes('ordina') &&
                            (sliderRange.value()[0] != 1 || sliderRange.value()[1] != 1)) {
                            data = getNewList(data, sliderRange.value()[0], sliderRange.value()[1])
                        }
                    }

                    if (currentOrient.includes('Orizzontale')) {
                        drawChart(data);
                    } else {
                        drawVerChart(data);
                    }
                },
                error: function () {
                    console.log("errore hor");
                }
            })
        }
    });

    $('#criterio').on("click", function () {
        console.log($('#inputQuestion').val());
        if (currentMode !== $('#dropdownMenu4').text()) {
            currentMode = $('#dropdownMenu4').text();
            $.ajax({
                url: '',
                type: 'POST',
                data: {
                    question: $('#inputQuestion').val(),
                    criterio: currentMode,
                    orderMode: currentSort.toLowerCase()
                },
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select("#barchart").select("#svgbar").remove();
                    d3.select("#barchartV").select("#svgbar").remove();
                    d3.select("#xAxis").select("g").remove();

                    if (currentMode !== 'voto') {
                        $('#sliderVoto').addClass('hidden');
                    } else {
                        $('#sliderVoto').removeClass('hidden');
                    }

                    if (currentOrient.includes('Orizzontale')) {
                        drawChart(data);
                    } else {
                        drawVerChart(data);
                    }
                },
                error: function () {
                    console.log('errore 3')
                }
            })
        }
    });
});