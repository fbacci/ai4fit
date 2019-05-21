function drawChart(data) {
    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = 660 - margin.left - margin.right;
    var height = getHeight(data) + 25;

    var y = d3.scalePoint()
        .domain(data.map(function (d) {
            return d.item_user_id;
        }))
        .range([getHeight(data), 0]).padding(0.35);

    var x = d3.scaleLinear()
        .range([2, width])
        .domain([0, d3.max(data, function (d) {
            return d.avg;
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
        .attr("x", -margin.left * 1.7)
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
            return newx(d.avg);
        })
        .attr("height", 15)
        .attr("y", function (d) {
            return newy(d.item_user_id) - 7.5;
        })
        .on("mouseover", function (d) {
            d3.selectAll('.tooltip').transition()
                .duration(200)
                .style("opacity", .9);
            d3.selectAll('.tooltip').html(d.item_user_id + "<br/>" + d.avg)
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

function drawHorizontalChart(data){

}

$(document).ready(function () {
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
                    d3.select("#xAxis").select("g").remove();
                    data = getNewList(data, sliderRange.value()[0], sliderRange.value()[1]);
                    $('#numres').text('Risultati trovati: '.concat(Object.keys(data).length))
                    drawChart(data);
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

    var currentMode = $('#dropdownMenu4').text();
    var currentSort = $('#dropdownMenu1').text();

    $(".dropdown-toggle").dropdown();
    $('.dropdown-menu').on('click', 'a', function () {
        var target = $(this).closest('.dropdown').find('.dropdown-toggle')
        var selectedVal = $(this).html();
        target.html(selectedVal);
    });

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
                    d3.select('#xAxis').select("g").remove();

                    if (sliderRange.value()[0] != 1 || sliderRange.value()[1] != 1) {
                        data = getNewList(data, sliderRange.value()[0], sliderRange.value()[1])
                    }

                    drawChart(data);
                },
                error: function () {
                    console.log("errore");
                }
            })
        }
    });

    $('#criterio').on("click", function () {
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
                    data = JSON.parse(data)
                    d3.select("#barchart").select("#svgbar").remove();
                    d3.select("#xAxis").select("g").remove();

                    if(currentMode !== 'voto'){
                        $('#sliderVoto').addClass('hidden');
                    } else {
                        $('#sliderVoto').removeClass('hidden');
                    }

                    drawChart(data)
                },
                error: function () {
                    console.log('errore 3')
                }
            })
        }
    });
});