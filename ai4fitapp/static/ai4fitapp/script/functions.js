barLineColCnt = undefined;
$(document).ready(function () {
    var queries = ["ordina gli atleti per voto", "ordina gli atleti per velocità media", "ordina gli atleti per calorie",
        "mostra i migliori atleti", "raggruppati per calorie", "raggruppati per calorie giornaliere",
        "raggruppati per età", "mostra andamento login di questa settimana", "mostra andamento login di questo mese",
        "mostra andamento login di quest'anno", "mostra la distribuzione degli atleti per calorie e durata allenamento",
        "mostra la distribuzione degli atleti per calorie ed età", "mostra la distribuzione degli atleti per calorie e velocità"];
    //var fakerator = new Fakerator();

    manageDropdown();

    /*** GESTIONE INPUT ***/
    $('#clearBtn').on('click', function () {
        $('#inputQuestion').val('');
        $('#inputQuestion').tagsinput('removeAll');

        console.log(barLineColCnt);

        if (!typeof barLineColCnt === undefined) {
            $('#barLineCol').replaceWith(barLineColCnt);
        }

        reset();
        setValue($('#inputQuestion').val());
        setDatePicker();
    });

    $('#inputQuestion').on('itemRemoved', function (event) {
        onItemRemoved();
    });

    $('#inputQuestion').tagsinput({
        typeahead: {
            source: queries,
            afterSelect: function () {
                this.$element[0].value = '';
            }
        }
    });

    setDatasetInfo();

    /*** GESTIONE PICKER DATE***/
    setDatePicker();

    $('#qForm').keyup(function (e) {
        manageForm(e);
    });

});

/*** FUNZIONE GRAFICI ***/
function drawCharts(value, data) {
    setValue(value);

    var currentOrient = $('#dropdownMenu3').text();

    if (value.includes('login') && (value.includes('atleti con') || value.includes('migliori')) && value.includes('raggruppati per')) {
        $('#dropOrientamento').removeClass('hidden');
        $('#colOrdinamento').removeClass('hidden');

        $('#rowBar').removeClass('hidden');
        $('#rowBar').removeClass('h-100');
        $('#rowBar').addClass('h-55');

        $('#rowLine').removeClass('hidden');
        $('#rowLine').removeClass('h-100');
        $('#rowLine').addClass('h-40');
        $('.spaceLine').addClass('hidden');

        if (value.includes('atleti con')) {
            $('#barchartText').text('Lista atleti');
        } else {
            $('#dropCriterio').removeClass('hidden');
            $('#barchartText').text('Migliori atleti per: ');
        }

        $('#piechartDiv').removeClass('hidden');

        if (currentOrient.includes('Orizzontale'))
            drawChart(data.slice(0, data.length - 1));
        else {
            drawVerChart(data.slice(0, data.length - 1));
        }

        var perc = getPercList(data.slice(0, data.length - 1), value);
        drawPieChart(perc);

        drawLineChart(data[data.length - 1]);

    } else if (value.includes('login') && (value.includes('atleti con') || value.includes('migliori'))) {

        barLineColCnt = $('#barLineCol').clone();

        if (value.includes('migliori')) {
            $('#dropOrientamento').removeClass('hidden');
            $('#colOrdinamento').addClass('hidden');
        } else {
            $('#dropOrientamento').removeClass('hidden');
            $('#colOrdinamento').removeClass('hidden');
        }

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
        $('#barchartDiv').addClass('mr-2');
        $('#barchart').addClass('mt-4');
        $('.spaceLine').addClass('hidden');

        if (value.includes('atleti con')) {
            $('#barchartText').text('Lista atleti');
        } else {
            $('#dropCriterio').removeClass('hidden');
            $('#barchartText').text('Migliori atleti per: ');
        }

        drawChart(data.slice(0, data.length - 1));
        drawLineChart(data[data.length - 1]);
    } else if (value.includes('login') && value.includes('raggruppati')) {
        $('#rowLine').removeClass('hidden');
        $('#linechartDiv').removeClass('mb-2');
        $('#linechartDiv').removeClass('mt-2');
        $('.spaceLine').addClass('hidden');
        drawLineChart(data[data.length - 1]);

        $('#piechartDiv').removeClass('hidden');
        var perc = getPercList(data, value);
        drawPieChart(perc)
    } else {
        if (value.includes('login')) {
            $('#linechartDiv').removeClass('mymargintop');
            $('#rowLine').removeClass('hidden');
            $('.spaceLine').removeClass('hidden');
            $('#chooseDate').removeClass('hidden');
            $('#chooseDate').css('margin-left', $('#linechartDiv').width() / 4 + "px");
            drawLineChart(data);
        }

        if (value.includes('ordina')) {
            $('#barchartText').text('Criterio: ');
            $('#rowBar').removeClass('hidden');
            $('#colOrdinamento').removeClass('hidden');

            $('#dropCriterio').removeClass('hidden');

            if (!value.includes('voto')) {
                $('#sliderVoto').addClass('hidden');
            } else {
                $('#sliderVoto').removeClass('hidden');
            }

            if (currentOrient.includes('Orizzontale')) {
                drawChart(data);
            } else drawVerChart(data);
        }

        if (value.includes('migliori') || value.includes('atleti con')) {
            $('#rowBar').removeClass('hidden');
            $('#dropOrientamento').removeClass('hidden');

            if (value.includes('migliori')) {
                $('#dropCriterio').removeClass('hidden');
                $('#colOrdinamento').addClass('hidden');
                $('#barchartText').text('Migliori atleti per: ');
            } else {
                $('#dropCriterio').addClass('hidden');
                $('#colOrdinamento').removeClass('hidden');
                $('#barchartText').text('Lista atleti ');
            }

            if (value.includes('raggruppati per')) {
                $('#piechartDiv').removeClass('hidden');

                if (currentOrient.includes('Orizzontale'))
                    drawChart(data);
                else drawVerChart(data);

                var perc = getPercList(data, value);
                drawPieChart(perc)
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

/*** FUNZIONE SET VALORI DROPDOWN ETC ***/
function setValue(value) {
    if (value === '') {
        $('#d1').val('');
        $('#d2').val('');
        $('a#dropdownMenu4').text('');
        $('a#dropdownMenu5').text('');
        $('a#dropdownMenu1').text('Decrescente');
        $('a#dropdownMenu3').text('Orizzontale');
    }

    if (value.includes('ordina')) {
        if (value.includes('calorie')) {
            $('a#dropdownMenu4').text('calorie');
        } else if (value.includes('velocità')) {
            $('a#dropdownMenu4').text('velocità media');
        } else {
            $('a#dropdownMenu4').text('voto');
        }
    } else if (value.includes('migliori')) {
        var currentMode = $('#dropdownMenu4').text();

        if (currentMode === 'calorie') {
            $('a#dropdownMenu4').text('calorie');
        } else if (currentMode === 'velocità media') {
            $('a#dropdownMenu4').text('velocità media');
        } else {
            $('a#dropdownMenu4').text('voto');
        }
    }

    if ($('#inputQuestion').val().includes('login tra')) {
        $('#rangeLineChart').text("Intervallo date");
        $('#colDropData > #dropData > a').addClass('hidden')
        $('#colDropData > #dropData').addClass('hidden');
        $('#colDropData').addClass('hidden');
    } else if (($('#d1').val() == '' && $('#d2').val() == '') || (typeof $('#d1').val() === 'undefined' && typeof $('#d2').val() === 'undefined')) {
        $('#colDropData > #dropData > a').removeClass('hidden')
        $('#colDropData > #dropData').removeClass('hidden');
        $('#colDropData').removeClass('hidden');
        $('#rangeLineChart').removeClass('col-md-7');
        $('#rangeLineChart').addClass('col-md-6');

        if (value.includes('settimana')) {
            $('#rangeLineChart').text("Intervallo: ");
            $('a#dropdownMenu5').text('settimana');
        } else if (value.includes('mese')) {
            $('#rangeLineChart').text("Intervallo: ");
            $('a#dropdownMenu5').text('mese');
        } else if (value.includes('anno')) {
            $('#rangeLineChart').text("Intervallo: ");
            $('a#dropdownMenu5').text('anno');
        }
    } else if (typeof $('#d1').val() !== 'undefined' && typeof $('#d2').val() !== 'undefined') {
        $('#rangeLineChart').removeClass('col-md-6');
        $('#rangeLineChart').addClass('col-md-7');
        $('#rangeLineChart').text("Intervallo date: ".concat($('#d1').val().concat(' - ').concat($('#d2').val())));
        $('#colDropData > #dropData > a').addClass('hidden')
        $('#colDropData > #dropData').addClass('hidden');
        $('#colDropData').addClass('hidden');
    }
}

/*** FUNZIONE INFO DATASET ***/
function setDatasetInfo() {
    $(function () {
        $.ajax({
            url: 'infodataset',
            type: 'POST',
            data: {dataset: 'Workout'},
            success: function (data) {
                data = JSON.parse(data);
                getDatasetInfo(data);
            },
            error: function () {
                console.log('errore 7')
            }
        });
    });
}

function getDatasetInfo(data) {
    var i, minE = 100, maxE = 0, minS = 1000.0, maxS = 0.0, minB = 300, maxB = 0, minC = 3500, maxC = 0, maxM = 0,
        minM = 5;
    var txtP = $('#persone').text(), txtE = $('#eta').text(), txtS = $('#velocita').text(), txtB = $('#bpm').text(),
        txtC = $('#calorie').text(), txtM = $('#voto').text();

    for (i = 0; i < data.length; i++) {
        $('#persone').text(txtP.concat(data[i].item_user_id).concat(", "));
        txtP = $('#persone').text();

        if (i > 5) {
            $('#persone').text(txtP.concat("... "));
            i = data.length;
        }
    }

    for (i = 0; i < data.length; i++) {
        if (data[i].avgM > maxM) {
            maxM = data[i].avgM;
        }

        if (data[i].avgM < minM) {
            minM = data[i].avgM;
        }
    }


    for (i = 0; i < data.length; i++) {
        if (data[i].age > maxE) {
            maxE = data[i].age;
        }

        if (data[i].age < minE) {
            minE = data[i].age;
        }
    }

    for (i = 0; i < data.length; i++) {
        if (data[i].avgS > maxS) {
            maxS = data[i].avgS;
        }

        if (data[i].avgS < minS) {
            minS = data[i].avgS;
        }
    }

    for (i = 0; i < data.length; i++) {
        if (data[i].avgB > maxB) {
            maxB = data[i].avgB;
        }

        if (data[i].avgB < minB) {
            minB = data[i].avgB;
        }
    }

    for (i = 0; i < data.length; i++) {
        if (data[i].avgC > maxC) {
            maxC = data[i].avgC;
        }

        if (data[i].avgC < minC) {
            minC = data[i].avgC;
        }
    }

    $('#eta').text(txtE.concat(minE.toString().concat(" - ").concat(maxE.toString())));
    $('#bpm').text(txtB.concat(minB.toString().concat(" - ").concat(maxB.toString())));
    $('#velocita').text(txtS.concat(minS.toString().concat(" - ").concat(maxS.toString())));
    $('#calorie').text(txtC.concat(minC.toString().concat(" - ").concat(maxC.toString())));
    $('#voto').text(txtM.concat(minM.toString().concat(" - ").concat(maxM.toString())));
}

/*** FUNZIONI DIMENSIONI ***/
function getHeight(data) {
    var h = 300;

    switch (data.length) {
        case 10:
            return h;
        default:
            return h + (((data.length - 10) / 10) * 250);
    }
}

function getWidth(data) {
    var w = 750;

    switch (data.length) {
        case 10:
            return w;
        default:
            return w + (((data.length - 10) / 10) * 250);
    }
}

/*** FUNZIONI LISTE E VALORI ***/
function getPercList(data, v) {
    var list = [];
    var dim = data.length, cnt = [], res = {};
    var i, j;

    if (v.includes('età') || v.includes('calorie')) {
        var max = getMax(data), min = getMin(data);
    }

    if (v.includes('calorie')) {
        list = createRangeList(min, max, 300);
    } else if (v.includes('età')) {
        list = createRangeList(min, max + 10, 15);
    }

    cnt = Array(list.length).fill(0);

    for (i = 0; i < dim; i++) {
        for (j = 0; j < list.length; j++) {
            if (data[i]['groupField'] >= list[j][0] && data[i]['groupField'] < list[j][1]) {
                cnt[j] += 1;
            }
        }
    }

    for (j = 0; j < cnt.length; j++) {
        cnt[j] = ((cnt[j] / dim) * 100).toFixed(2)
    }

    for (j = 0; j < list.length; j++) {
        res["" + list[j][0] + " - " + list[j][1] + ""] = cnt[j];
    }

    return res;
}

function getNumRes(data) {
    var i, cnt = 0;

    for (i = 0; i < data.length; i++) {
        cnt += data[i][1];
    }

    return cnt;
}

function getMax(data) {
    var max = 0, i;
    for (i = 0; i < data.length; i++) {
        if (data[i]['groupField'] > max) {
            max = data[i]['groupField']
        }
    }

    return max;
}

function getMin(data) {
    var min = 100, i;
    for (i = 0; i < data.length; i++) {
        if (data[i]['groupField'] < min) {
            min = data[i]['groupField']
        }
    }

    return min;
}

function getNewList(list, min, max) {
    var json = [];
    var i;

    var current;

    for (i = 0; i < list.length; i++) {
        current = list[i].orderField;
        if (current > min && current < max || current == min || current == max) {
            json.push(list[i])
        }
    }

    return json;
}

function createRangeList(min, max, step) {
    let arr = [];

    for (arr; (max - min) * step > 0; min += step) {
        arr.push([min, min + step]);
    }

    return arr;
}

function reset() {
    $('#rowBar').addClass('hidden');
    $('#rowBar').addClass('h-100');
    $('#rowBar').removeClass('h-55');
    $('#rowVer').addClass('hidden');

    $('#piechartDiv').addClass('hidden');

    $('#rowLine').addClass('hidden');
    $('#rowLine').addClass('h-100');
    $('#rowLine').removeClass('h-40');
    $('#linechartDiv').addClass('mb-2');
    $('#linechartDiv').addClass('mt-2');
    $('#chooseDate').addClass('hidden');

    $('#rowScatter').addClass('hidden');

    $('#numres').addClass('hidden');
    $('#info').addClass('hidden');

    $('#numres').text('');
}

function manageForm(e) {
    if (e.keyCode == 13) {
        $.ajax({
            url: '',
            type: 'POST',
            data: {
                question: $('#inputQuestion').val(),
                criterio: $('#dropdownMenu4').text(),
                orderMode: $('#dropdownMenu1').text().toLowerCase()
            },
            success: function (data) {
                data = JSON.parse(data);
                reset();
                d3.select("#barchart").select("#svgBar").remove();
                d3.select("#barchartV").select("#svgBarVer").remove();
                d3.select("#linechart").select("#svgbar").remove();
                d3.select("#piechart").select("#svgPie").remove();
                d3.select("#asseX").select("#xAxis").remove();
                d3.select("#yAxis").select("g").remove();
                d3.select("#scatter").select("#svgScat").remove();
                $('#numres').text('Risultati trovati: '.concat(Object.keys(data).length));
                /*for (var i = 0; i < data.length; i++) {
                    data[i].item_user_id = fakerator.names.firstName();
                }*/

                drawCharts($('#inputQuestion').val(), data);
            },
            error: function () {
                console.log("errore 2")
            },
        })
    }
}

function manageDropdown() {
    $(".dropdown-toggle").dropdown();
    $('.dropdown-menu').on('click', 'a', function () {
        var target = $(this).closest('.dropdown').find('.dropdown-toggle')
        var selectedVal = $(this).html();
        target.html(selectedVal);
    });
}

function setDatePicker() {
    $(function () {
        $('#datetimepicker7').datetimepicker({
            format: 'DD/MM/YYYY'
        });
        $('#datetimepicker8').datetimepicker({
            format: 'DD/MM/YYYY',
            useCurrent: false
        });
        $("#datetimepicker7").on("change.datetimepicker", function (e) {
            $('#datetimepicker8').datetimepicker('minDate', e.date);
        });
        $("#datetimepicker8").on("change.datetimepicker", function (e) {
            $('#datetimepicker7').datetimepicker('maxDate', e.date);
        });
    });
}

function onItemRemoved() {
    if (event.item.includes('login')) {
        $('#barLineCol').replaceWith(barLineColCnt);
    }

    reset();
    setValue($('#inputQuestion').val());

    if (!($('#inputQuestion').val() === '')) {
        $.ajax({
            url: '',
            type: 'POST',
            data: {
                question: $('#inputQuestion').val(),
                criterio: $('#dropdownMenu4').text(),
                orderMode: $('#dropdownMenu1').text()
            },
            success: function (data) {
                data = JSON.parse(data);
                d3.select("#barchart").select("#svgBar").remove();
                d3.select("#barchartV").select("#svgBarVer").remove();
                d3.select("#linechart").select("#svgbar").remove();
                d3.select("#piechart").select("#svgPie").remove();
                d3.select("#asseX").select("#xAxis").remove();
                d3.select("#yAxis").select("g").remove();
                d3.select("#scatter").select("#svgScat").remove();
                $('#numres').text('Risultati trovati: '.concat(Object.keys(data).length));
                drawCharts($('#inputQuestion').val(), data);
            },
            error: function () {
                console.log('errore cancellazione')
            }
        })
    }
}