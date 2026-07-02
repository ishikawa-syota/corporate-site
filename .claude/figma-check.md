# Strict Figma fidelity check

Run all methods against the dev server (`http://localhost:4321`) via the Playwright MCP. They're independent — each catches what the others miss. Pull Figma truth from the Figma MCP: `get_design_context` / `get_variable_defs` for values, `get_metadata` for geometry, `get_screenshot` for visuals.

> **Base widths for THIS project:** PC = **1536**, SP = **768** (`$design-width-pc` / `$design-width-sp` in `_variable.scss`). `size(N)` resolves to exactly `N` px when the viewport equals the base width, so measure at 1536 and 768 for a 1:1 Figma comparison. (This repo's SP Figma frame is 768, not 390.)

## Why multiple methods

- **Computed CSS (M1)** → catches wrong values (font-size, padding, gap, color).
- **Rendered geometry (M2)** → catches wrong _layout_ even when CSS values look right (unequal columns, misaligned dividers, column math).
- **Visual (M3/M4)** → catches what numbers can't (gradients, dashes, logo size, alignment, decorations, overall feel).
- **Metadata audit (M5)** → catches decoration nodes and frame-vs-content sizing that never surface in geometry or overflow.

Green numbers (`0 overflow`, `width = container`, `build passes`) are necessary, not sufficient — they never prove the composition or the decorations match.

## Method 0 — Composition gate (do this FIRST)

The measurement methods only verify an element you've **already confirmed is the right element, in the right place**. They cannot tell you the _composition_ is wrong (a full-width centered element and a right-aligned narrow element both report "0 overflow" and "width = container"). So before measuring anything:

1. **Pull the breakpoint-specific FRAME node for _every_ breakpoint** — `get_metadata` + `get_screenshot` on the **SP frame** _and_ the **PC frame**, not just the sub-node you touched. **Never infer SP from PC.** SP routinely differs in flex-direction, element order, element widths (not always 100%), line breaks, alignment, and decoration side/corner.
2. **Screenshot the WHOLE section** (not only the element you changed) and put it side-by-side with the Figma frame, top to bottom, at each breakpoint. Confirm: siblings vs stacked, flow direction, order, per-element widths, alignment, decoration sides/corners.
3. Only once the composition matches do the box metrics mean anything.

### Headlines / multi-line text (recurring offender)

A headline's whole job is its **line composition**, and PC and SP almost always break differently. Treat it as a hard gate:

1. **Never build a headline as a `display:flex` row and let it wrap** — flexbox squishes boxed chars into an ugly column instead of flowing as text. Make the container `text-align:center` + `line-height`, the boxed/text spans `display:inline-flex; vertical-align:middle` (so they flow inline like text), and force SP line breaks with an explicit `<br class="u-sp-only" />`.
2. **Pull the SP _and_ PC line structure from Figma before coding** (`get_metadata` on the headline frame) and replicate the exact break points.
3. **Verify the headline PER-ELEMENT, zoomed in, at SP** — count the lines and compare break points to the Figma SP node. A section-level glance does not count.

## Method 1 — Computed CSS vs Figma px

`size(N)` resolves to **exactly `N` px when the viewport equals the base width**. Set the viewport to the Figma frame width and `getComputedStyle` should match Figma px 1:1.

- Resize to the PC base (**1536**) and the SP base (**768**).
- Read `fontSize`, `lineHeight`, `letterSpacing`, `padding*`, `gap`/`rowGap`/`columnGap`, `width`/`maxWidth`, `backgroundColor`, `borderRadius`, etc.
- Compare to Figma values. Font tokens map 1:1 to the `ty-*` mixins in `_typography.scss` (e.g. `ty-heading` = 60·1.4, `ty-body` = 18·2.2, `ty-lead` = 25·1.4). Figma "tracking: N" = `letter-spacing: 0.0Nem`.

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
		title: px(q('.target'), ['fontSize', 'lineHeight', 'letterSpacing']),
		/* ... */
	};
};
```

Gotcha: `lineHeight` comes back computed (font-size × ratio). On SP, a value slightly short vs Figma is usually the **~15px desktop scrollbar** shrinking `vw` — fine on real devices.

## Method 2 — Rendered geometry vs Figma node boxes (MANDATORY for "pixel perfect")

`get_metadata` on the node gives exact `x/y/width/height` per child. Compare to `getBoundingClientRect()` at the matching base viewport (1536 PC / 768 SP → `size(N)` = N px, so Figma px == rendered px 1:1). This is the method that actually proves fidelity — a visual glance does NOT. **Do not claim "matches"/"pixel perfect" without this measurement table.**

- Pull `get_metadata` for the node and **measure the rendered equivalents** for: each container/card w·h, image w·h, every gap (`next.top - prev.bottom`), every padding, element offsets, icon sizes, and decoration positions.
- Build a **deltas table** (Figma value vs rendered value). **Tolerance: ≤2px.** Anything over → fix and re-measure. Loop until all within tolerance.
- **Container padding = compute ALL FOUR insets from the frame, every time:** `padTop = child.top − frame.top`, `padBottom = frame.bottom − child.bottom` (i.e. `frame.height − (child.y + child.height)`), and the same for left/right. **Never derive padding from only the content's offset** (e.g. taking `padding-top` from `main.y` and leaving `padding-bottom` unset) — that silently sticks content to one edge. **Never assume symmetry** (top==bottom) or that the section "hugs" its content; the leftover space inside a frame is real padding — verify the frame's bottom edge is a true boundary (the next section's `y` starts right after it) and measure it.
- **Never assume _any_ value from Figma.** Every number you write (px, padding, gap, color, weight, radius, count) must come from a node you actually read — `get_metadata`/`get_design_context`/`get_variable_defs` — not from symmetry, defaults, "looks like", or a sibling section's convention. If you didn't read it, you don't know it.
- Common misses this catches: a section/card constrained to the wrong width (e.g. whole section forced to a content-column width so cards shrink), non-uniform/ragged card heights where Figma has equal-height cards, side-paddings off by a couple px, **missing bottom padding (content stuck to the section's bottom edge)**, decoration (clip/marker) offsets.
- If a residual delta is purely **text line-wrap** (webfont metrics differ from Figma's font), say so explicitly — that's the one thing px-tolerance can't always force.

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

## Method 3 — Visual diff (per element)

`get_screenshot` the Figma node, then `browser_take_screenshot` the same element rendered (use `target`), and compare side by side.

- **Screenshot the whole section, not just the element you touched** — composition errors only show at section scope.
- Confirms gradients, dashed lines, logo sizing, bullet styles, alignment.
- A floating fixed element (e.g. a CTA button) may overlap element screenshots — ignore it.

## Method 4 — Side-by-side visual diff (MANDATORY final gate — do NOT skip)

Non-negotiable, and the step that actually catches design bugs. **Measurements + a single render screenshot are NOT this step.** Skipping it is the single biggest recurring failure.

Put the Figma export and the **full-section** render in the same field of view, at **both** breakpoints, and read top-to-bottom.

- **Preferred (stitched):** if you have both as PNG files, stitch them into one image (left = Figma, right = render). `render.png` from `browser_take_screenshot` (target the section, full height); `figma.png` from a saved Figma frame export.
- **Fallback (no stitch):** the Figma MCP `get_screenshot` returns an image into context, **not a file**. Pull the breakpoint-specific frame export into context, capture the full-section render, and compare **region-by-region** (title, each block, flow, closer). Zoom into each region's sub-node when a full-section thumbnail is too small to judge.
- Run at **both** breakpoints, scrollbar removed for SP (`documentElement.style.overflow='hidden'`).
- **Decorative sub-elements are the usual miss** — flanking rules, dividers, underlines, a squared "tail" corner, alternating sides. They carry no width/overflow signal, so only the visual catches them. For every text/heading block, explicitly ask: is there a rule/line/underline beside or under it in Figma?

> If the Figma frame node returns "node not found / make sure the document is the active tab," the desktop app's active tab moved off the file. **STOP and ask the user to refocus the frame — do not proceed on numbers alone.**

## Method 5 — Metadata audit (decoration nodes; frame vs content)

Before implementing, read the `get_metadata` XML and always close out these easily-missed points:

1. **`Line*` / `Vector` nodes are likely text decorations.** Thin line nodes overlapping the top/bottom/sides of text are usually underlines (incl. dashed), strikethroughs, markers, or enclosing rules. They show up in neither geometry nor overflow, and being thin are easy to miss in a screenshot too. **"It's decorative, ignore it" is forbidden** — always implement them. To follow text wrapping, use **`text-decoration` (e.g. `underline dashed`)** rather than an absolutely-positioned line.
2. **Use the `<img>` / frame dimensions for size — not the content (masked image) rect.** Figma holds the display box (`<img>`/frame) and the masked actual image inside it (larger than the box) as separate nodes. **What's displayed is the box size.** Using the content rect causes oversizing / overflow. Also confirm the supplied image's aspect ratio matches the box.
3. **An absolutely-positioned `<img>` won't stretch with both `left` and `right` set** (replaced elements use their intrinsic size). For full-bleed, set an explicit `width` (`100vw`, or `calc(100% + padding*2)`). On SP, `100vw` looks a few px off due to the scrollbar but matches when centered on a real device.

## Method 6 — Element inventory gate (MANDATORY before claiming match)

A zoomed-out "looks like the same layout" is NOT a check — subtle decorations (grid/paper textures, faint lines, borders, shadows, icons) are invisible at that zoom, and matching _composition_ is not matching _fidelity_. So before you may say "matches Figma":

1. **Enumerate every Figma layer** for the node from `get_metadata` / `get_design_context` — including every decorative one: background textures/grids/patterns, lines/rules/underlines, borders, shadows, icons, dividers, paperclips, markers.
2. **Build a checklist** — one row per layer — and mark each **✅ present in render / ❌ missing / ⚠ approximated**. You MAY NOT report "match" while any `❌` is unexplained.
3. **Zoom in, region by region, at ~100%** — compare each region (header, each card, message, …) against its Figma node export. NEVER conclude from a single shrunken full-section thumbnail; a 7000px section scaled into a thumbnail hides everything thin.
4. The report must **show the checklist**, not assert "matches." Each `✅` means "I looked at this element at zoom and it's there and right."

## Reporting

- State **what matched** (list the values) and **what didn't** (the specific px delta + root cause) — don't just say "looks good."
- **Never claim "matches Figma" off green numbers OR a zoomed-out glance.** Every "matches" must be backed by the **Method 4 side-by-side visual at both breakpoints AND the Method 6 element-inventory checklist** — if you didn't do both, you have not checked it, full stop.
- Clean up any screenshot files / `.playwright-mcp` artifacts written during the check.
