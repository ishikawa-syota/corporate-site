import { writeFileSync, readFileSync } from 'fs';

import * as cheerio from 'cheerio';
import { glob } from 'glob';

const replacePathsInFiles = () => {
	const FILE_ROOT_PATH = '{{ file_root_path }}';

	try {
		// Process HTML files in dist
		const htmlFiles = glob.sync('dist/**/*.html');

		for (const file of htmlFiles) {
			 
			console.log(`Processing HTML file: ${file}`);

			// Read the file
			const data = readFileSync(file, 'utf8');

			// Load HTML into cheerio
			const $ = cheerio.load(data);

			// Replace src attributes that start with "./"
			$('[src^="./"]').each((_, element) => {
				const $el = $(element);
				const currentSrc = $el.attr('src');
				const newSrc = currentSrc.replace(/^\.\//, `${FILE_ROOT_PATH}/`);
				$el.attr('src', newSrc);
			});

			// Replace href attributes that start with "./"
			$('[href^="./"]').each((_, element) => {
				const $el = $(element);
				const currentHref = $el.attr('href');
				const newHref = currentHref.replace(/^\.\//, `${FILE_ROOT_PATH}/`);
				$el.attr('href', newHref);
			});

			// Replace href attributes that start with "/" (absolute paths from root)
			$('[href^="/"]').each((_, element) => {
				const $el = $(element);
				const currentHref = $el.attr('href');
				const newHref = currentHref.replace(/^\//, `${FILE_ROOT_PATH}/`);
				$el.attr('href', newHref);
			});

			// Handle style attributes with url() containing relative paths
			$('[style*="url("]').each((_, element) => {
				const $el = $(element);
				const currentStyle = $el.attr('style');
				const newStyle = currentStyle.replace(
					/url\((['"]?)\.\/([^)]+)\)/g,
					`url($1${FILE_ROOT_PATH}/$2)`
				);
				$el.attr('style', newStyle);
			});

			// Handle inline CSS in <style> tags
			$('style').each((_, element) => {
				const $el = $(element);
				const currentCSS = $el.html();
				const newCSS = currentCSS.replace(
					/url\((['"]?)\.\/([^)]+)\)/g,
					`url($1${FILE_ROOT_PATH}/$2)`
				);
				$el.html(newCSS);
			});

			// Handle meta tags with content attributes that start with "/" (absolute paths)
			$('meta[content^="/"]').each((_, element) => {
				const $el = $(element);
				const currentContent = $el.attr('content');
				const newContent = currentContent.replace(/^\//, `${FILE_ROOT_PATH}/`);
				$el.attr('content', newContent);
			});

			// Handle meta tags with content attributes that start with "./" (relative paths)
			$('meta[content^="./"]').each((_, element) => {
				const $el = $(element);
				const currentContent = $el.attr('content');
				const newContent = currentContent.replace(
					/^\.\//,
					`${FILE_ROOT_PATH}/`
				);
				$el.attr('content', newContent);
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
