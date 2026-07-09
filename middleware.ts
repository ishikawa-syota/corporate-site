import { next } from '@vercel/functions';

// 公開前のBasic認証ゲート（Vercel Routing Middleware）
// 認証情報は Vercel の環境変数 BASIC_AUTH_USER / BASIC_AUTH_PASSWORD で設定する。
// 未設定の場合は全リクエストを拒否する（フェイルクローズ）。
// 正式リリース時はこのファイルを削除する。

export default function middleware(request: Request) {
	const expectedUser = process.env.BASIC_AUTH_USER;
	const expectedPassword = process.env.BASIC_AUTH_PASSWORD;

	if (!expectedUser || !expectedPassword) {
		return unauthorized();
	}

	const auth = request.headers.get('authorization');
	if (auth?.startsWith('Basic ')) {
		try {
			const decoded = atob(auth.slice('Basic '.length));
			const separator = decoded.indexOf(':');
			const user = decoded.slice(0, separator);
			const password = decoded.slice(separator + 1);
			if (user === expectedUser && password === expectedPassword) {
				return next();
			}
		} catch {
			// 不正なBase64はそのまま401へ
		}
	}

	return unauthorized();
}

function unauthorized(): Response {
	return new Response('Authentication required', {
		status: 401,
		headers: { 'WWW-Authenticate': 'Basic realm="Restricted"' },
	});
}
