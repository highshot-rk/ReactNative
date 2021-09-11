/**
 * 入力された日付でYYYY/MM/DD形式になっているか調べる
 * @param  {string} strDate 入力値
 * @return {boolean} OK: true, NG: false
 */
export default function CheckDateFormat(strDate) {
    if(!strDate.match(/^\d{4}\/\d{2}\/\d{2}$/)){
        return false;
    }
    var y = strDate.split("/")[0];
    var m = strDate.split("/")[1] - 1;
    var d = strDate.split("/")[2];
    var date = new Date(y,m,d);
    if(date.getFullYear() != y || date.getMonth() != m || date.getDate() != d){
        return false;
    }
    return true;
}