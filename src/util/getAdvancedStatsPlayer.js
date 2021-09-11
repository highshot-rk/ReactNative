//  * BoxScoreからAdvancedStatsを計算して返す
//  * @param  {dict} data 入力値(getBoxScoreで取得したデータ)
//  * @param  {dict} team_val 入力値(getTeamValで取得したデータ)
//  * @return {list} AdvancedStatsのデータ

export default function GetAdvancedStatsPlayer(datas, team_val) {
  return_data = [];
  for (let i = 0; i < datas.length; i++) {
    let data = JSON.parse(JSON.stringify(datas[i])); // Deep Copy
    let player_data = [];
    let player_info = data.splice(0,3)

    let stats = {
      "2P%":"-",
      "ITP%":"-",
      "Mid%":"-",
      "3P%":"-",
      "eFG%":"-",
      "TS%":"-",
      "FT%":"-",
      "USG":"-",
      "FT/FG":"-",
      "ITP/FG":"-",
      "Mid/FG":"-",
      "3P/FG":"-",
      "Ast%":"-",
      "TO%":"-",
      "OR%":"-",
      "DR%":"-",
      "RB%":"-",
      "EFF":"-",
      "PIE":"-",
    }
    const FGA = data[4] + data[2]
    const FGM = data[3] + data[1]
    const Poss = team_val["Poss"]

    stats["2P%"]  = (data[4]==0) ? "-" : Math.round(data[3]/data[4]*10)/10*100
    stats["ITP%"]  = (data[6]==0) ? "-" : Math.round(data[5]/data[6]*10)/10*100
    stats["Mid%"]  = (data[8]==0) ? "-" : Math.round(data[7]/data[8]*10)/10*100
    stats["3P%"]  = (data[2]==0) ? "-" : Math.round(data[1]/data[2]*10)/10*100
    stats["TS%"]  = ((FGA*0.44 + data[10])==0) ? "-" : Math.round(data[0]/(2*(FGA*0.44 + data[10]))*10)/10*100
    stats["FT%"]  = (data[10]==0) ? "-" : Math.round(data[9]/data[10]*10)/10*100

    if (FGA != 0){
      stats["eFG%"] = Math.round(FGM+0.5*data[1]/FGA*10)/10*100
      stats["FT/FG"] = (data[10] == 0) ? "-" : Math.round(data[10]/FGA*10)/10*100
      stats["ITP/FG"] = (data[6] == 0) ? "-" : Math.round(data[6]/FGA*10)/10*100
      stats["Mid/FG"] = (data[8] == 0) ? "-" : Math.round(data[8]/FGA*10)/10*100
      stats["3P/FG"] = Math.round(data[2]/FGA*10)/10*100
    }

    stats["USG"] = (team_val["team_atk"] == 0) ? "-" : Math.round((FGA+0.44*data[10]+data[18])/team_val["team_atk"]*10)/10*100
    stats["EFF"] = Math.round(data[0]+data[13]+data[12]+data[15]+data[16]+data[17]-((FGA-FGM)+(data[10]+data[9]+data[18]))*10)/10
    stats["PIE"] = (team_val["all_plays"] == 0) ? "-" :Math.round((data[0]+data[3]+data[1]+data[9]-data[4]-data[2]-data[10]+data[13]+0.5*data[12]+data[15]+data[16]+0.5*data[17]-data[11]-data[18])/team_val["all_plays"]*10)/10*100
    stats["Ast%"] = (Poss+data[15] == 0) ? "-" : Math.round(data[15]/(Poss+data[15])*10)/10*100
    stats["TO%"] = (Poss+data[15] == 0) ? "-" : Math.round(data[18]/(Poss+data[15])*10)/10*100

    playtime = data[19]
    return_list = [stats["3P%"],stats["2P%"],stats["ITP%"],stats["Mid%"],stats["eFG%"],stats["TS%"],stats["FT%"],stats["USG"],stats["FT/FG"],stats["ITP/FG"],stats["Mid/FG"],stats["3P/FG"],stats["Ast%"],stats["TO%"],stats["EFF"],stats["PIE"],playtime]
    player_data = player_info.concat(return_list)
    return_data.push(player_data)
  }

  return return_data;
}