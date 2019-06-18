function drawCharts(value, data, clone) {
    setValue(value);
    setNumRes(value, data)

    var currentOrient = $('#dropdownMenu3').text();

    if (data.length !== 0) {
        if (value.includes('login') && (value.includes('atleti con') || value.includes('migliori')) && value.includes('raggruppati')) {
            if ($('#barLineCol').find('div#rowBar').length === 0) {
                $('#barLineCol').empty();
                $('#barLineCol').html(clone);
                document.dispatchEvent(new Event("setListenerDropdown"));
                document.dispatchEvent(new Event("setListenerSlider"));
                manageDrop();
                setDatePicker();
            }

            $('#colOrientamento').addClass('hidden');
            $('#dropdownMenu3').val('Orizzontale');

            $('#rowBar').removeClass('hidden');
            $('#rowBar').removeClass('h-100');
            $('#rowBar').addClass('h-55');
            $('#rowBar').addClass('mb-2');

            $('#rowLine').removeClass('hidden');
            $('#rowLine').removeClass('h-100');
            $('#rowLine').addClass('h-40');
            $('.spaceLine').addClass('hidden');

            if (value.includes('atleti con') || value.includes('ordina')) {
                $('#barchartText').text('Lista atleti');
                $('#colCriterio').addClass('hidden');
                $('#colOrdinamento').removeClass('hidden');
            } else {
                $('#colCriterio').removeClass('hidden');
                $('#colOrdinamento').addClass('hidden');
                $('#barchartText').text('Migliori atleti per: ');
            }

            $('#piechartDiv').removeClass('hidden');

            drawChart(data.slice(0, data.length - 1));

            var perc = getPercList(data.slice(0, data.length - 1), value);
            $('#pieText').text('Distribuzione ' + $('#curGroup').text() + ' atleti');
            drawPieChart(perc, data);

            drawLineChart(data[data.length - 1]);

        } else if (value.includes('login') && (value.includes('atleti con') || value.includes('migliori'))) {
            var bar = $("#rowBar").contents();
            $("#rowBar").replaceWith(bar);

            var line = $("#rowLine").contents();
            $("#rowLine").replaceWith(line);

            var $newRow = $("<div class='row h-100' id='barLineRow'></div>"),
                barLineCol = document.getElementById("barLineCol");

            $("#graphRow > #barLineCol").append($newRow, [barLineCol]);

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
            $('#barchartText').addClass('col-md-10');
            $('#barchartText').removeClass('col-md-8');
            $('#barchartText').removeClass('col-md-7');
            $('#colOrientamento').addClass('col-md-5');
            $('#colOrientamento').addClass('mr-3');
            $('#colOrientamento').removeClass('col-md-3');
            $('#colOrdinamento').addClass('col-md-5');
            $('#colOrdinamento').removeClass('col-md-3');
            $('.spaceLine').addClass('hidden');

            if (value.includes('atleti con')) {
                $('#barchartText').text('Lista atleti');
                $('#colOrientamento').removeClass('hidden');
                $('#colOrdinamento').removeClass('hidden');
            } else {
                $('#colOrientamento').removeClass('hidden');
                $('#colOrdinamento').addClass('hidden');
                $('#colCriterio').removeClass('hidden');
                $('#barchartText').text('Migliori atleti per: ');
                $('#barchartText').addClass('col-md-7');
                $('#barchartText').removeClass('col-md-10');
                $('#barchartText').removeClass('col-md-8');
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
            $('#pieText').text('Distribuzione ' + $('#curGroup').text() + ' atleti');
            drawPieChart(perc, data)
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
                $('#barchartText').text('Ordinamento atleti ');
                $('#rowBar').removeClass('hidden');
                $('#colOrdinamento').removeClass('hidden');
                $('#colOrientamento').removeClass('col-md-5');
                $('#colOrientamento').addClass('col-md-3');
                $('#colOrdinamento').removeClass('col-md-5');
                $('#colOrientamento').addClass('col-md-3');
                $('#colCriterio').addClass('hidden');

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
                $('#colOrientamento').removeClass('hidden');
                $('#colOrientamento').removeClass('col-md-5');
                $('#colOrientamento').addClass('col-md-3');
                $('#colOrientamento').addClass('mr-3');
                $('#colOrdinamento').removeClass('col-md-5');
                $('#colOrdinamento').addClass('col-md-3');
                $('#sliderVoto').addClass('hidden');

                if (value.includes('migliori')) {
                    $('#colCriterio').removeClass('hidden');
                    $('#colOrdinamento').addClass('hidden');
                    $('#barchartText').text('Migliori atleti per: ');
                } else {
                    $('#colCriterio').addClass('hidden');
                    $('#colOrdinamento').removeClass('hidden');
                    $('#barchartText').text('Lista atleti');
                }

                if (value.includes('raggruppati per')) {
                    $('#piechartDiv').removeClass('hidden');

                    $('#colOrientamento').addClass('col-md-5');
                    $('#colOrientamento').removeClass('mr-3');
                    $('#colOrientamento').removeClass('col-md-3');
                    $('#colOrdinamento').addClass('col-md-5');
                    $('#colOrdinamento').removeClass('col-md-3');

                    if ($('#inputQuestion').val().includes('migliori')) {
                        $('#barchartText').addClass('col-md-6');
                        $('#barchartText').removeClass('col-md-7');
                    } else {
                        $('#barchartText').addClass('col-md-9');
                        $('#barchartText').removeClass('col-md-7');
                    }


                    var perc = getPercList(data, value);

                    if (currentOrient.includes('Orizzontale')) {
                        drawChart(data);
                    } else {
                        drawVerChart(data)
                    }

                    $('#pieText').text('Distribuzione ' + $('#curGroup').text() + ' atleti');
                    drawPieChart(perc, data);
                } else {
                    if (currentOrient.includes('Orizzontale'))
                        drawChart(data);
                    else drawVerChart(data);
                }
            }

            if (value.includes('distribuzione')) {
                $('#rowScatter').removeClass('hidden');
                if($('#inputQuestion').val().includes('età')){
                    var sndParam = 'età'
                } else {
                    var sndParam = 'durata allenamento'
                }
                $('#scatterText').text('Correlazione calorie - ' + sndParam);
                drawScatterPlot(data);
            }
        }

        $('#numres').css('color', 'forestgreen');

    } else {
        $('#numres').css('color', 'red');
        $('#numres').text('Nessun risultato trovato.');
    }

    $('#numres').removeClass('hidden');
}