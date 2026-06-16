
# 各ページに対して使用するscss

## ページ毎に増やして使用

#### 例 :  
  ├── project/  
  │   ├── _index.scss  
  │   ├── _about.scss  
  │   ├── _company.scss  
  │   └── ...

## 決まりごと
- ページ特有の要素や調整などがある際に使用する

#### 例
_heading.scss 書いてある見出し要素にページ特有(またはそのページのセクション特有)の margin を入れたい時

### `_heading.scss`
```scss

	.c-heading-title {
		font-size: 5rem;
	}

```

### `project > about.scss`
```scss

	.p-about-hogehoge {

		.c-heading-title {
			margin-bottom: 8rem;
		}

	}

```

### `page-about.php`
```html

	<div class="p-about-hogehoge">

		<div class="c-heading-page-title">
			...
		</div>

	</div>

```

# 各ページ命名規則 :
`.p-[ページ名]-[セクション名]`  
#### 例  
`.p-top-firstview`  
`.p-about-access`

# シングルページ命名規則 :
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