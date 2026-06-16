/**
 * コンタクトフォーム初期化スクリプト
 * フォームの初期化と送信処理を統合管理
 */

import {
  handleFormSubmit,
  addMessageAnimationStyles,
} from '../utils/formHandler';
import { initializeFormTracking } from '../utils/formTracking';

/**
 * コンタクトフォームの初期化
 */
export function initializeContactForm(): void {
  // メッセージアニメーションスタイルを追加
  addMessageAnimationStyles();

  // トラッキングコードとタイムスタンプを設定
  initializeFormTracking();

  // フォーム送信処理を設定
  const diagnosticForm = document.getElementById('diagnostic-form');
  if (diagnosticForm) {
    diagnosticForm.addEventListener('submit', handleFormSubmit);
    console.log('✅ コンタクトフォーム初期化完了');
  } else {
    console.warn('⚠️ コンタクトフォームが見つかりません');
  }
}

// DOMContentLoaded時に初期化
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initializeContactForm();
} else {
  document.addEventListener('DOMContentLoaded', initializeContactForm);
}
