/**
 * フォーム送信ハンドラー
 * メール送信とUI制御を担当
 */

import { formConfig } from '../data/formConfig';

import { validateForm } from './formValidator';

/**
 * フォーム送信処理
 * @param event - フォーム送信イベント
 */
export async function handleFormSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const submitButton = form.querySelector<HTMLButtonElement>(
    '.p-top-contact__submit-button'
  );
  const submitText = form.querySelector<HTMLElement>(
    '.p-top-contact__submit-text'
  );

  if (!submitButton || !submitText) {
    console.error('❌ 送信ボタン要素が見つかりません');
    return;
  }

  // クライアントサイドバリデーション
  const validationError = validateForm(form);
  if (validationError) {
    showMessage(validationError, 'error');
    return;
  }

  // 送信中表示
  const originalText = submitText.textContent || '';
  submitText.textContent = formConfig.systemMessages.sending;
  submitButton.disabled = true;
  submitButton.style.opacity = '0.6';

  try {
    // フォームデータを収集
    const formData = new FormData(form);

    // デバッグ用ログ
    console.log('🔍 フォーム送信開始', {
      timestamp: formData.get('form_timestamp'),
      honeypot: formData.get('website'),
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
    });

    // mail.phpに送信
    const response = await fetch(formConfig.endpoints.submit, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    const result = await response.json();

    if (result.status === 'success') {
      console.log('✅ フォーム送信成功');

      // 成功メッセージ表示
      showMessage(formConfig.systemMessages.success, 'success');

      // リダイレクト
      setTimeout(() => {
        window.location.href =
          result.redirect || formConfig.endpoints.thanksPage;
      }, formConfig.timing.successRedirectDelay);
    } else {
      console.error('❌ フォーム送信エラー:', result.message);
      showMessage(result.message || 'エラーが発生しました', 'error');

      // ボタンを元に戻す
      resetSubmitButton(submitButton, submitText, originalText);
    }
  } catch (error) {
    console.error('❌ 送信処理エラー:', error);
    showMessage(formConfig.systemMessages.networkError, 'error');

    // ボタンを元に戻す
    resetSubmitButton(submitButton, submitText, originalText);
  }
}

/**
 * 送信ボタンを元の状態に戻す
 */
function resetSubmitButton(
  button: HTMLButtonElement,
  textElement: HTMLElement,
  originalText: string
): void {
  textElement.textContent = originalText;
  button.disabled = false;
  button.style.opacity = '1';
}

/**
 * メッセージ表示
 * @param message - 表示するメッセージ
 * @param type - メッセージタイプ（success or error）
 */
export function showMessage(
  message: string,
  type: 'success' | 'error'
): void {
  // 既存のメッセージを削除
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // メッセージ要素を作成
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message form-message--${type}`;
  messageDiv.textContent = message;

  // スタイル設定
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    padding: 15px 25px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideDown 0.3s ease-out;
    ${
      type === 'success'
        ? 'background: linear-gradient(90deg, #2cac6f 0%, #00b4ca 100%); color: white;'
        : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
    }
  `;

  // ページに追加
  document.body.appendChild(messageDiv);

  // エラーの場合は自動削除
  if (type === 'error') {
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, formConfig.timing.errorMessageDuration);
  }
}

/**
 * アニメーションスタイルを追加
 */
export function addMessageAnimationStyles(): void {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}
