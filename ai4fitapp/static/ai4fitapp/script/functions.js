function getListByMark(list, min, max){
    var res = [];
    var i;

    for(i = 0; i < list.length; i++){
        if(list[i][1] > min && list[i][1] < max || list[i][1] == min || list[i][1] == max){
            res.push(list[i]);
        }
    }

    return res;
}