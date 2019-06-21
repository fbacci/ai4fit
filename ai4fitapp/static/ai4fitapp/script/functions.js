fakerator = new Fakerator(['it-IT']);
$(document).ready(function () {
    var barLineColCnt = $('#barLineCol').html();

    var queries = getQueryList();
    $('#inputQuestion').tagsinput({
        typeahead: {
            source: queries,
            afterSelect: function () {
                this.$element[0].value = '';
            }
        }
    });

    document.dispatchEvent(new Event("setListenerDropdown"));
    document.dispatchEvent(new Event("setListenerSlider"));

    /*** GESTIONE INPUT ***/
    $('#clearBtn').on('click', function () {
        if ($('#inputQuestion').val().includes('login') &&
            ($('#inputQuestion').val().includes('migliori') || $('#inputQuestion').val().includes('atleti con'))) {
            $('#barLineCol').empty();
            $('#barLineCol').html(barLineColCnt);
            document.dispatchEvent(new Event("setListenerDropdown"));
            document.dispatchEvent(new Event("setListenerSlider"));
            manageDrop();
            setDatePicker();
        }

        $('#inputQuestion').tagsinput('removeAll');
        var queries = getQueryList();
        $('#inputQuestion').tagsinput('destroy');
        $('#inputQuestion').tagsinput({
            typeahead: {
                source: queries,
                afterSelect: function () {
                    this.$element[0].value = '';
                }
            }
        });

        $('#inputQuestion').tagsinput('focus');
        disableTagsInput();

        $('#dropdownMenu1').text('Decrescente');
        $('#dropdownMenu3').text('Orizzontale');
        $('#dropdownMenu7').text('Nessun distinzione');
        reset();
        setValue($('#inputQuestion').val());
    });

    $('#inputQuestion').on('itemRemoved', function (event) {
        var itemRem = event.item, value = $('#inputQuestion').val();
        var l = $('#curLogin').text(), c = $('#curCriterio').text(), g = $('#curGroup').text();

        if (value !== '') {
            if ((value.includes('login') && itemRem.includes('migliori') || itemRem.includes('ordina') || itemRem.includes('atleti con'))) {
                var orient = $('#dropdownMenu1').text();
                var ord = $('#dropdownMenu3').text();

                $('#barLineCol').empty();
                $('#barLineCol').html(barLineColCnt);
                document.dispatchEvent(new Event("setListenerDropdown"));
                document.dispatchEvent(new Event("setListenerSlider"));
                manageDrop();
                setDatePicker();

                $('#dropdownMenu1').text(orient.charAt(0).toUpperCase().concat(orient.substr(1, orient.length)));
                $('#dropdownMenu3').text(ord.charAt(0).toUpperCase().concat(ord.substr(1, orient.length)));

                $('#d1').val('');
                $('#d2').val('');
            }

            if ((value.includes('migliori') || value.includes('atleti con'))
                && itemRem.includes('login')) {
                var orient = $('#dropdownMenu1').text();
                var ord = $('#dropdownMenu3').text();

                $('#barLineCol').empty();
                $('#barLineCol').html(barLineColCnt);
                document.dispatchEvent(new Event("setListenerDropdown"));
                document.dispatchEvent(new Event("setListenerSlider"));
                manageDrop();
                setDatePicker();
                $('#dropdownMenu1').text(orient.charAt(0).toUpperCase().concat(orient.substr(1, orient.length)));
                $('#dropdownMenu3').text(ord.charAt(0).toUpperCase().concat(ord.substr(1, ord.length)));

                $('#d1').val('');
                $('#d2').val('');

                $('#dropdownLogin').text('');
            }
        } else {
            if (event.item.includes('migliori') || event.item.includes('ordina') || event.item.includes('atleti con')) {
                $('#dropdownMenu1').text('Decrescente');
                $('#dropdownMenu3').text('Orizzontale');
                $('#dropdownMenu4').text('');
                $('#dropdownLogin').text('');
            }

            if (event.item.includes('distribuzione')) {
                $('#dropdownMenu7').text('Nessuna distinzione');
            }
        }

        var queries = getQueryList();
        $('#inputQuestion').tagsinput('destroy');
        $('#inputQuestion').tagsinput({
            typeahead: {
                source: queries,
                afterSelect: function () {
                    this.$element[0].value = '';
                }
            }
        });

        $('#inputQuestion').tagsinput('focus');
        disableTagsInput();

        reset();
        setValue($('#inputQuestion').val());

        createDropQuery(c, g, l);

        if ($('#inputQuestion').val() !== '') {
            $.ajax({
                url: '',
                type: 'POST',
                data: setData(c, g, l),
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select("#barchart").select("#svgBar").remove();
                    d3.select("#barchartV").select("#svgBarVer").remove();
                    d3.select("#linechart").select("#svgbar").remove();
                    d3.select("#piechart").select("#svgPie").remove();
                    d3.select("#asseX").select("#xAxis").remove();
                    d3.select("#scatter").select("#svgScat").remove();

                    drawCharts($('#inputQuestion').val(), data, barLineColCnt);
                },
                error: function () {
                    console.log('errore cancellazione')
                }
            })
        }
    });

    manageDrop();
    setDatasetInfo();
    setDatePicker();

    $('#qForm').keyup(function (e) {
        manageForm(e, barLineColCnt);
    });

});

/*** FUNZIONE SET VALORI DROPDOWN ETC ***/
function setValue(value) {
    if (value === '') {
        $('#d1').val('');
        $('#d2').val('');
        $('#dropdownMenu4').text('');
    }

    if (value.includes('migliori')) {
        var currentMode = $('#dropdownMenu4').text();

        if (currentMode === 'calorie') {
            $('#dropdownMenu4').text('calorie');
            $('#curCriterio').text('calorie')
        } else if (currentMode === 'velocità') {
            $('#dropdownMenu4').text('velocità');
            $('#curCriterio').text('velocità')
        } else {
            $('#dropdownMenu4').text('voto');
            $('#curCriterio').text('voto')
        }
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
    $('#velocita').text(txtS.concat(minS.toString().concat(" - ").concat(maxS.toString())).concat(' (m/s)'));
    $('#calorie').text(txtC.concat(minC.toString().concat(" - ").concat(maxC.toString())).concat(' (kCal)'));
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

    if ($('#curGroup').text().includes('età') || $('#curGroup').text().includes('calorie') || v.includes('età') || v.includes('calorie')) {
        var max = getMax(data), min = getMin(data);
    }

    if ($('#curGroup').text().includes('calorie') || (v.includes('calorie')
        && ($('#curGroup').text().includes('calorie') || $('#curGroup').text() == ''))) {
        list = createRangeList(min, max, 300);
    } else if ($('#curGroup').text().includes('età') || (v.includes('età')
        && ($('#curGroup').text().includes('età') || $('#curGroup').text() == ''))) {
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

    $('#piechartDiv').addClass('hidden');

    $('#rowLine').addClass('hidden');
    $('#rowLine').addClass('h-100');
    $('#rowLine').removeClass('h-40');
    $('#linechartDiv').addClass('mb-2');
    $('#linechartDiv').addClass('mt-2');
    $('#chooseDate').addClass('hidden');

    $('#rowScatter').addClass('hidden');

    $('#numres').addClass('hidden');

    $('#numres').text('');

    $('#barchartText').addClass('col-md-7');
    $('#barchartText').removeClass('col-md-9');
    $('#barchartText').removeClass('col-md-6');

    $('#tagsInput').prop('readonly', false);
}

function manageForm(e, barLineColCnt) {
    var l = $('#curLogin').text(), c = $('#curCriterio').text(), g = $('#curGroup').text();
    if (e.keyCode == 13) {
        $.ajax({
            url: '',
            type: 'POST',
            data: setData(c, g, l),
            success: function (data) {
                data = JSON.parse(data);
                d3.select("#barchart").select("#svgBar").remove();
                d3.select("#barchartV").select("#svgBarVer").remove();
                d3.select("#linechart").select("#svgbar").remove();
                d3.select("#piechart").select("#svgPie").remove();
                d3.select("#asseX").select("#xAxis").remove();
                d3.select("#scatter").select("#svgScat").remove();

                var queries = getQueryList();
                $('#inputQuestion').tagsinput('destroy');
                $('#inputQuestion').tagsinput({
                    typeahead: {
                        source: queries,
                        afterSelect: function () {
                            this.$element[0].value = '';
                        }
                    }
                });

                createDropQuery(c, g, l);
                disableTagsInput();
                $('#inputQuestion').tagsinput('focus');

                drawCharts($('#inputQuestion').val(), data, barLineColCnt);
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

function setNumRes(v, data) {
    var cnt = 0, i;

    if (data.length > 0) {
        $('#numres').removeClass('hidden');

        if ($('#inputQuestion').tagsinput('items').length === 1) {
            if (v.includes('login')) {
                for (i = 0; i < data.length; i++) {
                    cnt += data[i][1]
                }
            } else if (!v.includes('raggruppati') || (v.includes('raggruppati') && (v.includes('migliori') || v.includes('atleti con')))) {
                cnt = data.length;
            } else {
                $('#numres').addClass('hidden');
            }
        } else if (!v.includes('login')) {
            cnt = data.length
        } else {
            if (!v.includes('migliori') && !v.includes('atleti con')) {
                var newData = data[data.length - 1];
                for (i = 0; i < newData.length; i++) {
                    cnt += newData[i][1]
                }
            } else {
                cnt = data.length - 1;
            }
        }
    }

    $('#numres').text('Risultati trovati: ' + cnt);
}

function createDropQuery(cr, g, l) {
    var c, cur, txt, remove = "<span data-role='remove'></span>";

    $(".bootstrap-tagsinput .tag").each(function () {
        if ($(this).text().length <= 40) {
            if (!$(this).text().includes('migliori') && !$(this).text().includes('atleti con')) {
                if (hasDropChild($(this))) {
                    $(this).remove('span.dropdown');
                }

                $(this).remove('span.rem');

                if (!hasDropChild($(this))) {
                    cur = getCurrent($(this).text());
                    c = getTagText($(this).text(), cr, g, l);
                    txt = $(this).text().replace(cur, '');
                    $(this).text(txt);
                    $(this).append(getDropDown(c, $(this)));
                    $(this).append(remove);
                }
            }
        }
    });

    manageDrop();
    document.dispatchEvent(new Event("setListenerDropdown"));
}

function getDropDown(c, tag) {
    var crit = `<span class="dropdown" id="dropdownCriterio">
                    <button class="btn btn-sm dropdown-toggle noPaddingTB dropdownMenuQuery" id="curCriterio" type="button"
                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${c}</button>
                    <div class="dropdown-menu" id="queryCriterio" aria-labelledby="dropdownMenuQuery">
                        <a class="dropdown-item" href="#" id="c1">calorie</a>
                        <a class="dropdown-item" href="#" id="c2">velocità</a>
                        <a class="dropdown-item" href="#" id="c3">voto</a>
                    </div>
                </span>`;

    var r = `<span class="dropdown" id="dropdownGroup">
                <button class="btn btn-sm dropdown-toggle noPaddingTB dropdownMenuQuery" id="curGroup" type="button"
                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${c}</button>
                <div class="dropdown-menu" id="queryGroup" aria-labelledby="curGroup">
                    <a class="dropdown-item" href="#" id="c1">calorie</a>
                    <a class="dropdown-item" href="#" id="c2">età</a>
                </div>
            </span>`;

    var l = `<span class="dropdown" id="dropdownLogin">
                <button class="btn btn-sm dropdown-toggle noPaddingTB dropdownMenuQuery" id="curLogin" type="button"
                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${c}</button>
                <div class="dropdown-menu" id="queryLogin" aria-labelledby="curLogin">
                    <a class="dropdown-item" href="#" id="c1">settimana</a>
                    <a class="dropdown-item" href="#" id="c2">mese</a>
                    <a class="dropdown-item" href="#" id="c2">anno</a>
                </div>
            </span>`;

    if (tag.text().includes('ordina')) {
        return crit;
    } else if (tag.text().includes('raggruppati')) {
        return r;
    }

    return l;
}

function getTagText(currentQ, cr, g, l) {
    if (currentQ.includes('raggruppati')) {
        if (g === 'età' || (currentQ.includes('età') && g === '')) {
            return 'età';
        } else if (g === 'calorie' || (currentQ.includes('calorie') && g === '')) {
            return 'calorie';
        }
    } else if (cr === 'voto' || (currentQ.includes('voto') && cr === '')) {
        return 'voto';
    } else if (cr === 'calorie' || (currentQ.includes('calorie') && cr === '')) {
        return 'calorie';
    } else if (cr === 'velocità' || (currentQ.includes('velocità') && cr === '')) {
        return 'velocità';
    }

    if (l === 'settimana' || (currentQ.includes('settimana') && l === '')) {
        return 'settimana';
    } else if (l === 'mese' || (currentQ.includes('mese') && l === '')) {
        return 'mese';
    } else if (l === 'anno' || (currentQ.includes('anno') && l === '')) {
        return 'anno';
    }
}

function getCurrent(currentQ) {
    if (currentQ.includes('raggruppati')) {
        if (currentQ.includes('età')) {
            return 'età';
        } else if (currentQ.includes('calorie')) {
            return 'calorie';
        }
    } else if (currentQ.includes('voto')) {
        return 'voto';
    } else if (currentQ.includes('calorie')) {
        return 'calorie';
    } else if (currentQ.includes('velocità')) {
        return 'velocità';
    }

    if (currentQ.includes('settimana')) {
        return 'settimana';
    } else if (currentQ.includes('mese')) {
        return 'mese';
    } else if (currentQ.includes('anno')) {
        return 'anno';
    }
}

function hasDropChild(tag) {
    if (tag.find('span.dropdown').length === 1) {
        return true;
    }

    return false;
}

function getQueryList() {
    var v = $('#inputQuestion'), queries;

    if (v.val() === '') {
        queries = ["ordina gli atleti per voto", "ordina gli atleti per velocità media", "ordina gli atleti per calorie",
            "mostra i migliori atleti", "mostra andamento login settimana", "mostra andamento login mese",
            "mostra andamento login anno", "mostra la distribuzione degli atleti per calorie e durata allenamento",
            "mostra la distribuzione degli atleti per calorie ed età"];
    } else {
        if (v.tagsinput('items').length === 1) {
            if (v.val().includes('ordina')) {
                queries = [];
            }

            if (v.val().includes('login')) {
                queries = ["mostra i migliori atleti", "raggruppati per calorie", "raggruppati per età"];
            }

            if (v.val().includes('migliori') || v.val().includes('atleti con')) {
                queries = ["raggruppati per calorie", "raggruppati per età", "con andamento login settimana",
                    "con andamento login mese", "con andamento login anno"];
            }
        } else if (v.tagsinput('items').length === 2) {
            if ((v.val().includes('migliori') || v.val().includes('atleti con')) && v.val().includes('login')) {
                queries = ["raggruppati per calorie", "raggruppati per età"];
            }

            if ((v.val().includes('migliori') || v.val().includes('atleti con')) && v.val().includes('raggruppati')) {
                queries = ["con andamento login settimana", "con andamento login mese", "con andamento login anno"];
            }
        } else {
            queries = [];
        }

    }

    return queries;
}

function setData(c, g, l) {
    if (!($('#inputQuestion').val().includes('migliori'))) {
        if ($('#inputQuestion').val().includes('login')) {
            return {
                question: $('#inputQuestion').val(),
                criterio: c,
                orderMode: $('#dropdownMenu1').text().toLowerCase(),
                group: g,
                intervallo: l
            }
        } else {
            return {
                question: $('#inputQuestion').val(),
                criterio: c,
                group: g,
                orderMode: $('#dropdownMenu1').text().toLowerCase()
            }
        }
    } else {
        if ($('#inputQuestion').val().includes('login')) {
            return {
                question: $('#inputQuestion').val(),
                criterio: $('#dropdownMenu4').text(),
                orderMode: $('#dropdownMenu1').text().toLowerCase(),
                group: g,
                intervallo: l
            }
        } else {
            return {
                question: $('#inputQuestion').val(),
                criterio: $('#dropdownMenu4').text(),
                group: c,
                orderMode: $('#dropdownMenu1').text().toLowerCase()
            }
        }
    }
}

function disableTagsInput() {
    var value = $('#inputQuestion');

    if (value.val().includes('ordina') || value.tagsinput('items').length >= 3) {
        $('#tagsInput').prop('readonly', true);
    }
}

function setOrderField(v){
    if(v.includes('età')){
        return 'età';
    } else if(v.includes('bpm')){
        return 'bpm';
    }

    return '';
}