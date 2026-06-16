/**
 * フォームトラッキング処理
 * アナリティクスコードとセキュリティタイムスタンプの管理
 */

import { formConfig } from '../data/formConfig';

/**
 * セキュリティタイムスタンプを設定
 */
export function setFormTimestamp(): void {
  const timestampField = document.getElementById(
    formConfig.fields.timestamp
  ) as HTMLInputElement;
  if (timestampField) {
    timestampField.value = Math.floor(Date.now() / 1000).toString();
    console.log('🔐 セキュリティタイムスタンプ設定完了');
  }
}

/**
 * Google Analytics CIDコードを取得
 * @returns CIDコード
 */
export function getCidCode(): string {
  const gaMatches = document.cookie.match(/_ga=([^;]+)/);
  return gaMatches ? gaMatches[1] : '';
}

/**
 * URLパラメータからキャンペーンコードを取得
 * @returns キャンペーンコード
 */
export function getAdCode(): string {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('utm_campaign')
    ? urlParams.get('utm_campaign') || ''
    : '';
}

/**
 * トラッキングコードをフォームに設定
 */
export function setTrackingCodes(): void {
  const cidcode = getCidCode();
  const adcode = getAdCode();

  const cidInput = document.querySelector<HTMLInputElement>(
    `input[name="${formConfig.fields.cidcode}"]`
  );
  const adInput = document.querySelector<HTMLInputElement>(
    `input[name="${formConfig.fields.adcode}"]`
  );

  if (cidInput) cidInput.value = cidcode;
  if (adInput) adInput.value = adcode;

  console.log('🔍 トラッキングコード設定完了', { cidcode, adcode });
}

/**
 * フォーム初期化処理（タイムスタンプ + トラッキングコード）
 */
export function initializeFormTracking(): void {
  setFormTimestamp();
  setTrackingCodes();
}
