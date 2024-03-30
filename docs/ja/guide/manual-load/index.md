# 好きなバージョンを追加する

ここでは、ストアで公開されていない拡張機能を読み込む方法を説明します。
拡張機能のファイルは[GitHubのリリースページ](https://github.com/HotariTobu/manaba-plus/releases)からダウンロードできます。
あらかじめ、ダウンロードした拡張機能のファイルを展開しておきます。

## Chromeの場合

1. `chrome://extensions/`にアクセスする

![](./img/Chrome-1.png)

2. `manifest.json`が含まれるディレクトリを指定して読み込む

![](./img/Chrome-2.png)

## Edgeの場合

1. `edge://extensions/`にアクセスする

![](./img/Edge-1.png)
![](./img/Edge-2.png)

2. `manifest.json`が含まれるディレクトリを指定して読み込む

![](./img/Edge-3.png)

## Firefoxの場合

1. `about:addons`にアクセスする

![](./img/Firefox-1.png)

2. `about:debugging#/runtime/this-firefox`にアクセスする

![](./img/Firefox-2.png)

3. `manifest.json`を指定して読み込む

![](./img/Firefox-3.png)
