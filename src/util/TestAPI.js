// AWS SDK for React-Native
import {
  Config,
} from 'aws-sdk/react-native';
// AWS Cognito
import {
CognitoUserPool,
} from 'amazon-cognito-identity-js';
// AXiOS
import axios from 'axios';
// ローカルインポート
import Constants from '../common/Constants.js';

Config.region = Constants.appConfig.region;

export default function RequestAPI(API_URL, method, category, username) {
  const poolData = {
      UserPoolId: Constants.appConfig.UserPoolId,
      ClientId: Constants.appConfig.ClientId
  };
  const userPool = new CognitoUserPool(poolData);
  const cognitoUser = userPool.getCurrentUser();

  let login_user = '';
  cognitoUser.getSession(function (err, succ) {
      if (succ) {
          cognitoUser.getUserAttributes(function (err) {
              if (err) {
                  alert(err);
                  return;
              }
              login_user = cognitoUser.username;
          });
      } else {
          console.log("Get out here.");
      }
  });

  let refToken = cognitoUser.getSignInUserSession().getRefreshToken();
  cognitoUser.refreshSession(refToken, function (err, succ) {
    if (!succ) {
      // エラー
      console.log(err);
    } else {
      // 成功
      console.log('ref token : ' + succ.getAccessToken().getJwtToken());
      // API接続
      axios({
        method: method,
        url: API_URL,
        headers: {
          'Authorization': succ.getAccessToken().getJwtToken(),
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: {
          'category': category,
          'pk': username,
          'sk': username,
        },
      })
      .then((response) => {
        if(response !== null){
            alert("APIGateWay→lambda　接続成功")            
            console.log(response.data.Items[0].tile)
            return response;
        } else {
            throw Error(response.data.errorMessage)
        }
      }).catch((error) => {
        alert(Messages.ERROR.E001);
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);      // 例：400
          console.log(error.response.statusText);  // Bad Request
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log(error.errorMessage);
        }
        console.log(error.config);
        return error;
      });
    }
  });
}