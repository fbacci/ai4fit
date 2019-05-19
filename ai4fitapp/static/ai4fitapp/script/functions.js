$(document).ready(function () {
    var currentSort = $('#dropdownMenu1').text();

    $('#clearBtn').on('click', function () {
        $('#inputQuestion').val('');

        $('#linechartDiv').addClass('hidden');
        $('#barchartDiv').addClass('hidden');
        $('#piechartDiv').addClass('hidden');
        $('#numres').addClass('hidden');
    });


    $('#qForm').on('submit', function (event) {
        event.preventDefault();
        $.ajax({
            url: '',
            type: 'POST',
            data: {question: $('#inputQuestion').val(), orderMode: currentSort.toLowerCase()},
            success: function (data) {
                data = JSON.parse(data);
                d3.select("#barchart").select("#svgbar").remove();
                d3.select("#piechart").select("#svgbar").remove();
                d3.select("#xAxis").select("g").remove();
                $('#numres').text('Risultati trovati: '.concat(Object.keys(data).length));
                drawCharts($('#inputQuestion').val(), data);
            },
            error: function () {
                console.log("errore 2")
            },
        })
    });
});

function getNewList(list, min, max) {
    var json = [];
    var i;

    for (i = 0; i < list.length; i++) {
        current = list[i].avg;
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

function drawCharts(value, data) {
    if (value.includes('migliori') || value.includes('ordina')) {

        $('#barchartDiv').removeClass('hidden');
        drawChart(data);

        if (value.includes('ordina')) {
            $('#barchartMenu').removeClass('hidden');
            $('#piechartDiv').addClass('hidden');
            setValue(value)
        } else {
            $('#barchartMenu').addClass('hidden');
            $('#sliderVoto').addClass('hidden');
        }
    }

    if (value.includes('raggruppa')) {
        $('#piechartDiv').removeClass('hidden');
        var perc = getPercList(data);
        drawPieChart(perc)
    }

    if (value.includes('andamento')) {
        setValue(value);
        $('#linechartDiv').removeClass('hidden');

        $('#barchartDiv').addClass('hidden');
        $('#barchartMenu').addClass('hidden');
        $('#sliderVoto').addClass('hidden');
        $('#piechartDiv').addClass('hidden');

        $('#numres').text("Accessi totali: ".concat(getNumRes(data)));

        drawLineChart(data);
    }
}

function setValue(value) {
    if (value.includes('voto')) {
        $('a#dropdownMenu4').text('voto');
    } else if (value.includes('calorie')) {
        $('a#dropdownMenu4').text('calorie');
    } else if (value.includes('velocità')) {
        $('a#dropdownMenu4').text('velocità');
    }

    if (value.includes('settimana')) {
        $('a#dropdownMenu5').text('settimana');
    } else if (value.includes('calorie')) {
        $('a#dropdownMenu5').text('mese');
    } else if (value.includes('velocità')) {
        $('a#dropdownMenu5').text('anno');
    }
}

function getPercList(data) {
    var ageList = [[18, 24], [25, 39], [40, 55], [56, 68]]
    var dim = data.length, i, cnt0 = 0, cnt1 = 0, cnt2 = 0, cnt3 = 0;

    for (i = 0; i < dim; i++) {
        if (data[i]['eta'] >= ageList[0][0] && data[i]['eta'] <= ageList[0][1]) {
            cnt0 += 1;
        }

        if (data[i]['eta'] >= ageList[1][0] && data[i]['eta'] <= ageList[1][1]) {
            cnt1 += 1;
        }

        if (data[i]['eta'] >= ageList[2][0] && data[i]['eta'] <= ageList[2][1]) {
            cnt2 += 1;
        }
        if (data[i]['eta'] >= ageList[3][0] && data[i]['eta'] <= ageList[3][1]) {
            cnt3 += 1;
        }
    }

    var res = {
        "18-24": (cnt0 / dim) * 100, "25-39": (cnt1 / dim) * 100, "40-55": (cnt2 / dim) * 100,
        "56-68": (cnt3 / dim) * 100
    };

    return res;
}

function getNumRes(data) {
    var i, cnt = 0;

    for (i = 0; i < data.length; i++) {
        cnt += data[i][1];
    }

    return cnt;
}