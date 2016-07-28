# js-redirect-module
モバイルデバイスのリダイレクト制御
(Redirect control of the mobile device)
   
##使い方(Using)
```html
<script src="/assets/js/js-redirect-module.js" charset="UTF-8"></script>
```
   
##オプション(Options)
```javascript
var mobileDir = 'sp';
```
モバイルデバイス(又は切り替え用)の対象ディレクトリを記述します。  
※スマホ専用サイトが「/sp/」に配置されている場合は、「sp」と記述します。  
※「/」スラッシュは省略します。
(Describe the target directory of the mobile device. (or for switching))  
   
```javascript
var rootPath = ''
```
サイトトップページへの、パスを記述します。  
※トップページが「/top/」に配置されている場合は、「top」と記述します。  
(To the site top page, describing the path.)  
   
```javascript
var exception = 'is-pc';
```
例外処理をする文字列を記述します。  
※設定した文字列がURL末尾等に存在している場合は、リダイレクトさせないことができます。  
　ex. http://www.yama-dev.com/top/#is-pc  
(The string that will be the exception processing.)  
   
##ブラウザサポート(Browser support)
IE8+, Chrome, Firefox, Safari.  
Android 4.0+ iOs 8.0+  
   
##依存ライブラリ(Dependencies)
none  
   
##ライセンス(License)
Copyright yama-dev  
Licensed under the MIT license.  
