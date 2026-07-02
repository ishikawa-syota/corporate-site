# JSのライブラリに対して使用するscss

## 決まりごと

- jsのライブラリ毎に scssファイルを増やして使用する。
- 基本的なデフォルトのスタイルを打ち消す際に使用する。

#### 例 :

├── lib/  
 │ ├── \_swiper.scss  
 │ ├── \_hogehoge.scss  
 │ ├── \_mogemoge.scss  
 │ └── ...

- swiper.js など、基本的にすでにcssが当たっている状態だと思うので、上書きしていく形で書いてしまえば大丈夫です。

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
