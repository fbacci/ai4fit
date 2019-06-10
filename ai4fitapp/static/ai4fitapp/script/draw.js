function drawCharts(value, data) {
    setValue(value);

    var currentOrient = $('#dropdownMenu3').text();

    if (value.includes('login') && (value.includes('atleti con') || value.includes('migliori')) && value.includes('raggruppati per')) {
        $('#dropOrientamento').addClass('hidden');

        $('#rowBar').removeClass('hidden');
        $('#rowBar').removeClass('h-100');
        $('#rowBar').removeClass('w-100');
        $('#rowBar').addClass('h-55');

        $('#rowLine').removeClass('hidden');
        $('#rowLine').removeClass('h-100');
        $('#rowLine').addClass('h-40');
        $('.spaceLine').addClass('hidden');

        if (value.includes('atleti con')) {
            $('#barchartText').text('Lista atleti');
            $('#colOrdinamento').removeClass('hidden');
        } else {
            $('#colCriterio').removeClass('hidden');
            $('#colOrdinamento').addClass('hidden');
            $('#barchartText').text('Migliori atleti per: ');
        }

        $('#piechartDiv').removeClass('hidden');

        drawChart(data.slice(0, data.length - 1));

        var perc = getPercList(data.slice(0, data.length - 1), value);
        drawPieChart(perc);

        drawLineChart(data[data.length - 1]);

    } else if (value.includes('login') && (value.includes('atleti con') || value.includes('migliori'))) {
        var bar = $("#rowBar").contents();
        $("#rowBar").replaceWith(bar);

        var line = $("#rowLine").contents();
        $("#rowLine").replaceWith(line);

        var $newRow = $("<div class='row h-100' id='barLineRow'></div>"),
            newRow2 = document.createElement("div"),
            barLineCol = document.getElementById("barLineCol");

        $("#graphRow > #barLineCol").append($newRow, [newRow2, barLineCol]);

        $('#barLineRow').append($('#barchartDiv'));
        $('#barLineRow').append($('#linechartDiv'));

        $('#linechartDiv').removeClass('mt-2');
        $('#linechartDiv').removeClass('mb-2');
        $('#linechart').addClass('mt-4');
        $('#chooseDate').removeClass('hidden');
        $('#chooseDate').removeClass('w-50');
        $('#chooseDate').addClass('w-100');
        $('#chooseDate').css('margin-left', '');
        $('#barchartDiv').addClass('mr-2');
        $('#barchart').addClass('mt-4');
        $('.spaceLine').addClass('hidden');

        if (value.includes('atleti con')) {
            $('#barchartText').text('Lista atleti');
            $('#dropOrientamento').removeClass('hidden');
            $('#colOrdinamento').removeClass('hidden');
        } else {
            $('#dropOrientamento').removeClass('hidden');
            $('#colOrdinamento').addClass('hidden');
            $('#colCriterio').removeClass('hidden');
            $('#barchartText').text('Migliori atleti per: ');
        }

        drawChart(data.slice(0, data.length - 1));
        drawLineChart(data[data.length - 1]);
    } else if (value.includes('login') && value.includes('raggruppati')) {
        $('#rowLine').removeClass('hidden');
        $('#chooseDate').removeClass('hidden');
        $('#chooseDate').removeClass('w-50');
        $('#chooseDate').addClass('w-100');
        $('#chooseDate').css('margin-left', '');
        $('#linechartDiv').removeClass('mb-2');
        $('#linechartDiv').removeClass('mt-2');
        $('.spaceLine').addClass('hidden');
        drawLineChart(data[data.length - 1]);

        $('#piechartDiv').removeClass('hidden');
        var perc = getPercList(data.slice(0, data.length - 1), value);
        drawPieChart(perc)
    } else {
        if (value.includes('login')) {
            $('#linechartDiv').removeClass('mymargintop');
            $('#rowLine').removeClass('hidden');
            $('.spaceLine').removeClass('hidden');
            $('#chooseDate').removeClass('hidden');
            $('#chooseDate').addClass('w-50');
            $('#chooseDate').removeClass('w-100');
            $('#chooseDate').css('margin-left', $('#linechartDiv').width() / 4 + "px");
            drawLineChart(data);
        }

        if (value.includes('ordina')) {
            $('#barchartText').text('Criterio: ');
            $('#rowBar').removeClass('hidden');
            $('#colOrdinamento').removeClass('hidden');
            $('#colOrientamento').removeClass('col-md-5');
            $('#colOrientamento').addClass('col-md-3');
            $('#colOrdinamento').removeClass('col-md-5');
            $('#colOrientamento').addClass('col-md-3');

            $('#colCriterio').removeClass('hidden');

            if (!value.includes('voto')) {
                $('#sliderVoto').addClass('hidden');
            } else {
                $('#sliderVoto').removeClass('hidden');
            }

            if (currentOrient.includes('Orizzontale')) {
                drawChart(data);
            } else {
                drawVerChart(data);
            }
        }

        if (value.includes('migliori') || value.includes('atleti con')) {
            $('#rowBar').removeClass('hidden');
            $('#rowBar').addClass('w-100');
            $('#colOrientamento').removeClass('hidden');
            $('#colOrientamento').removeClass('col-md-5');
            $('#colOrientamento').addClass('col-md-3');
            $('#colOrdinamento').removeClass('col-md-5');
            $('#colOrientamento').addClass('col-md-3');
            $('#sliderVoto').addClass('hidden');

            if (value.includes('migliori')) {
                $('#colCriterio').removeClass('hidden');
                $('#colOrdinamento').addClass('hidden');
                $('#barchartText').text('Migliori atleti per: ');
            } else {
                $('#colCriterio').addClass('hidden');
                $('#colOrdinamento').removeClass('hidden');
                $('#barchartText').text('Lista atleti ');
            }

            if (value.includes('raggruppati per')) {
                $('#piechartDiv').removeClass('hidden');
                $('#rowBar').removeClass('w-100');

                var perc = getPercList(data, value);

                if (currentOrient.includes('Orizzontale')) {
                    drawChart(data);
                } else {
                    drawVerChart(data)
                }

                drawPieChart(perc);
            } else {
                if (currentOrient.includes('Orizzontale'))
                    drawChart(data);
                else drawVerChart(data);
            }
        }

        if (value.includes('distribuzione')) {
            $('#rowScatter').removeClass('hidden');
            drawScatterPlot(data);
        }
    }

    $('#info').removeClass('hidden');
    $('#numres').removeClass('hidden');
}