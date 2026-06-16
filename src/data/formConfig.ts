/**
 * フォーム設定ファイル
 * メールフォームの設定を一元管理
 *
 * 環境変数を使用することで、環境ごとに異なる設定を適用可能
 */

export const formConfig = {
  // エンドポイント設定
  // 環境変数が設定されている場合はそちらを優先
  endpoints: {
    submit: import.meta.env.PUBLIC_FORM_SUBMIT_ENDPOINT || './mail.php',
    thanksPage: import.meta.env.PUBLIC_FORM_THANKS_PAGE || './thanks/',
  },

  // バリデーションメッセージ
  validationMessages: {
    questionRequired: (num: number) => `質問${num}の回答を選択してください。`,
    nameRequired: 'お名前を入力してください。',
    phoneRequired: 'お電話番号を入力してください。',
    emailRequired: 'メールアドレスを入力してください。',
    emailInvalid: '有効なメールアドレスを入力してください。',
    privacyRequired: 'プライバシーポリシーへの同意が必要です。',
  },

  // システムメッセージ
  systemMessages: {
    sending: '送信中...',
    success: '診断申し込みが完了しました！',
    networkError: '送信に失敗しました。ネットワーク接続を確認してください。',
  },

  // タイミング設定
  timing: {
    successRedirectDelay: 2000, // 成功後のリダイレクトまでの時間（ミリ秒）
    errorMessageDuration: 5000, // エラーメッセージ表示時間（ミリ秒）
  },

  // フォームフィールド
  fields: {
    questionCount: 3,
    honeypot: 'website',
    timestamp: 'form_timestamp',
    cidcode: 'cidcode',
    adcode: 'adcode',
  },
} as const;
