# タイピングゲーム

Webブラウザ上で動作する英単語タイピングゲーム。制限時間30秒で表示される単語を入力してスコアを競う。
プレイ後のスコアはサーバー上のデータベースに保存でき、履歴を表示できる。

「通信ソフトウエア論」の最終課題として作成。

## 使用技術

| 領域 | 技術 |
|---|---|
| フロントエンド | HTML / CSS / JavaScript |
| サーバーサイド | PHP（PDO） |
| データベース | MariaDB |
| サーバー | AWS EC2（Apache） |

## 構成

```
index.html   ゲーム画面。単語・スコア・入力欄・ボタンなどを配置し、style.css / script.js を読み込む
style.css    画面の見た目（色・レイアウト・ボタンのデザインなど）
script.js    ゲームの動作（タイマー処理、単語の出題、入力判定、スコア・正確率の計算）。
             保存・履歴取得の際に fetch で typing.php とデータをやり取りする
typing.php   サーバー側でDBを操作する。スコアの保存（INSERT）と履歴取得（SELECT）を担当
```

## 処理の流れ

1. ブラウザが`index.html`を開くと、`style.css`（見た目）と`script.js`（動作）が読み込まれる
2. 「保存」を押すと、`script.js`が`fetch`でスコアを`typing.php`に送信し、`typing.php`がMariaDBに保存する
3. 「履歴を見る」を押すと、`script.js`が`typing.php`にデータを要求し、MariaDBから取得したスコアを一覧表示する

フロント → PHP → データベース、という3層構造で動作する。

## 実行方法

PHP・MariaDBが必要（`typing.php`内のDB接続情報は環境に合わせて書き換えること）。

```
php -S localhost:8000
```

ブラウザで `http://localhost:8000/` を開く。
