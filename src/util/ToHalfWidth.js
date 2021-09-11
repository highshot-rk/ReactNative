/**
 * 全角から半角への変換
 * 入力値の英数記号を半角変換して返却
 * @param  {string} strVal 入力値
 * @return {string} 半角変換された文字列
 */
export default function ToHalfWidth(strVal) {
  // 半角変換
  var halfVal = strVal.replace(/[！-～]/g,
    function(tmpStr) {
      // 文字コードをシフト
      return String.fromCharCode( tmpStr.charCodeAt(0) - 0xFEE0 );
    }
  );

  // 文字コードシフトで対応できない文字の変換
  return halfVal.replace(/”/g, "\"")
  .replace(/’/g, "'")
  .replace(/‘/g, "`")
  .replace(/￥/g, "\\")
  .replace(/　/g, " ")
  .replace(/〜/g, "~");
}