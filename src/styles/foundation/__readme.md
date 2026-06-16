
# リセットや基本的な記述に対して使用するscss
## `mixinなどの変数/関数もこのディレクトリ内に入っています`


# メディアクエリ :
ブレイクポイントは _variable.scss に書いています。
そこに書いてある数値を変更する事でブレイクポイントを設定できます。

### 実際の使用例 :

```css
.hogehoge {
	width: 100%;
	@media only screen and (max-width: $Bp-11inch) {
		width: 50%;
	}
	@media only screen and (max-width: $Bp-7inch) {
		width: 25%;
	}
	@media only screen and (max-width: $Bp-Mobile) {
		width: 10%;
	}
}
```