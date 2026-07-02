import { scrollAnimations } from './animation-2';
import initInViewWithAccessibility from './inView';

// スクロールアニメーションを初期化
document.addEventListener('DOMContentLoaded', () => {
	// GSAPアニメーションシステムを初期化
	scrollAnimations.init();

	// InViewアニメーションシステムを初期化
	initInViewWithAccessibility();

	// 必要に応じて特定の要素に個別のアニメーションを追加
	// scrollAnimations.add('.my-element', 'fadeLeft');
});
