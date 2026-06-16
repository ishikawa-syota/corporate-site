/**
 * フォームバリデーション処理
 * セキュアで再利用可能なバリデーション機能を提供
 */

import { formConfig } from '../data/formConfig';

/**
 * フォーム全体のバリデーション
 * @param form - バリデーション対象のフォーム要素
 * @returns エラーメッセージ（エラーがない場合はnull）
 */
export function validateForm(form: HTMLFormElement): string | null {
  // 質問回答チェック
  for (let i = 1; i <= formConfig.fields.questionCount; i++) {
    const questionRadios = form.querySelectorAll<HTMLInputElement>(
      `input[name="question_${i}"]`
    );
    let isAnswered = false;
    questionRadios.forEach((radio) => {
      if (radio.checked) isAnswered = true;
    });
    if (!isAnswered) {
      return formConfig.validationMessages.questionRequired(i);
    }
  }

  // お名前チェック
  const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]');
  const name = nameInput?.value.trim() || '';
  if (!name) {
    return formConfig.validationMessages.nameRequired;
  }
  // サニタイズ：名前に危険な文字が含まれていないかチェック
  if (containsDangerousChars(name)) {
    return '名前に使用できない文字が含まれています。';
  }

  // 電話番号チェック
  const phoneInput = form.querySelector<HTMLInputElement>('input[name="phone"]');
  const phone = phoneInput?.value.trim() || '';
  if (!phone) {
    return formConfig.validationMessages.phoneRequired;
  }
  // 電話番号の形式チェック
  if (!isValidPhone(phone)) {
    return '有効な電話番号を入力してください。';
  }

  // メールアドレスチェック
  const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
  const email = emailInput?.value.trim() || '';
  if (!email) {
    return formConfig.validationMessages.emailRequired;
  }
  // メールアドレス形式チェック
  if (!isValidEmail(email)) {
    return formConfig.validationMessages.emailInvalid;
  }

  // プライバシーポリシー同意チェック
  const privacyCheckbox = form.querySelector<HTMLInputElement>(
    'input[name="privacy_agree"]'
  );
  if (!privacyCheckbox?.checked) {
    return formConfig.validationMessages.privacyRequired;
  }

  // エラーなし
  return null;
}

/**
 * メールアドレスの形式を検証
 * @param email - 検証するメールアドレス
 * @returns 有効な場合true
 */
export function isValidEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * 電話番号の形式を検証
 * @param phone - 検証する電話番号
 * @returns 有効な場合true
 */
export function isValidPhone(phone: string): boolean {
  // ハイフンなしの数字のみ、または日本の電話番号形式
  const phonePattern = /^[\d-]+$/;
  return phonePattern.test(phone) && phone.replace(/-/g, '').length >= 10;
}

/**
 * XSS対策：危険な文字が含まれていないかチェック
 * @param value - チェックする文字列
 * @returns 危険な文字が含まれている場合true
 */
export function containsDangerousChars(value: string): boolean {
  const dangerousPattern = /<|>|&lt;|&gt;|javascript:|on\w+=/i;
  return dangerousPattern.test(value);
}

/**
 * 文字列のサニタイズ処理
 * @param value - サニタイズする文字列
 * @returns サニタイズ後の文字列
 */
export function sanitizeInput(value: string): string {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
