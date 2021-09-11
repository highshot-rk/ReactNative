/**
 * 配列データをCSV出力する
 * @param  {string} headerLine1 CSVヘッダー(チーム)
 * @param  {string} headerLine1 CSVヘッダー(プレイヤー)
 * @param  {array} objArray1 CSVデータ配列)(チーム)
 * @param  {array} objArray2 CSVデータ配列(プレイヤー)
 * @param  {string} prefix1 ファイル名接頭辞(チーム)
 * @param  {string} prefix2 ファイル名接頭辞(プレイヤー)
 * @return なし
 */
import moment from 'moment';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import ConvertToCSV from './ConvertToCSV';

export default ExportCSV = async(headerLine1, headerLine2, objArray1, objArray2, prefix1, prefix2) => {
  // チームデータCSV出力
  let fileName = prefix1 + '_' + String(moment(new Date()).add(0, 'days').format('YYYY-MM-DD-HHmmss.SSS'));
  let fileUri = FileSystem.documentDirectory + fileName + ".csv";
  let txtFile = ConvertToCSV(headerLine1, objArray1);
  await FileSystem.writeAsStringAsync(fileUri, txtFile, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(fileUri)
  await FileSystem.deleteAsync(fileUri)

  // プレイヤーデータCSV出力
  let fileName2 = prefix2 + '_' + String(moment(new Date()).add(0, 'days').format('YYYY-MM-DD-HHmmss.SSS'));
  let fileUri2 = FileSystem.documentDirectory + fileName2 + ".csv";
  let txtFile2 = ConvertToCSV(headerLine2, objArray2);

  await FileSystem.writeAsStringAsync(fileUri2, txtFile2, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(fileUri2)
  await FileSystem.deleteAsync(fileUri2)
}