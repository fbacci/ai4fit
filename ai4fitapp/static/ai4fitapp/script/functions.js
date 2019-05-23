$(document).ready(function () {
    var currentSort = $('#dropdownMenu1').text();

    $('#clearBtn').on('click', function () {
        $('#inputQuestion').val('');

        $('#inputQuestion').tagsinput('removeAll');

        $('#linechartDiv').addClass('hidden');
        $('#chooseDate').addClass('hidden');
        $('#barchartDiv').addClass('hidden');
        $('#piechartDiv').addClass('hidden');
        $('#numres').addClass('hidden');
        $('#info').addClass('hidden');
    });

    $('input').on('itemRemoved', function (event) {
        if (event.item.includes('ordina') || event.item.includes('migliori') || event.item.includes('atleti con')) {
            $('#barchartDiv').addClass('hidden');
        }

        if (event.item.includes('raggruppati')) {
            $('#piechartDiv').addClass('hidden');
        }

        if (event.item.includes('login')) {
            $('#linechartDiv').addClass('hidden');
        }

        if ($('#inputQuestion').val() === '') {
            $('#numres').addClass('hidden');
            $('#info').addClass('hidden');
        }

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
                $('#numres').text('Risultati trovati: '.concat(Object.keys(data).length));
                drawCharts($('#inputQuestion').val(), data);
            },
            error: function () {
                console.log('errore cancellazione')
            }
        })
    });


    $('#qForm').keyup(function (e) {
        if (e.keyCode == 13) {
            $.ajax({
                url: '',
                type: 'POST',
                data: {question: $('#inputQuestion').val(), orderMode: currentSort.toLowerCase()},
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select("#barchart").select("#svgbar").remove();
                    d3.select("#linechart").select("#svgbar").remove();
                    d3.select("#piechart").select("#svgbar").remove();
                    d3.select("#xAxis").select("g").remove();
                    $('#numres').text('Risultati trovati: '.concat(Object.keys(data).length));
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
    $('#barchartDiv').addClass('hidden');
    $('#piechartDiv').addClass('hidden');
    $('#linechartDiv').addClass('hidden');

    $('#dropOrdinamento').addClass('hidden');
    $('#dropCriterio').addClass('hidden');
    $('#sliderVoto').addClass('hidden');

    $('#numres').addClass('hidden');

    if (value.includes('login') && value.includes('atleti con') && value.includes('raggruppati per')) {
        $('#barchartDiv').removeClass('hidden');
        drawChart(data)

        $('#piechartDiv').removeClass('hidden');
        var perc = getPercList(data, value);
        drawPieChart(perc)

        $('#linechartDiv').removeClass('hidden');
        drawLineChart(data[data.length - 1]);

        setValue(value);
    } else {
        if (value.includes('login')) {
            $('#linechartDiv').removeClass('hidden');
            setValue(value)
            drawLineChart(data);
        }

        if (value.includes('ordina')) {
            $('#barchartDiv').removeClass('hidden');
            $('#dropOrdinamento').removeClass('hidden');

            $('#dropCriterio').removeClass('hidden');

            if (!value.includes('voto')) {
                $('#sliderVoto').addClass('hidden');
            }

            setValue(value);
            drawChart(data)
        }

        if (value.includes('migliori') || value.includes('atleti con')) {
            $('#barchartDiv').removeClass('hidden');
            drawChart(data)
        }

        if (value.includes('raggruppati per')) {
            $('#piechartDiv').removeClass('hidden');
            var perc = getPercList(data, value);
            drawPieChart(perc)
        }
    }

    $('#info').removeClass('hidden');
    $('#numres').removeClass('hidden');
}

function setValue(value) {
    if (value.includes('voto')) {
        $('a#dropdownMenu4').text('voto');
    } else if (value.includes('calorie')) {
        $('a#dropdownMenu4').text('calorie');
    } else if (value.includes('velocità')) {
        $('a#dropdownMenu4').text('velocità media');
    }

    if (value.includes('settimana')) {
        $('a#dropdownMenu5').text('settimana');
    } else if (value.includes('mese')) {
        $('a#dropdownMenu5').text('mese');
    } else if (value.includes('anno')) {
        $('a#dropdownMenu5').text('anno');
    }
}

function getPercList(data, v) {
    var list = [];
    var dim = data.length, cnt = [], res = {};
    var i;

    if (v.includes('raggruppati per età')) {
        list = [[18, 24], [25, 39], [40, 55], [56, 68]];

        cnt = [0, 0, 0, 0];

        for (i = 0; i < dim; i++) {
            if (data[i]['groupField'] >= list[0][0] && data[i]['groupField'] <= list[0][1]) {
                cnt[0] += 1;
            } else if (data[i]['groupField'] >= list[1][0] && data[i]['groupField'] <= list[1][1]) {
                cnt[1] += 1;
            } else if (data[i]['groupField'] >= list[2][0] && data[i]['groupField'] <= list[2][1]) {
                cnt[2] += 1;
            } else if (data[i]['groupField'] >= list[3][0] && data[i]['groupField'] <= list[3][1]) {
                cnt[3] += 1;
            }
        }

        res = {
            "18-24": ((cnt[0] / dim) * 100).toFixed(2), "25-39": ((cnt[1] / dim) * 100).toFixed(2),
            "40-55": ((cnt[2] / dim) * 100).toFixed(2), "56-68": ((cnt[3] / dim) * 100).toFixed(2)
        };
    } else if (v.includes('raggruppati per calorie')) {
        list = [[0, 900], [900, 1200], [1200, 1800], [1800, 2400], [2400, 3000], [3000, 3500]];
        cnt = [0, 0, 0, 0, 0, 0];

        for (i = 0; i < dim; i++) {
            if (data[i]['groupField'] >= list[0][0] && data[i]['groupField'] < list[0][1]) {
                cnt[0] += 1;
            } else if (data[i]['groupField'] >= list[1][0] && data[i]['groupField'] < list[1][1]) {
                cnt[1] += 1;
            } else if (data[i]['groupField'] >= list[2][0] && data[i]['groupField'] < list[2][1]) {
                cnt[2] += 1;
            } else if (data[i]['groupField'] >= list[3][0] && data[i]['groupField'] < list[3][1]) {
                cnt[3] += 1;
            } else if (data[i]['groupField'] >= list[4][0] && data[i]['groupField'] < list[4][1]) {
                cnt[4] += 1;
            } else if (data[i]['groupField'] >= list[5][0] && data[i]['groupField'] < list[5][1]) {
                cnt[5] += 1;
            }
        }

        res = {
            "0-900": ((cnt[0] / dim) * 100).toFixed(2), "900-1200": ((cnt[1] / dim) * 100).toFixed(2),
            "1200-1800": ((cnt[2] / dim) * 100).toFixed(2), "1800-2400": ((cnt[3] / dim) * 100).toFixed(2),
            "2400-3000": ((cnt[4] / dim) * 100).toFixed(2), "3000-3500": ((cnt[5] / dim) * 100).toFixed(2)
        };
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
        if (data[i].eta > maxE) {
            maxE = data[i].eta;
        }

        if (data[i].eta < minE) {
            minE = data[i].eta
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
