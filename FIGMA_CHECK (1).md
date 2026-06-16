# Strict 3-method Figma fidelity check

Run all three against the dev server (`http://localhost:4321`) via the Playwright MCP. They're independent — each catches what the others miss. Pull Figma truth from the Figma MCP: `get_design_context` / `get_variable_defs` for values, `get_metadata` for geometry, `get_screenshot` for visuals.

## Why three

- **Method 1 (computed CSS)** → catches wrong values (font-size, padding, gap, color).
- **Method 2 (rendered geometry)** → catches wrong _layout_ even when CSS values look right (unequal columns, misaligned dividers, column math).
- **Method 3 (visual)** → catches what numbers can't (gradients, dashes, logo size, alignment, overall feel).

> The pricing-table bug proved why all three matter: Method 1 said every value was correct; Method 2 caught the columns rendering 408/503 instead of 456/456 (cause: differing L/R padding + flex distribution → fixed with `flex: 0 0 50%` + `box-sizing: border-box`).

## Method 1 — Computed CSS vs Figma px

Key trick: `size(N)` resolves to **exactly `N` px when the viewport equals the base width**. So set the viewport to the Figma frame width and `getComputedStyle` should match Figma px 1:1.

- Resize to **1536** (PC base = `lg`) and **390** (SP base = `sm`).
- Read `fontSize`, `lineHeight`, `padding*`, `gap`/`rowGap`/`columnGap`, `width`/`maxWidth`, `backgroundColor`, `borderRadius`, etc.
- Compare to Figma design-context values. Font tokens map 1:1 to `_font.scss` (`h2_01`=44·1.5, `h6_02`=21·1.8, `p_01`=18·1.8, …).

```js
() => {
	const px = (el, props) => {
		const c = getComputedStyle(el);
		const o = {};
		props.forEach((p) => (o[p] = c[p]));
		return o;
	};
	const q = (s) => document.querySelector(s);
	return {
		viewport: innerWidth,
		title: px(q('.c-x__title'), ['fontSize', 'lineHeight']),
		/* ... */
	};
};
```

Gotchas: `lineHeight` comes back computed (e.g. `44·1.5 = 66px`). On SP, a value measured slightly short vs Figma is usually the **~15px desktop scrollbar** shrinking `vw` — fine on real devices.

## Method 2 — Rendered geometry vs Figma node boxes

`get_metadata` on the node gives exact `x/y/width/height` per child. Compare to `getBoundingClientRect()` at the matching base viewport. This is the one that catches layout bugs.

- Verify: container/inner widths, column widths, gaps measured as `next.top - prev.bottom`, element-to-element offsets, counts (e.g. dividers = rows - 1).

```js
() => {
	const r = (el) => el.getBoundingClientRect();
	const a = document.querySelector('.first'),
		b = document.querySelector('.second');
	return {
		gap: Math.round(r(b).top - r(a).bottom),
		aWidth: Math.round(r(a).width),
	};
};
```

⚠️ sharp gotcha: `.stats()` ignores a chained `.extract()` — measure/extract to a real file first, or measure the actual element, not a transformed pipeline.

## Method 3 — Visual diff

`get_screenshot` the Figma node, then `browser_take_screenshot` the same element rendered (use `target`), and compare side by side.

- Confirms gradients, dashed lines, logo sizing, bullet styles, alignment.
- Note: a floating fixed element (the CTA button) may overlap element screenshots — ignore it.

## Reporting

State **what matched** (list the values) and **what didn't** (the specific px delta + root cause) — don't just say "looks good." Clean up any screenshot files written during the check.
