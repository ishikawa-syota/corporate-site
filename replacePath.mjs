import { writeFileSync, readFileSync } from 'fs';

import * as cheerio from 'cheerio';
import { glob } from 'glob';

const replacePathsInFiles = () => {
	try {
		// Process HTML files in dist
		const files = glob.sync('dist/**/*.html');

		for (const file of files) {
			 
			console.log(`Processing HTML file: ${file}`);

			// Read the file
			const data = readFileSync(file, 'utf8');

			// Load HTML into cheerio
			const $ = cheerio.load(data);

			// Handle style attributes with url(./
			$('[style*="url(./"]').each((_, element) => {
				const $el = $(element);
				const currentStyle = $el.attr('style');
				const newStyle = currentStyle.replace(/url\(\.\//g, 'url(../../');
				$el.attr('style', newStyle);
			});

			// Handle inline CSS in <style> tags
			$('style').each((_, element) => {
				const $el = $(element);
				const currentCSS = $el.html();
				const newCSS = currentCSS.replace(/url\(\.\//g, 'url(../../');
				$el.html(newCSS);
			});

			// Write the modified HTML back to file
			writeFileSync(file, $.html(), 'utf8');
		}

		 
		console.log('Path replacement completed successfully!');
	} catch (error) {
		 
		console.error('Error during path replacement:', error);
	}
};

replacePathsInFiles();
