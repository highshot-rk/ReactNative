// AXiOS
import axios from 'axios';

export default function RequestApi(method, url, accessToken, data) {
  // API接続
  return axios({
    method: method,
    url: url,
    headers: {
      'Authorization': accessToken,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: data,
  })
}