# 全体的な記述ルール
- ネストは最大で3階層までに収まるように「可能な限り」調整
- 疑似要素は階層のカウントには含まない

#### 例
```scss
	.c-card-hogehoge {
		display: flex;

		.img-wrap {
			img {
				....
			}
		}

		.text-wrap {
			....
			.title { //こういうのにはせずに
				....
			}
		}

		.text-title { //こうしましょう
			....
			.hogehoge { //可能な限りこの階層まで
				img { //こういうのはOK

				}
				&::after { //こういうのはOK

				}
				span { //こういうのはOK
					
				}
		}

	}
```
```html
	<div class="c-card-hogehoge">

		<!-- Card -->
		<div class="card">

			<!-- Img -->
			<div class="img-wrap">
				<img src="hogehoge.jpg" alt="">
			</div>

			<!-- Text -->
			<div class="text-wrap">
				<h2 class="text-title">mogemoge</h2>
			</div>

		</div><!--/.card-->

	</div>
```
# ヘルパークラス
- 変更無し。アンダースコアから始める。`._white`, `._black` 等。

# jsを使ってクリックによって動的に class を付与する場合
## トリガーの場合
- 接頭辞として `.js-`を付ける。 `js-hogehoge` 等。このclass自体にスタイルは指定しない。あくまで js のトリガーになるだけのものとして扱う。
## 付与するclassの場合
- 接頭辞として `.is-`を付ける。 `is-hogehoge` 等。
- `.js-scroll-target` または `.js-scroll-target-onece` で付与されるclassは `.is-on` になっています。
https://launchcraft-llc.slack.com/archives/C01J638HJDA/p1645865816119979?thread_ts=1645864112.947279&cid=C01J638HJDA

# 命名規則

## layout
`.l-[要素名]-[適切な名前]`  

### 例
`.l-header`  
`.l-footer`

---

## object > component
`.c-[コンポーネント名]-[適切な名前]`  

### 例
`.c-btn-link`  
`.c-btn-modal`

---

## object > project
### 各ページ命名規則 :
`.p-[ページ名]-[セクション名]`  
#### 例  
`.p-top-firstview`  
`.p-about-access`

### シングルページ命名規則 :
命名規則 :  
`.p-[ポストタイプ]-[セクション名]`  
#### 例
`.p-blog-content`  
`.p-news-recent-post`  
※シングルページが1パターンしか無い場合は [ポストタイプ] の箇所は適当で良いです。
`.p-single-content` とか。  


# メディアクエリコピペ用

@media only screen and (max-width: $Bp-15inch) {
}

@media only screen and (max-width: $Bp-13inch) {
}

@media only screen and (max-width: $Bp-11inch) {
}

@media only screen and (max-width: $Bp-7inch) {
}

@media only screen and (max-width: $Bp-Mobile) {
}