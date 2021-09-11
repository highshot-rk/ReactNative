/**
 * BoxScoreからAdvancedStatsを計算して返す
 * @param  {dict} data 入力値(getBoxScoreで取得したデータ)
 * @param  {dict} team_val 入力値(getTeamValで取得したデータ)
 * @return {list} AdvancedStatsのデータ
 */

export default function GetAdvancedStatsTeam(data, team_val) {
  let stats = {
    "Pace": 0,
    "Off_Eff":0,
    "Def_Eff":0,
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
    "min":0,
    "sec":0,
    "po_steal":"-",
    "po_or":"-"
  };
  const FGA = data[4] + data[2];
  const FGM = data[3] + data[1];
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

  stats["Off_Eff"] = (Poss == 0) ? "-" : Math.round(data[0]/Poss*100)/100
  stats["Def_Eff"] = team_val["Def_Eff"]
  stats["OR%"] = (data[12]+team_val["Opp_DR"] == 0) ? "-" : Math.round(data[12]/(data[12]+team_val["Opp_DR"])*10)/10*100
  stats["DR%"] = (data[13]+team_val["Opp_OR"] == 0) ? "-" : Math.round(data[13]/(data[13]+team_val["Opp_OR"])*10)/10*100
  stats["RB%"] = ((data[13]+data[12]+team_val["Opp_DR"]+team_val["Opp_OR"]) == 0) ? "-" : Math.round((data[13]+data[12])/(data[13]+data[12]+team_val["Opp_DR"]+team_val["Opp_OR"])*10)/10*100
  stats["PIE"] = (team_val["all_plays"] == 0) ? "-" : Math.round(team_val["all_plays_team"]/team_val["all_plays"]*10)/10*100
  stats["TO%"] = (Poss ==0) ? "-" : Math.round(data[18]/Poss*10)/10*100
  stats["Ast%"] = (FGM == 0) ? "-" : Math.round(data[15]/FGM*10)/10*100
  stats["po_steal"] = (team_val["Opp_PTS"] == 0) ? "-" : Math.round(team_val["Opp_PTS_Steal"]/team_val["Opp_PTS"]*10)/10*100
  stats["po_or"] = (team_val["Opp_PTS"] == 0) ? "-" : Math.round(team_val["Opp_PTS_OR"]/team_val["Opp_PTS"]*10)/10*100
  return_data = [Poss,stats["Off_Eff"],stats["Def_Eff"],team_val["Opp_PTS_Steal"],stats["po_steal"],team_val["Opp_PTS_OR"],stats["po_or"],stats["3P%"],stats["2P%"],stats["ITP%"],stats["Mid%"],stats["eFG%"],stats["TS%"],stats["FT%"],stats["PIE"],stats["FT/FG"],stats["ITP/FG"],stats["Mid/FG"],stats["3P/FG"],stats["Ast%"],stats["TO%"],stats["OR%"],stats["DR%"],stats["RB%"]]

  return return_data;
}