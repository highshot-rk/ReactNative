/**
 * 連想配列の重複データを除外する
 * @param  {array} array 入力値
 * @return {array} 重複データが除外された連想配列
 */
export default function ExcludeDuplicateArray(array) {
  const result = array.filter((element, index, self) => 
    self.findIndex(e => 
      e.label === element.label &&
      e.value === element.value
      ) === index
  );

  return result;
}