// AWS SDK for React-Native
import {
  Config,
  CognitoIdentityCredentials
} from 'aws-sdk/react-native';
// AWS Cognito
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
// ローカルインポート
import Constants from '../common/Constants.js';

Config.region = Constants.appConfig.region;

export default function Auth(username, password, destination, mode) {
  const authenticationData = {
    Username: username,
    Password: password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);
  const poolData = {
    UserPoolId: Constants.appConfig.UserPoolId,
    ClientId: Constants.appConfig.ClientId
  };
  const userPool = new CognitoUserPool(poolData);
  const userData = {
    Username: username,
    Pool: userPool
  };
  const cognitoUser = new CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    // 認証成功
    onSuccess: (result) => {
      console.log('access token : ' + result.getAccessToken().getJwtToken());
      Config.credentials = new CognitoIdentityCredentials({
        IdentityPoolId: Constants.appConfig.IdentityPoolId,
        Logins: {
          [`cognito-idp.${Constants.appConfig.region}.amazonaws.com/${Constants.appConfig.UserPoolId}`]: result.getIdToken().getJwtToken()
        }
      });

      // メニュー画面にプッシュ遷移
      const { navigation } = destination;
      if(mode === 'mock') {
        navigation.navigate(Constants.SCREEN_ID.INTRO);
      } else {
        navigation.navigate(Constants.SCREEN_ID.MENU, { 'user_id': username });
      }
    },
    // 認証失敗
    onFailure: (err) => {
      alert(err);
    },
  });
}