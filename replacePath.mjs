import { writeFileSync, readFileSync } from 'fs';

import { glob } from 'glob';
import { parse } from 'node-html-parser';

const replacePathsInFiles = () => {
	try {
		// Process HTML files in dist
		const files = glob.sync('dist/**/*.html');

		for (const file of files) {
			console.log(`Processing HTML file: ${file}`);

			// Read the file
			const data = readFileSync(file, 'utf8');

			// Parse HTML with node-html-parser
			const root = parse(data, {
				comment: true,
				blockTextElements: {
					script: true,
					style: true,
					noscript: true,
					pre: true,
				},
			});

			// Handle style attributes with url(./
			for (const el of root.querySelectorAll('[style]')) {
				const style = el.getAttribute('style');
				if (style?.includes('url(./')) {
					el.setAttribute(
						'style',
						style.replace(/url\(\.\//g, 'url(../../')
					);
				}
			}

			// Handle inline CSS in <style> tags
			for (const el of root.querySelectorAll('style')) {
				const css = el.innerHTML;
				if (css?.includes('url(./')) {
					el.set_content(css.replace(/url\(\.\//g, 'url(../'));
				}
			}

			// Write the modified HTML back to file
			writeFileSync(file, root.toString(), 'utf8');
		}

		console.log('Path replacement completed successfully!');
	} catch (error) {
		console.error('Error during path replacement:', error);
	}
};

replacePathsInFiles();
