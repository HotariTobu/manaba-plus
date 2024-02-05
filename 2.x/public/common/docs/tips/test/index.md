# テストTips

ここでは、ストアで公開されていない拡張機能を読み込む方法を説明します。

あらかじめ、ダウンロードした拡張機能のファイルを展開しておきます。

## Chromeの場合

1. `chrome://extensions/`にアクセスする

![](img/image-Chrome-1.png)

2. `manifest.json`が含まれるディレクトリを指定して読み込む

![](img/image-Chrome-2.png)
        
## Edgeの場合

1. `edge://extensions/`にアクセスする

![](img/image-Edge-1.png)
![](img/image-Edge-2.png)

2. `manifest.json`が含まれるディレクトリを指定して読み込む

![](img/image-Edge-3.png)
        
## Firefoxの場合

1. `about:addons`にアクセスする

![](img/image-Firefox-1.png)

2. `about:debugging#/runtime/this-firefox`にアクセスする

![](img/image-Firefox-2.png)

3. `manifest.json`を指定して読み込む

![](img/image-Firefox-3.png)
        