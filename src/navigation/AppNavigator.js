
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

//ローカルインポート
import Constants from '../common/Constants';
import LoginScreen from '../screens/Login/LoginScreen';
import MenuScreen from '../screens/Menu/MenuScreen';
import GameInfoScreen from '../screens/Tagging/GameInfoScreen';
import EditInfoScreen from '../screens/EditInfo/EditInfoScreen';
import EditEventScreen from '../screens/EditInfo/EditEventScreen';
import CreateGameScreen from '../screens/Tagging/CreateGameScreen';
import CreateEventScreen from '../screens/Tagging/CreateEventScreen';
import CreateTeamScreen from '../screens/Tagging/CreateTeamScreen';
import CreatePlayerScreen from '../screens/Tagging/CreatePlayerScreen';
import CreateTeamPlayerScreen from '../screens/Tagging/CreateTeamPlayerScreen';
import AssignPlayersScreen from '../screens/Tagging/AssignPlayersScreen';
import LiveTaggingScreen from '../screens/Tagging/LiveTaggingScreen';
import PlayByPlayScreen from '../screens/PlayByPlay/PlayByPlayScreen_New';
import GameSelectionScreen from '../screens/Common/SelectionScreen';
import StatsViewerScreen from '../screens/StatsViewer/StatsViewerScreen';
import MainScreen from '../screens/Main/MainScreen';
import GameInfoSelectionScreen from '../screens/Common/GameInfoSelectionScreen';

//開発用
import LoginMockupScreen from '../screens/Mockup/LoginMockupScreen';
import IntroMockupScreen from '../screens/Mockup/IntroductionScreen';
import APITestScreen from '../common/APITestScreen';
import ExampleScreen from '../screens/Mockup/DatePicker';
import StubScreen from '../common/Stub';
import DesignSampleScreen from '../screens/Mockup/DesignSampleScreen';
import DesignSampleView from '../screens/Mockup/ViewerSampleScreen';
import DesignSamplePopup from '../screens/Mockup/PopUpSampleScreen';
import newGameScreen from '../screens/Tagging/newGameScreen';

//ログイン画面
const Login = {
  screen : LoginScreen,
  navigationOptions : ({ navigation }) => {
    return {title: Constants.NAV_TITLE.LOG_IN,};
  },
}
//メニュー画面
const Menu = {
  screen : MenuScreen,
  navigationOptions : ({ navigation }) => {
    return {title: Constants.NAV_TITLE.MAIN,};
  },
}
//GameInfo画面
const GameInfo = {
  screen : GameInfoScreen,
  navigationOptions : ({ navigation }) => {
    return {title: Constants.NAV_TITLE.GAME_INFO,};
  },
}
//EditInfo画面
const EditInfo = {
  screen : EditInfoScreen,
  navigationOptions : ({ navigation }) => {
    return {title: Constants.NAV_TITLE.EDIT_INFO,};
  },
}
//EditEvent画面
const EditEvent = {
  screen : EditEventScreen,
  navigationOptions : ({ navigation }) => {
    return {title: Constants.NAV_TITLE.EDIT_EVENT,};
  },
}
//CreateGame画面
const CreateGame = {
  screen : CreateGameScreen,
  navigationOptions : ({ navigation }) => {
    return {title: Constants.NAV_TITLE.CREATE_GAME,};
  },
}
//CreateEvent画面
const CreateEvent = {
  screen : CreateEventScreen,
  navigationOptions : ({ navigation }) => {
    return {title: Constants.NAV_TITLE.CREATE_EVENT,};
  },
}
//CreateTeam画面
const CreateTeam = {
  screen : CreateTeamScreen,
  navigationOptions : ({ navigation }) => {
    return {title: Constants.NAV_TITLE.CREATE_TEAM,};
  },
}
//CreatePlayer画面
const CreatePlayer = {
  screen : CreatePlayerScreen,
  navigationOptions : ({ navigation }) => {
    return {title: Constants.NAV_TITLE.CREATE_PLAYER,};
  },
}
//CreateTeamPlayer画面
const CreateTeamPlayer = {
  screen : CreateTeamPlayerScreen,
  navigationOptions : ({ navigation }) => {
    return {title: Constants.NAV_TITLE.CREATE_TEAMPLAYER,};
  },
}
//CreateTeamPlayer画面
const NewGame = {
  screen : newGameScreen,
  navigationOptions : ({ navigation }) => {
    return {title: Constants.NAV_TITLE.NEW_GAME,};
  },
}
//AssignPlayers画面
const AssignPlayers = {
  screen : AssignPlayersScreen,
  navigationOptions : ({ navigation }) => {
    return {title: Constants.NAV_TITLE.ASSIGN_PLAYER,};
  },
}
//LiveTagging画面
const LiveTagging = {
  screen : LiveTaggingScreen,
  navigationOptions : ({ navigation }) => {
    return {title: Constants.NAV_TITLE.LIVE_TAGGING,};
  },
}
//PlayByPlay画面
const PlayByPlay = {
  screen : PlayByPlayScreen,
  navigationOptions : ({ navigation }) => {
    return {title: Constants.NAV_TITLE.PLAY_BY_PLAY,};
  },
}
//GameSelection画面
const GameSelection = {
  screen : GameSelectionScreen,
  navigationOptions : ({ navigation }) => {
    return {title: Constants.NAV_TITLE.GAME_SELECTION,};
  },
}
//StatsViewer画面
const StatsViewer = {
  screen : StatsViewerScreen,
  navigationOptions : ({ navigation }) => {
    return {title: Constants.NAV_TITLE.STATS_VIEWER,};
  },
}


//ログインモックアップ画面
const LoginMockup = {
  screen : LoginMockupScreen,
  navigationOptions : ({ navigation }) => {
    return {
      headerShown: false,
      title: 'ログインモックアップ',
    };
  },
}
//イントロモックアップ画面
const IntroMockup = {
  screen : IntroMockupScreen,
  navigationOptions : ({ navigation }) => {
    return {
      headerShown: false,
      title: 'イントロモックアップ',
    };
  },
}
//メイン画面
const Main = {
  screen : MainScreen,
  navigationOptions : ({ navigation }) => {
    return {
      headerShown: false,
      title: 'メイン',
    };
  },
}
//GameInfoSelection画面
const GameInfoSelection = {
  screen : GameInfoSelectionScreen,
  navigationOptions : ({ navigation }) => {
    return {
      headerShown: false,
    };
  },
}

//API接続テスト画面
const APITest = {
  screen : APITestScreen,
  navigationOptions : ({ navigation }) => {
    return {title: 'APIテスト',};
  },
}
//サンプル画面
const Example = {
  screen : ExampleScreen,
  navigationOptions : ({ navigation }) => {
    return {title: 'サンプル',};
  },
}

//サンプル画面
const Design = {
  screen : DesignSampleScreen,
  navigationOptions : ({ navigation }) => {
    return {
      headerShown: false,
      title: 'デザインサンプル',
    };
  },
}
const DesignView = {
  screen : DesignSampleView,
  navigationOptions : ({ navigation }) => {
    return {
      headerShown: false,
      title: 'デザインサンプル',
    };
  },
}
const DesignPopup = {
  screen : DesignSamplePopup,
  navigationOptions : ({ navigation }) => {
    return {
      headerShown: false,
      title: 'デザインサンプル',
    };
  },
}

//開発用スタブ
const Stub = {
  screen : StubScreen,
  navigationOptions : ({ navigation }) => {
    return {title: '開発用スタブ',};
  },
}

const RootStack = createStackNavigator(
  {
    Login,
    Menu,
    GameInfo,
    EditInfo,
    EditEvent,
    CreateGame,
    CreateEvent,
    CreateTeam,
    CreatePlayer,
    CreateTeamPlayer,
    NewGame,
    AssignPlayers,
    LiveTagging,
    PlayByPlay,
    GameSelection,
    StatsViewer,
    LoginMockup,
    IntroMockup,
    Main,
    GameInfoSelection,
    APITest,
    Example,
    Design,
    DesignView,
    DesignPopup,
    Stub,
  },
  {
    mode: 'modal',
    initialRouteName: 'LoginMockup',
  }
);

export const landscapeOrientationScreens = [Constants.SCREEN_ID.MENU]
export default appNavigator = createAppContainer(RootStack);