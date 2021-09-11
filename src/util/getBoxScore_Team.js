/**
 * TAGGINGテーブルのデータからBoxScoreを計算して返す
 * @param  {list} datas 入力値(TAGGINGテーブルから取得したデータ)
 * @param  {dict} connection_id 入力値(Foulに紐づくconnection_id)
 * @return {dict} BoxScoreのデータ
 */


export default function getBoxScore(datas, connection_id) {
  let stats={
    "2P_A":	0,
    "2P_M":	0,
    "3P_A":	0,
    "3P_M":	0,
    "Paint_A":0,
    "Paint_M":0,
    "Mid_A":0,
    "Mid_M":0,
    "Assist": 0,
    "BLOCK": 0,
    "Foul":	0,
    "FT_A":	0,
    "FT_M":	0,
    "PTS": 0,
    "DEF_REB": 0,
    "OFF_REB": 0,
    "TOT_REB":0,
    "Steal": 0,
    "TO": 0,
    "play_time": "00:00",
    "min":0,
    "sec":0
  }
  let count_2p_miss = 0
  let count_3p_miss = 0
  let count_paint_miss = 0
  let count_mid_miss = 0
  let count_ft_miss = 0
  let sec_in = 0
  let sec_out = 0
  for (let i = 0; i < datas.length; i ++) {
    const data = datas[i]
    if (data["sub_tag"] == "2P") {
      if (data["shot_result"] == "Made") {
        stats["2P_M"] += 1
        if (data["shot_area"] == "Paint") {
          stats["Paint_M"] += 1
        } else if (data[shot_area] == "Mid") {
          stats["Mid_M"] += 1
        }
      } else {
        if (!data["connection_id"] in connection_id) {
          count_2p_miss += 1
          if (data["shot_area"] == "Paint") {
            count_paint_miss += 1
          } else if (data[shot_area] == "Mid") {
            count_mid_miss += 1
          }
        }
      }
    } else if (data["sub_tag"] == "3P") {
      if (data["shot_result"] == "Made") {
        stats["3P_M"] += 1
      } else {
        if (!data["connection_id"] in connection_id) {
          count_3p_miss += 1
        }
      }
    } else if (data["sub_tag"] == "FT") {
      if (data["ft1"] == "Made") {
        stats["FT_M"] += 1
      } else if (data["ft1"] == "Miss") {
        count_ft_miss += 1
      }
      if (data["ft2"] == "Made") {
        stats["FT_M"] += 1
      } else if (data["ft2"] == "Miss") {
        count_ft_miss += 1
      }
      if (data["ft3"] == "Made") {
        stats["FT_M"] += 1
      } else if (data["ft3"] == "Miss") {
        count_ft_miss += 1
      }
    } else if (data["main_tag"] == "Steal") {
      stats["Steal"] += 1
    } else if (data["main_tag"] == "TO") {
      stats["TO"] += 1
    } else if (data["main_tag"] == "Change") {
      if (data["sub_tag"] == "In") {
        sec_in = sec_in + int(data["game_time"].substr(0,2))*60 + int(data["game_time"].substr(4,2))
      } else if (data["sub_tag"] == "Out") {
        sec_out = sec_out + int(data["game_time"].substr(0,2))*60 + int(data["game_time"].substr(4,2))
      }
    // } else if (data["sub_tag"] == "Assist") {
    //   stats["Assist"] += 1
    // } else if (data["sub_tag"] == "BLOCK") {
    //   stats["BLOCK"] += 1
    // } else if (data["sub_tag"] == "OFE_REB") {
    //   stats["OFE_REB"]
    // } else if (data["sub_tag"] == "DEF_REB") {
    // } else if (data["main_tag"] == "Foul") {
    } else {
      let key = data["sub_tag"]
      stats[key] += 1
    }
  }
  stats["2P_A"] = stats["2P_M"] + count_2p_miss
  stats["3P_A"] = stats["3P_M"] + count_3p_miss
  stats["Paint_A"] = stats["Paint_M"] + count_paint_miss
  stats["Mid_A"] = stats["Mid_M"] + count_mid_miss
  stats["FT_A"] = stats["FT_M"] + count_ft_miss
  stats["TOT_REB"] = stats["DEF_REB"] + stats["OFF_REB"]
  stats["PTS"] = stats["3P_M"]*3 + stats["2P_M"]*2 + stats["FT_M"]
  stats["min"] = Math.floor((sec_in - sec_out) / 60)
  stats["sec"] = (sec_in - sec_out) %60
  stats["play_time"] = stats["min"] + ":" + stats["sec"]

  return_data = [stats["PTS"],stats["3P_M"],stats["3P_A"],stats["2P_M"],stats["2P_A"],stats["ITP_M"],stats["ITP_A"],stats["Mid_M"],stats["Mid_A"],stats["FT_M"],stats["Foul"],stats["OFF_REB"],stats["DEF_REB"],stats["OFE_REB"],stats["TOT_REB"],stats["Assist"],stats["Steal"],stats["BLOCK"],stats["TO"],stats["play_time"]]

  return return_data;

}