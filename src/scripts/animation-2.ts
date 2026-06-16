import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { BREAKPOINT_SP_MAX } from '@/data/config';

interface RevealOptions {
	direction?: 'down' | 'up';
	blur?: boolean;
	duration?: number;
}

interface ListAnimationOptions {
	stagger?: number;
	split?: boolean;
}

gsap.registerPlugin(ScrollTrigger);

const reveal = (item: Element, options: RevealOptions = {}) => {
	const { direction, blur = false, duration = 1 } = options;
	let transform = {};

	if (direction === 'down') {
		transform = {
			transform: 'translateY(-3rem)',
		};
	} else if (direction === 'up') {
		transform = {
			transform: 'translateY(3rem)',
		};
	}
	if (blur) {
		transform = {
			...transform,
			filter: 'blur(0.3rem)',
		};
	}

	gsap.from(item, {
		...transform,
		opacity: 0,
		duration: duration,
		ease: 'power2.inOut',
		scrollTrigger: {
			trigger: item,
			start: 'top 90%',
		},
	});
};

// フェードインのアニメーション
const revealElements = document.querySelectorAll('.animate-reveal');
if (revealElements) {
	revealElements.forEach((item) => {
		reveal(item);
	});
}

const revealBlurElements = document.querySelectorAll('.animate-reveal-blur');
if (revealBlurElements) {
	revealBlurElements.forEach((item) => {
		reveal(item, { blur: true, duration: 1.5 });
	});
}

// 下にスライドするアニメーション
const revealDownElements = document.querySelectorAll('.animate-reveal-down');
if (revealDownElements) {
	revealDownElements.forEach((item) => {
		reveal(item, { direction: 'down' });
	});
}

const revealDownBlurElements = document.querySelectorAll(
	'.animate-reveal-down-blur'
);
if (revealDownBlurElements) {
	revealDownBlurElements.forEach((item) => {
		reveal(item, { direction: 'down', blur: true, duration: 1 });
	});
}

// 上にスライドするアニメーション
const revealUpElements = document.querySelectorAll('.animate-reveal-up');
if (revealUpElements) {
	revealUpElements.forEach((item) => {
		reveal(item, { direction: 'up' });
	});
}

const revealUpBlurElements = document.querySelectorAll(
	'.animate-reveal-up-blur'
);
if (revealUpBlurElements) {
	revealUpBlurElements.forEach((item) => {
		reveal(item, { direction: 'up', blur: true, duration: 1 });
	});
}

export const createListAnimation = (
	items: NodeListOf<Element>,
	options: ListAnimationOptions = {
		stagger: 0.1,
		split: false,
	}
) => {
	const isMobile = window.innerWidth < BREAKPOINT_SP_MAX;

	if (items.length <= 0) return;

	if (isMobile || options.split) {
		items.forEach((item) => {
			gsap.from(item, {
				transform: 'translateY(3rem)',
				opacity: 0,
				duration: 1,
				ease: 'power2.inOut',
				scrollTrigger: { trigger: item, start: 'top 80%' },
			});
		});
	} else {
		gsap.from(items, {
			transform: 'translateY(3rem)',
			opacity: 0,
			duration: 1,
			ease: 'power2.inOut',
			stagger: options.stagger,
			scrollTrigger: { trigger: items, start: 'top 80%' },
		});
	}
};
