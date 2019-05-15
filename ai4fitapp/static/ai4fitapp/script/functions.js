function getNewList(list, min, max){
    var res = [];
    var i;

    for(i = 0; i < list.length; i++){
        if(list[i][1] > min && list[i][1] < max || list[i][1] == min || list[i][1] == max){
            res.push(list[i]);
        }
    }

    return res;
}

function changeSortMethod(list){
    return list.reverse();
}

$(document).ready(function() {
    $(".dropdown-toggle").dropdown();

    $('.dropdown-menu').on('click', 'a', function () {
        var target = $(this).closest('.dropdown').find('.dropdown-toggle')
        var selectedVal = $(this).html();
        target.html(selectedVal);
    });
});