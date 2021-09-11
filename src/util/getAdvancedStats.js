/**
 * BoxScoreからAdvancedStatsを計算して返す
 * @param  {dict} data 入力値(getBoxScoreで取得したデータ)
 * @param  {dict} team_val 入力値(getTeamValで取得したデータ)
 * @param  {string} isTeam 入力値(TeamStatsを取得：Team, PlayerStatsを取得：Player)
 * @return {list} AdvancedStatsのデータ
 */

export default function getAdvancedStatas(data, team_val, isTeam) {
  let adstats = {
    "Poss": 0,
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
  }
  const FGA = data["2P_A"] + data["3P_A"]
  const FGM = data["2P_M"] + data["3P_M"]

  stats["Poss"] = Math.round((FGA*0.44 + data["FT_A"] + data["TO"])*10)/10
  stats["2P%"]  = (data["2P_A"]==0) ? "-" : Math.round(data["2P_M"]/data["2P_A"]*10)/10*100
  stats["ITP%"]  = (data["ITP_A"]==0) ? "-" : Math.round(data["ITP_M"]/data["ITP_A"]*10)/10*100
  stats["Mid%"]  = (data["Mid_A"]==0) ? "-" : Math.round(data["Mid_M"]/data["Mid_A"]*10)/10*100
  stats["3P%"]  = (data["3P_A"]==0) ? "-" : Math.round(data["3P_M"]/data["3P_A"]*10)/10*100
  stats["TS%"]  = ((FGA*0.44 + data["FT_A"])==0) ? "-" : Math.round(data["PTS"]/(2*(FGA*0.44 + data["FT_A"]))*10)/10*100
  stats["FT%"]  = (data["FT_A"]==0) ? "-" : Math.round(data["FT_M"]/data["FT_A"]*10)/10*100

  if (FGA != 0){
    stats["eFG%"] = Math.round(FGM+0.5*data["3P_M"]/FGA*10)/10*100
    stats["FT/FG"] = (data["FT_A"] == 0) ? "-" : Math.round(data["FT_A"]/FGA*10)/10*100
    stats["ITP/FG"] = (data["ITP_A"] == 0) ? "-" : Math.round(data["ITP_A"]/FGA*10)/10*100
    stats["Mid/FG"] = (data["Mid_A"] == 0) ? "-" : Math.round(data["Mid_A"]/FGA*10)/10*100
    stats["3P/FG"] = Math.round(data["3P_A"]/FGA*10)/10*100
  }

  // # Team専用のAdvancedStatsの計算
  if (isTeam == "Team") {
    stats["Off_Eff"] = (Poss == 0) ? "-" : Math.round(data["PTS"]/Poss*100)/100
    stats["Def_Eff"] = team_val["Def_Eff"]
    stats["OR%"] = (data["OR"]+team_val["Opp_DR"] == 0) ? "-" : Math.round(data["OR"]/(data["OR"]+team_val["Opp_DR"])*10)/10*100
    stats["DR%"] = (data["DR"]+team_val["Opp_OR"] == 0) ? "-" : Math.round(data["DR"]/(data["DR"]+team_val["Opp_OR"])*10)/10*100
    stats["RB%"] = ((data["DR"]+data["OR"]+team_val["Opp_DR"]+team_val["Opp_OR"]) == 0) ? "-" : Math.round((data["DR"]+data["OR"])/(data["DR"]+data["OR"]+team_val["Opp_DR"]+team_val["Opp_OR"])*10)/10*100
    stats["PIE"] = (team_val["all_plays"] == 0) ? "-" : Math.round(team_val["all_plays_team"]/team_val["all_plays"]*10)/10*100
    stats["TO%"] = (Poss ==0) ? "-" : Math.round(data["TO"]/Poss*10)/10*100
    stats["Ast%"] = (FGM == 0) ? "-" : Math.round(data["AS"]/FGM*10)/10*100
    stats["po_steal"] = (team_val["Opp_PTS"] == 0) ? "-" : Math.round(team_val["Opp_PTS_Steal"]/team_val["Opp_PTS"]*10)/10*100
    stats["po_or"] = (team_val["Opp_PTS"] == 0) ? "-" : Math/round(team_val["Opp_PTS_OR"]/team_val["Opp_PTS"]*10)/10*100
    return_list = [stats["Poss"],stats["Off_Eff"],stats["Def_Eff"],stats["PIE"],stats["2P%"],stats["ITP%"],stats["Mid%"],stats["3P%"],stats["eFG%"],stats["TS%"],stats["FT%"],stats["FT/FG"],stats["ITP/FG"],stats["Mid/FG"],stats["3P/FG"],stats["Ast%"],stats["TO%"],stats["OR%"],stats["DR%"],stats["RB%"],stats["po_steal"],stats["po_or"]]
}
  //  Player専用のAdvancedStatsの計算
  else if (isTeam == "Player") {
    stats["USG"] = (team_val["team_atk"] == 0) ? "-" : Math.round((FGA+0.44*data["FT_A"]+data["TO"])/team_val["team_atk"]*10)/10*100
    stats["EFF"] = Math.round(data["PTS"]+data["DR"]+data["OR"]+data["AS"]+data["ST"]+data["BL"]-((FGA-FGM)+(data["FT_A"]+data["FT_M"]+data["TO"]))*10)/10
    stats["PIE"] = (team_val["all_plays"] == 0) ? "-" :Math.round((data["PTS"]+data["2P_M"]+data["3P_M"]+data["FT_M"]-data["2P_A"]-data["3P_A"]-data["FT_A"]+data["DR"]+0.5*data["OR"]+data["AS"]+data["ST"]+0.5*data["BL"]-data["F"]-data["TO"])/team_val["all_plays"]*10)/10*100
    stats["Ast%"] = (Poss+data["AS"] == 0) ? "-" : Math.round(data["AS"]/(Poss+data["AS"])*10)/10*100
    stats["TO%"] = (Poss+data["AS"] == 0) ? "-" : Math.round(data["TO"]/(Poss+data["AS"])*10)/10*100
    stats["min"] = data["min"]
    stats["sec"] = data["sec"]
    playtime = stats["min"] + ":" + stats["sec"]
    return_list = [stats["2P%"],stats["ITP%"],stats["Mid%"],stats["3P%"],stats["eFG%"],stats["TS%"],stats["FT%"],stats["USG"],stats["FT/FG"],stats["ITP/FG"],stats["Mid/FG"],stats["3P/FG"],stats["Ast%"],stats["TO%"],stats["EFF"],stats["PIE"],playtime]
  }
  return_data = return_list.map(function (val) {
    return String(val)
  })

  return return_data;
}