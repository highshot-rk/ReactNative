/**
 * 配列データをCSV出力用データに変換するする
 * @param  {string} headerLine CSVヘッダー
 * @param  {array} objArray CSVデータ配列
 * @return {string} CSV出力用データ
 */
export default ConvertToCSV = (headerLine, objArray) => {
  let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  let str = '';
  str += headerLine + '\r\n';
  for (let i = 0; i < array.length; i++) {
    let line = '';
      for (let index in array[i]) {
          if (line != '') line += ','
          line += array[i][index];
      }
      str += line + '\r\n';
  }
  return str;
}