$(document).ready(function () {
    var queries = ["ordina gli atleti per voto", "ordina gli atleti per velocità media", "ordina gli atleti per calorie",
        "mostra i migliori atleti", "mostra i migliori atleti per voto", "mostra i migliori atleti per calorie",
        "mostra i migliori atleti per velocità media", "raggruppati per calorie", "raggruppati per calorie giornaliere",
        "raggruppati per età", "mostra andamento login di questa settimana", "mostra andamento login di questo mese",
        "mostra andamento login quest'anno"];

    var currentSort = $('#dropdownMenu1').text();
    var currentMode = $('#dropdownMenu4').text();

    //var fakerator = new Fakerator();

    $('#clearBtn').on('click', function () {
        $('#inputQuestion').val('');
        $('#inputQuestion').tagsinput('removeAll');

        $('#linechartDiv').addClass('hidden');
        $('#chooseDate').addClass('hidden');
        $('#barchartDiv').addClass('hidden');
        $('#piechartDiv').addClass('hidden');
        $('#numres').addClass('hidden');
        $('#numres').text('');
        $('#info').addClass('hidden');

        console.log($('#inputQuestion').val())
    });

    $('#inputQuestion').on('itemRemoved', function (event) {
        if (event.item.includes('ordina') || event.item.includes('migliori') || event.item.includes('atleti con')) {
            $('#barchartDiv').addClass('hidden');
            $('#linechartDiv').css("height", 340);
        }

        if (event.item.includes('raggruppati')) {
            $('#piechartDiv').addClass('hidden');
        }

        if (event.item.includes('login')) {
            $('#linechartDiv').addClass('hidden');
            $('#chooseDate').addClass('hidden');

            $('#barchartDiv').css("height", 420);
            $('#barchart').css("height", 300);
        }

        if ($('#inputQuestion').val() === '') {
            setValue($('#inputQuestion').val(''));
            $('#numres').addClass('hidden');
            $('#info').addClass('hidden');
        }

        manageErrors();
        setFeedbackColor();

        $.ajax({
            url: '',
            type: 'POST',
            data: {question: $('#inputQuestion').val()},
            success: function (data) {
                data = JSON.parse(data);
                d3.select("#barchart").select("#svgbar").remove();
                d3.select("#linechart").select("#svgbar").remove();
                d3.select("#piechart").select("#svgbar").remove();
                d3.select("#xAxis").select("g").remove();
                d3.select("#yAxis").select("g").remove();
                $('#numres').text('Risultati trovati: '.concat(Object.keys(data).length));
                manageErrors();
                setFeedbackColor();
                drawCharts($('#inputQuestion').val(), data);
            },
            error: function () {
                console.log('errore cancellazione')
            }
        })
    });

    $('#inputQuestion').tagsinput({
        typeahead: {
            source: queries,
            afterSelect: function () {
                this.$element[0].value = '';
            }
        }
    });

    $('#qForm').keyup(function (e) {
        if (e.keyCode == 13) {
            $.ajax({
                url: '',
                type: 'POST',
                data: {question: $('#inputQuestion').val(), orderMode: currentSort.toLowerCase(),
                        criterio: currentMode},
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select("#barchart").select("#svgbar").remove();
                    d3.select("#linechart").select("#svgbar").remove();
                    d3.select("#piechart").select("#svgbar").remove();
                    d3.select("#xAxis").select("g").remove();
                    d3.select("#yAxis").select("g").remove();
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
    });

    $('#arrow').on('click', function () {
        if ($('#infoBox').hasClass('hidden')) {
            $('#arrow').attr('src', '../../static/ai4fitapp/img/arrow2bis.png')
            $('#infoBox').removeClass('hidden');
        } else {
            $('#arrow').attr('src', '../../static/ai4fitapp/img/arrow2.png');
            $('#infoBox').addClass('hidden');
        }
    });

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

    $(function () {
        $.ajax({
            url: 'infodataset',
            type: 'POST',
            data: {dataset: $('#dropdownMenu6').text()},
            success: function (data) {
                data = JSON.parse(data);
                setDatasetInfo(data);
            },
            error: function () {
                console.log('errore 7')
            }
        });
    });

    $(".dropdown-toggle").dropdown();
    $('.dropdown-menu').on('click', 'a', function () {
        var target = $(this).closest('.dropdown').find('.dropdown-toggle')
        var selectedVal = $(this).html();
        target.html(selectedVal);
    });
});


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

function drawCharts(value, data) {
    var currentOrient = $('#dropdownMenu3').text();

    $('#barchartDiv').addClass('hidden');
    $('#piechartDiv').addClass('hidden');
    $('#linechartDiv').addClass('hidden');

    $('#dropOrdinamento').addClass('hidden');
    $('#dropCriterio').addClass('hidden');
    $('#sliderVoto').addClass('hidden');

    $('#chooseDate').addClass('hidden');

    $('#numres').addClass('hidden');

    var n = 0, d;

    if (!(Array.isArray(data[0])) && Array.isArray(data[data.length - 1])) {
        for (d in data) {
            n += d[1];
        }
    }

    if (data.length != 0) {
        setValue(value);

        if (value.includes('login') && (value.includes('atleti con') || value.includes('migliori')) && value.includes('raggruppati per')) {
            if (n != 0) {
                $('#barchartDiv').removeClass('hidden');
                $('#barchartDiv').css("height", 170);
                $('#barchart').css("height", 170);

                $('#linechartDiv').css("height", 240);
                $('#linechartDiv').addClass('mymargintop');

                $('#barchartText').text('Lista atleti');
                if (currentOrient.includes('Orizzontale'))
                    drawChart(data.slice(0, data.length - 1));
                else drawVerChart(data.slice(0, data.length - 1));

                $('#piechartDiv').removeClass('hidden');
                var perc = getPercList(data.slice(0, data.length - 1), value);
                drawPieChart(perc);

                $('#linechartDiv').removeClass('hidden');
                drawLineChart(data[data.length - 1]);
            } else {
                $('#numres').text('Nessun risultato.');
            }
        } else if (value.includes('login') && (value.includes('atleti con') || value.includes('migliori'))) {
            if (n != 0) {
                $('#barchartDiv').removeClass('hidden');

                $('#barchartDiv').css("height", 170);
                $('#barchart').css("height", 170);

                $('#linechartDiv').css("height", 200);
                $('#linechartDiv').addClass('mymargintop');

                if (currentOrient.includes('Orizzontale'))
                    drawChart(data.slice(0, data.length - 1));
                else drawVerChart(data.slice(0, data.length - 1));

                $('#linechartDiv').removeClass('hidden');
                drawLineChart(data[data.length - 1]);
            } else {
                $('#numres').text('NESSUN RISULTATO!');
            }
        } else {
            if (value.includes('login')) {
                $('#linechartDiv').removeClass('mymargintop');
                $('#linechartDiv').removeClass('hidden');
                $('#chooseDate').removeClass('hidden');
                drawLineChart(data);
            }

            if (value.includes('ordina')) {
                $('#barchartText').text('Atleti ordinati per: ');
                $('#barchartDiv').removeClass('hidden');
                $('#dropOrdinamento').removeClass('hidden');

                $('#dropCriterio').removeClass('hidden');

                if (!value.includes('voto')) {
                    $('#sliderVoto').addClass('hidden');
                } else {
                    $('#sliderVoto').removeClass('hidden');
                }

                if (currentOrient.includes('Orizzontale'))
                    drawChart(data);
                else drawVerChart(data);
            }

            if (value.includes('migliori') || value.includes('atleti con')) {
                $('#barchartDiv').removeClass('hidden');
                if (value.includes('migliori')) {
                    $('#dropCriterio').removeClass('hidden');
                    $('#barchartText').text('Migliori atleti per: ');
                } else {
                    $('#dropCriterio').addClass('hidden');
                    $('#barchartText').text('Lista atleti ');
                }

                if (currentOrient.includes('Orizzontale'))
                    drawChart(data);
                else drawVerChart(data);
            }

            if (value.includes('raggruppati per')) {
                $('#piechartDiv').removeClass('hidden');
                var perc = getPercList(data, value);
                drawPieChart(perc)
            }
        }
    } else {
        $('#numres').text('NESSUN RISULTATO!');
    }

    $('#info').removeClass('hidden');
    $('#numres').removeClass('hidden');

    manageErrors();
    setFeedbackColor();
}

function setValue(value) {
    if (value.includes('voto')) {
        $('a#dropdownMenu4').text('voto');
    } else if (value.includes('calorie')) {
        $('a#dropdownMenu4').text('calorie');
    } else if (value.includes('velocità')) {
        $('a#dropdownMenu4').text('velocità media');
    } else if(value.includes('migliori')){
        $('a#dropdownMenu4').text('voto');
    }

    if (value.includes('settimana')) {
        $('#rangeLineChart').text("Intervallo: ");
        $('a#dropdownMenu5').text('settimana');
        $('#dropData').removeClass('hidden');
    } else if (value.includes('mese')) {
        $('#rangeLineChart').text("Intervallo: ");
        $('a#dropdownMenu5').text('mese');
        $('#dropData').removeClass('hidden');
    } else if (value.includes('anno')) {
        $('#rangeLineChart').text("Intervallo: ");
        $('a#dropdownMenu5').text('anno');
        $('#dropData').removeClass('hidden');
    } else {
        $('#rangeLineChart').text("Login intervallo date");
        $('#dropData').addClass('hidden');
    }

    $('#dropdownMenu3').text('Orizzontale');
    $('#dropdownMenu1').text('Decrescente');
}

function getPercList(data, v) {
    var list = [];
    var dim = data.length, cnt = [], res = {};
    var i, j, max = getMax(data), min = getMin(data);


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

function setDatasetInfo(data) {
    var i, minE = 0, maxE = 0, minS = 0.0, maxS = 0.0, minB = 0, maxB = 0;
    var txtP = $('#persone').text(), txtE = $('#eta').text(), txtS = $('#velocita').text(), txtB = $('#bpm').text();

    for (i = 0; i < data.length; i++) {
        $('#persone').text(txtP.concat(data[i].item_user_id).concat(", "));
        txtP = $('#persone').text();

        if (i > 5) {
            $('#persone').text(txtP.concat("... "));
            i = data.length;
        }
    }

    for (i = 0; i < data.length; i++) {
        if (data[i].age > maxE) {
            maxE = data[i].age;
        }

        if (data[i].age < minE) {
            minE = data[i].age
        }
    }

    for (i = 0; i < data.length; i++) {
        if (data[i].avgS > maxS) {
            maxS = data[i].avgS;
        }

        if (data[i].avgS < minS) {
            minS = data[i].avgS
        }
    }

    for (i = 0; i < data.length; i++) {
        if (data[i].avgB > maxB) {
            maxB = data[i].avgB;
        }

        if (data[i].avgB < minB) {
            minB = data[i].avgB
        }
    }

    $('#eta').text(txtE.concat(minE.toString().concat(" - ").concat(maxE.toString())));
    $('#bpm').text(txtB.concat(minB.toString().concat(" - ").concat(maxB.toString())));
    $('#velocita').text(txtS.concat(minS.toString().concat(" - ").concat(maxS.toString())))
}

function setLinechartHeight() {
    if ($('#inputQuestion').val().includes('login') && ($('#inputQuestion').val().includes('atleti con')
        || $('#inputQuestion').val().includes('migliori'))) {
        return 160;
    } else {
        return 250;
    }
}

function setPieHeight() {
    if ($('#inputQuestion').val().includes('login') && ($('#inputQuestion').val().includes('atleti con') || $('#inputQuestion').val().includes('migliori'))
        && $('#inputQuestion').val().includes('raggruppati per')) {
        return 250;
    } else {
        return 350;
    }
}

function manageErrors() {
    if (!($('#linechartDiv').hasClass('hidden')) && !$('#piechartDiv').hasClass('hidden')) {
        if ($('#barchartDiv').hasClass('hidden')) {
            $('#piechartDiv').addClass('hidden');
            $('#linechartDiv').addClass('hidden');
            $('#chooseDate').addClass('hidden');
            $('#info').addClass('hidden');
            $('#numres').text('ERRORE! Non ci sono atleti da raggruppare.');
        }
    }
}

function setFeedbackColor() {
    if ($('#numres').text().includes('ERRORE') || $('#numres').text().includes('Nessun risultato')) {
        $('#numres').css('color', 'red');
    } else {
        $('#numres').css('color', 'forestgreen');
    }
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

function createRangeList(min, max, step) {
    let arr = [];

    for (arr; (max - min) * step > 0; min += step) {
        arr.push([min, min + step]);
    }

    return arr;
}