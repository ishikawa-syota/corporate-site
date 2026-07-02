import { writeFileSync, readFileSync } from 'fs';

import { glob } from 'glob';

const replaceInHtmlFiles = () => {
	try {
		const files = glob.sync('dist/**/*.html');

		for (const file of files) {
			// htmlファイルの読み込み
			const data = readFileSync(file, 'utf8');

			// htmlの置かれているパスから相対(., ..)を算出
			let relativePath = file.replace(/[^/]/g, '').replace(/\//g, '.');

			if (relativePath.length === 1) {
				relativePath = file.replace(/[^/]/g, '').replace(/\//g, '.');
			} else {
				relativePath = file.replace(/[^/]/g, '').replace(/\//g, '../');
				if (file.includes('index.html')) {
					relativePath = relativePath.slice(0, -4);
					// 3 ... | ../../ → ..
					// 4 .... | ../../../ → ../..
					// 5 ..... | ../../../../ → ../../..
				} else {
					relativePath = relativePath.slice(0, -1);
					// 3 ... | ../../ → ../..
					// 4 .... | ../../../ → ../../..
					// 5 ..... | ../../../../ → ../../../..
				}
			}

			// 絶対パスを相対パスに置換する
			const result = data
				.replace(/href="\//g, `href="${relativePath}/`)
				.replace(/href='\//g, `href='${relativePath}/`)
				.replace(/src="\//g, `src="${relativePath}/`)
				.replace(/src='\//g, `src='${relativePath}/`)
				.replace(/srcset="([^"]+)"/g, (match, srcsetContent) => {
					// srcset内の各パスを処理
					const processedSrcset = srcsetContent
						.split(',')
						.map((part) => {
							return part.replace(/^\s*\//, `${relativePath}/`);
						})
						.join(',');
					return `srcset="${processedSrcset}"`;
				})
				.replace(/srcset='([^']+)'/g, (match, srcsetContent) => {
					// srcset内の各パスを処理（シングルクォート版）
					const processedSrcset = srcsetContent
						.split(',')
						.map((part) => {
							return part.replace(/^\s*\//, `${relativePath}/`);
						})
						.join(',');
					return `srcset='${processedSrcset}'`;
				})
				.replace(/action="\//g, `action="${relativePath}/`)
				.replace(/action='\//g, `action='${relativePath}/`)
				.replace(/content="\//g, `content="${relativePath}/`)
				.replace(/content='\//g, `content='${relativePath}/`);

			writeFileSync(file, result, 'utf8');
		}
	} catch (error) {
		console.log(error);
	}
};

replaceInHtmlFiles();
