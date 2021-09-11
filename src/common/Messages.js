/*--------------------------------------------------------------------------
 * システム共通で使用するメッセージ一覧
 *------------------------------------------------------------------------*/
export default {
    // 情報メッセージ
    INFO: {
        I001: 'ログアウトしてもよろしいですか？',
        I002: '登録が完了しました',
        I003: 'Please, wait...',
        I004: 'データは復元できません。\nデータを削除してもよろしいですか？',
        I005: 'Search...',
        I006: '逆サイドからのショットです。登録しますか？',
        I007: 'Free Throw registered.',
        I008: 'Next, select the position of the rebound player (optional)',
        I009: 'Shot has been registered.',
        I010: 'Next, select the position of the assisted player (optional)',
        I011: 'Next, select the position of the rebound player (optional)',
        I012: 'Next, select the fouled player',
        I013: 'Next, select the blocked player',
        I014: 'Assist canceled.',
        I015: 'Block canceled.',
        I016: 'TurnOver registered.',
        I017: 'Next, select the position of the stealed player (optional)',
        I018: 'Next, select the rebound player',
        I019: "Are you sure you want to start the next quarter?",
    },
    // 警告メッセージ
    WARN: {
        W001: ' を入力してください',
        W002: ' は10文字以内で入力してください',
        W003: ' は英字3文字で入力してください',
        W004: ' は数字で入力してください',
        W005: ' の背番号が重複しています',
        W006: ' スターティングメンバーは5人に設定してください',
        W007: ' はYYYY/MM/DD形式で入力してください',
        W008: ' 開始日は終了日より前に設定してください',
        W009: ' は数字3桁以内で入力してください',
        W010: 'Player is not selected. Select Player first'
    },
    // エラーメッセージ
    ERROR: {
        E001: 'APIの実行に失敗しました。もう一度実行してください',
    },
};
