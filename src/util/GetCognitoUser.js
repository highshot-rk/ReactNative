// AWS Cognito
import { CognitoUserPool } from 'amazon-cognito-identity-js';
// ローカルインポート
import Constants from '../common/Constants';

export default function GetCognitoUser() {
  // Cognitoユーザー取得
  const poolData = {
    UserPoolId: Constants.appConfig.UserPoolId,
    ClientId: Constants.appConfig.ClientId
  };
  const userPool = new CognitoUserPool(poolData);
  cognitoUser = userPool.getCurrentUser();

  cognitoUser.getSession(function (err, succ) {
    if (succ) {
      cognitoUser.getUserAttributes(function (err) {
        if (err) {
          alert(err);
        }
      });
    } else {
      console.log(err);
    }
  });
  return cognitoUser;
}