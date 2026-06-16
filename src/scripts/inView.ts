/**
 * InView アニメーションシステム
 *
 * IntersectionObserver API を使用して、
 * 要素がビューポートに入ったときにアニメーションを発火させます。
 *
 * @usage
 * HTML/Astroコンポーネントで以下のクラスを使用:
 * - .js-inView: 基本クラス（必須）
 * - .js-inView-fadeIn: フェードイン
 * - .js-inView-up2show: 下から上にクリップパス表示
 * - .js-inView-left2show: 左から右にクリップパス表示
 * - .js-inView-ImageScaleIn: 画像ズームイン
 * - .js-inView_short: 早めに発火（オプション）
 *
 * @example
 * <div class="js-inView js-inView-fadeIn">
 *   フェードインするコンテンツ
 * </div>
 *
 * <h2 class="js-inView js-inView-up2show">
 *   下から現れる見出し
 * </h2>
 */

/**
 * InView アニメーションの初期化
 */
export const initInView = (): void => {
  const boxes = document.querySelectorAll<HTMLElement>('.js-inView');

  if (boxes.length === 0) {
    return;
  }

  // ハッシュリンクからのアクセスを検出
  // 直接セクションにジャンプした場合、即座にアニメーションを適用
  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      // ターゲットセクション内のjs-inView要素に直接クラスを追加
      const elementsInTarget = targetSection.querySelectorAll<HTMLElement>('.js-inView');
      elementsInTarget.forEach((el) => {
        el.classList.add('js-inView-activate');
      });
    }
  }

  /**
   * 要素にアクティブクラスを追加する関数
   * @param entry IntersectionObserverEntry
   */
  const setClass = (entry: IntersectionObserverEntry): void => {
    if (
      entry.isIntersecting &&
      !entry.target.classList.contains('js-inView-activate')
    ) {
      entry.target.classList.add('js-inView-activate');
    }
  };

  /**
   * 通常のオブザーバー（rootMargin: -40%）
   * ビューポートの中央付近でアニメーションを発火
   */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        setClass(entry);
      });
    },
    { rootMargin: '-40% 0px' }
  );

  /**
   * 短いオブザーバー（rootMargin: -10%）
   * 早めにアニメーションを発火したい要素用
   */
  const observerShort = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        setClass(entry);
      });
    },
    { rootMargin: '-10% 0px' }
  );

  // 各要素にオブザーバーを適用
  boxes.forEach((box) => {
    if (box.classList.contains('js-inView_short')) {
      observerShort.observe(box);
    } else {
      observer.observe(box);
    }
  });
};

/**
 * アクセシビリティ対応: prefers-reduced-motion
 * ユーザーがアニメーション削減を希望している場合は、
 * アニメーションを無効化
 */
export const initInViewWithAccessibility = (): void => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (!prefersReducedMotion) {
    initInView();
  } else {
    // アニメーション削減モード: 即座にすべての要素を表示
    const boxes = document.querySelectorAll<HTMLElement>('.js-inView');
    boxes.forEach((box) => {
      box.classList.add('js-inView-activate');
    });
  }
};

// デフォルトエクスポート
export default initInViewWithAccessibility;
