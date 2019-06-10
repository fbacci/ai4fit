$(document).ready(function () {
    var barLineColCnt = $('#barLineCol').html();
    var queries = ["ordina gli atleti per voto", "ordina gli atleti per velocità media", "ordina gli atleti per calorie",
        "mostra i migliori atleti", "raggruppati per calorie", "raggruppati per calorie giornaliere",
        "raggruppati per età", "mostra andamento login di questa settimana", "mostra andamento login di questo mese",
        "mostra andamento login di quest'anno", "mostra la distribuzione degli atleti per calorie e durata allenamento",
        "mostra la distribuzione degli atleti per calorie ed età"];

    manageDrop();

    /*** GESTIONE INPUT ***/
    $('#clearBtn').on('click', function () {
        if ($('#inputQuestion').val().includes('login') &&
            ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con'))) {
            $('#barLineCol').empty();
            $('#barLineCol').html(barLineColCnt);
        }

        $('#inputQuestion').tagsinput('removeAll');

        $('a#dropdownMenu1').text('Decrescente');
        $('a#dropdownMenu3').text('Orizzontale');
        reset();
        setValue($('#inputQuestion').val());

        manageDrop();
    });

    $('#inputQuestion').on('itemRemoved', function (event) {
        var itemRem = event.item, value = $('#inputQuestion').val();

        if (value !== '') {
            if ((value.includes('login') && itemRem.includes('migliori') || itemRem.includes('ordina') || itemRem.includes('atleti con'))) {
                var orient = $('#dropdownMenu1').text();
                var ord = $('#dropdownMenu3').text();

                $('#barLineCol').empty();
                $('#barLineCol').html(barLineColCnt);
                $('a#dropdownMenu1').text(orient.charAt(0).toUpperCase().concat(orient.substr(1, orient.length)));
                $('a#dropdownMenu3').text(ord.charAt(0).toUpperCase().concat(ord.substr(1, orient.length)));

                $('#d1').val('');
                $('#d2').val('');

            }

            if ((value.includes('migliori') || value.includes('ordina') || value.includes('atleti con'))
                && itemRem.includes('login')) {
                var orient = $('#dropdownMenu1').text();
                var ord = $('#dropdownMenu3').text();

                $('#barLineCol').empty();
                $('#barLineCol').html(barLineColCnt);
                $('a#dropdownMenu1').text(orient.charAt(0).toUpperCase().concat(orient.substr(1, orient.length)));
                $('a#dropdownMenu3').text(ord.charAt(0).toUpperCase().concat(ord.substr(1, orient.length)));

                $('#d1').val('');
                $('#d2').val('');

                $('a#dropdownMenu5').text('');
            }
        } else {
            if (event.item.includes('migliori') || event.item.includes('ordina') || event.item.includes('atleti con')) {
                $('a#dropdownMenu1').text('Decrescente');
                $('a#dropdownMenu3').text('Orizzontale');
                $('a#dropdownMenu4').text('');
                $('a#dropdownMenu5').text('');
            }
        }

        reset();
        setValue($('#inputQuestion').val());
        manageDrop();

        if ($('#inputQuestion').val() !== '') {
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
                    console.log(data);
                    d3.select("#barchart").select("#svgBar").remove();
                    d3.select("#barchartV").select("#svgBarVer").remove();
                    d3.select("#linechart").select("#svgbar").remove();
                    d3.select("#piechart").select("#svgPie").remove();
                    d3.select("#asseX").select("#xAxis").remove();
                    d3.select("#scatter").select("#svgScat").remove();
                    drawCharts($('#inputQuestion').val(), data);
                },
                error: function () {
                    console.log('errore cancellazione')
                }
            })
        }
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
    setDatePicker();

    $('#qForm').keyup(function (e) {
        manageForm(e);
    });

});

/*** FUNZIONE SET VALORI DROPDOWN ETC ***/
function setValue(value) {
    console.log(value === '');
    if (value === '') {
        $('#d1').val('');
        $('#d2').val('');
        $('a#dropdownMenu4').text('');
        $('a#dropdownMenu5').text('');
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


        if ($('#dropdownMenu5').text() === 'settimana' || value.includes('settimana')) {
            if ($('#dropdownMenu5').text() === 'settimana' || $('#dropdownMenu5').text() === '') {
                $('#rangeLineChart').text("Intervallo: ");
                $('a#dropdownMenu5').text('settimana');
            }
        }

        if ($('#dropdownMenu5').text() === 'mese' || value.includes('mese')) {
            if ($('#dropdownMenu5').text() === 'mese' || $('#dropdownMenu5').text() === '') {
                $('#rangeLineChart').text("Intervallo: ");
                $('a#dropdownMenu5').text('mese');
            }
        }

        if ($('#dropdownMenu5').text() === 'anno' || value.includes('anno')) {
            if ($('#dropdownMenu5').text() === 'anno' || $('#dropdownMenu5').text() === '') {
                $('#rangeLineChart').text("Intervallo: ");
                $('a#dropdownMenu5').text('anno');
            }
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
            return w + (((data.length - 10) / 10) * 300);
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
    $('#rowBar').addClass('w-100');
    $('#rowBar').removeClass('h-55');

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
            data: ($('#dropdownMenu5').text() !== '') ? {
                question: $('#inputQuestion').val(),
                criterio: $('#dropdownMenu4').text(),
                orderMode: $('#dropdownMenu1').text().toLowerCase(),
                intervallo: $('#dropdownMenu5').text()
            } : {
                question: $('#inputQuestion').val(),
                criterio: $('#dropdownMenu4').text(),
                orderMode: $('#dropdownMenu1').text().toLowerCase()
            },
            success: function (data) {
                data = JSON.parse(data);
                d3.select("#barchart").select("#svgBar").remove();
                d3.select("#barchartV").select("#svgBarVer").remove();
                d3.select("#linechart").select("#svgbar").remove();
                d3.select("#piechart").select("#svgPie").remove();
                d3.select("#asseX").select("#xAxis").remove();
                d3.select("#asseY").select("#yAxis").remove();
                d3.select("#scatter").select("#svgScat").remove();
                //createDropQuery($('#inputQuestion'));
                drawCharts($('#inputQuestion').val(), data);
            },
            error: function () {
                console.log("errore 2")
            },
        })
    }
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

function manageDrop() {
    $(".dropdown-toggle").dropdown();
    $('.dropdown-menu').on('click', 'a', function () {
        var target = $(this).closest('.dropdown').find('.dropdown-toggle');
        var selectedVal = $(this).html();
        target.html(selectedVal);
    });
}

function createDropQuery(v) {
    var remove = "<span data-role='remove'></span>";
    if (v.val().includes('voto')) {
        var c = 'voto';
        var txt = v.val().replace('voto', '');
        $('.bootstrap-tagsinput .tag').text(txt);
        $('.bootstrap-tagsinput .tag').append(getDropDown(c));
        $('.bootstrap-tagsinput .tag').append(remove);
    }
}

function getDropDown(c) {
    var b = `<button class="dropdown-toggle" type="button" id="dropdownMenuQuery"
                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${c}</button>
                <div class="dropdown-menu" id="query" aria-labelledby="dropdownMenuQuery">
                    <a class="dropdown-item" href="#" id="c1">calorie</a>
                    <a class="dropdown-item" href="#" id="c2">velocità media</a>
                    <a class="dropdown-item" href="#" id="c3">voto</a>
                </div>`

    return b;
}