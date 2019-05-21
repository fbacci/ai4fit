$(document).ready(function () {
    var currentSort = $('#dropdownMenu1').text();

    $('#clearBtn').on('click', function () {
        $('#inputQuestion').val('');

        $('.tag').each(function (index) {
            $(this).remove();
        });

        $('#linechartDiv').addClass('hidden');
        $('#barchartDiv').addClass('hidden');
        $('#piechartDiv').addClass('hidden');
        $('#numres').addClass('hidden');
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

    $(function () {
        var bindDatePicker = function () {
            $(".date").datetimepicker({
                format: 'YYYY-MM-DD',
                icons: {
                    time: "fa fa-clock-o",
                    date: "fa fa-calendar",
                    up: "fa fa-arrow-up",
                    down: "fa fa-arrow-down"
                }
            }).find('input:first').on("blur", function () {
                // check if the date is correct. We can accept dd-mm-yyyy and yyyy-mm-dd.
                // update the format if it's yyyy-mm-dd
                var date = parseDate($(this).val());

                if (!isValidDate(date)) {
                    //create date based on momentjs (we have that)
                    date = moment().format('YYYY-MM-DD');
                }

                $(this).val(date);
            });
        }

        var isValidDate = function (value, format) {
            format = format || false;
            // lets parse the date to the best of our knowledge
            if (format) {
                value = parseDate(value);
            }

            var timestamp = Date.parse(value);

            return isNaN(timestamp) == false;
        }

        var parseDate = function (value) {
            var m = value.match(/^(\d{1,2})(\/|-)?(\d{1,2})(\/|-)?(\d{4})$/);
            if (m)
                value = m[5] + '-' + ("00" + m[3]).slice(-2) + '-' + ("00" + m[1]).slice(-2);

            return value;
        }

        bindDatePicker();
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

function getWidth(data) {
    var w = 850;

    switch (data.length) {
        case 10:
            return w;
        default:
            return w + (((data.length - 10) / 10) * 250);
    }
}

function drawCharts(value, data) {
    if (value.includes('migliori') || value.includes('ordina')) {
        $('#linechartDiv').addClass('hidden');
        $('#barchartDiv').removeClass('hidden');
        $('#barchartMenu').removeClass('hidden');

        if (value.includes('ordina')) {
            $('#barchartText').text('Atleti ordinati per: ');
            $('#dropCriterio').removeClass('hidden');
            $('#piechartDiv').addClass('hidden');
            setValue(value)
        } else {
            $('#barchartText').text('Migliori atleti');
            $('#dropCriterio').addClass('hidden');
            $('#sliderVoto').addClass('hidden');
        }

        drawChart(data);
    }

    if (value.includes('raggruppa')) {
        $('#piechartDiv').removeClass('hidden');
        var perc = getPercList(data);
        drawPieChart(perc)
    }

    if (value.includes('login')) {
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