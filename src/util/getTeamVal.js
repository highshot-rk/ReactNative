/**
 * TAGGINGテーブルのデータからBoxScoreを計算して返す
 * @param  {list} boxscore_h 入力値(HomeチームのBoxScoreのデータ)
 * @param  {list} boxscore_v 入力値(VisitorチームのBoxScoreのデータ)
 * @return {list} [Homeチームのteam_val, Visitorチームのteam_val
 */


export default function getTeamVal(boxscore_h, boxscore_v) {
  let home_val = {
    "all_plays":0,
    "all_plays_team":0,
    "Poss": 0,
    "Def_Eff":0,
    "Opp_OR":boxscore_v["OFF_REB"],
    "Opp_DR":boxscore_v["DEF_REB"],
    "Opp_Poss":0,
    "Opp_PTS":boxscore_v["PTS"]
  }
  let visitor_val = {
    "all_plays":0,
    "all_plays_team":0,
    "Poss": 0,
    "Def_Eff":0,
    "Opp_OR":boxscore_h["OFF_REB"],
    "Opp_DR":boxscore_h["DEF_REB"],
    "Opp_Poss":0,
    "Opp_PTS":boxscore_h["PTS"]
  }
  home_val["all_plays_team"] = Math.round((boxscore_h["PTS"]+boxscore_h["2P_M"]+boxscore_h["3P_M"]+boxscore_h["FT_M"]-boxscore_h["2P_A"]-boxscore_h["3P_A"]-boxscore_h["FT_A"]+boxscore_h["DEF_REB"]+0.5*boxscore_h["OFF_REB"]+boxscore_h["Assist"]+boxscore_h["Steal"]+0.5*boxscore_h["BLOCK"]-boxscore_h["Foul"]-boxscore_h["TO"])*10)/10
  visitor_val["all_plays_team"] = Math.round((boxscore_v["PTS"]+boxscore_v["2P_M"]+boxscore_v["3P_M"]+boxscore_v["FT_M"]-boxscore_v["2P_A"]-boxscore_v["3P_A"]-boxscore_v["FT_A"]+boxscore_v["DEF_REB"]+0.5*boxscore_v["OFF_REB"]+boxscore_v["Assist"]+boxscore_v["Steal"]+0.5*boxscore_v["BLOCK"]-boxscore_v["Foul"]-boxscore_v["TO"])*10)/10

  home_val["all_plays"] = home_val["all_plays_team"]+visitor_val["all_plays_team"]
  visitor_val["all_plays"] = home_val["all_plays_team"]+visitor_val["all_plays_team"]

  home_val["Poss"] = Math.round((boxscore_h["2P_A"]+boxscore_h["3P_A"]+0.44*boxscore_h["FT_A"]+boxscore_h["TO"])*10)/10
  visitor_all["Poss"] = Math.round((boxscore_v["2P_A"]+boxscore_v["3P_A"]+0.44*boxscore_v["FT_A"]+boxscore_v["TO"])*10)/10

  home_val["Opp_Poss"] = visitor_val["Poss"]
  visitor_val["Opp_Poss"] = home_val["Poss"]

  home_val["Def_Eff"] = (home_val["Opp_Poss"] == 0) ? 0 : Math.round((home_val["Opp_PTS"]/home_val["Opp_PTS"])*100)/100
  visitor_val["Def_Eff"] = (visitor_val["Opp_Poss"] == 0) ? 0 : Math.round((visitor_val["Opp_PTS"]/visitor_val["Opp_PTS"])*100)/100

  return [home_val, visitor_val];

}