/**
 * TAGGINGテーブルのデータからBoxScoreを計算して返す
 * @param  {list} datas 入力値(TAGGINGテーブルから取得したデータ)
 * @param  {dict} connection_id 入力値(Foulに紐づくconnection_id)
 * @return {list} BoxScoreのデータ
 */

 import GetBoxScoreTeam from '../util/getBoxScoreTeam';

 export default function GetBoxScorePlayer(datas, connection_id, starters, subs, player_list) {
  let return_data = []
  for (let i = 0; i < starters.length; i++) {
    let player_data = [];
    let player_name = [];
    let player_info = [];
    let num = starters[i].number;
    let player_id = starters[i].user;
    let S = "●"

    player_name = player_list.filter(function(item) {
      return item.player_id == player_id
    });

    player_info = [num, player_name[0]["player_name"], S]
    let data = datas.filter(function(item) {
      return item.player_id === player_id;
    })
    boxscore = GetBoxScoreTeam(data, connection_id)[0]
    player_data = player_info.concat(boxscore)
    return_data.push(player_data)
  }
  for (let i = 0; i < subs.length; i++) {
    let player_data = [];
    let player_info = [];
    let num = subs[i].number;
    let player_id = subs[i].user;
    let S = " "
    let player_name = player_list.filter(function(item) {
      return item.player_id == player_id
    });
    player_info = [num, player_name[0]["player_name"], S]
    let data = datas.filter(function(item) {
      return item.player_id === player_id;
    })
    boxscore = GetBoxScoreTeam(data, connection_id)[0]
    player_data = player_info.concat(boxscore)
    return_data.push(player_data)
  }
  return_data.sort((a,b) => {
    if (a[0]<b[0]) return -1;
    if (a[0]>b[0]) return 1;
  })
  let player_info = [" ", "Team", " "];
  let player_data = [];
  let data = datas.filter(function(item) {
    return item.player_name = "Team"
  });
  boxscore = GetBoxScoreTeam(data, connection_id)[0]
  player_data = player_info.concat(boxscore)
  return_data.push(player_data)

  return return_data;

}