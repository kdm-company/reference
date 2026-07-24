# 参考要素倉庫(形のパクり倉庫)

参考サイトの「形」(レイアウト・構図・パーツの組み方)だけを保管する倉庫。
**色・テキスト・画像は対象外。形の骨格だけ**を貯めて、Claude Code でサイト作成時に引っ張って使う。

---

## チームメンバーへ(はじめに読む)

### 取得する

```bash
git clone <このリポジトリのURL>
cd 参考要素倉庫
```

更新を取り込むときは `git pull`。

### 見る

`catalog.html` をブラウザで開くと、各サイトの形がワイヤーフレーム縮図で一覧表示されます。
使いたい形のカードをクリックするとID(例 `LAYOUT-001`)がコピーされます。
※ GitHub Pages を有効にしていれば、ブラウザだけで閲覧できます(URLはチームに共有)。

### 使う(Claude Code で引用)

使いたい形のIDを Claude Code に伝えるだけ。例:

> `参考要素倉庫/sites/002_hitachi/skeleton.html` の LAYOUT-002 の構図でヒーローを作って。

骨格HTMLは色・文字を抜いた構造スケルトンなので、そのまま流用できます。
各 skeleton.html には**スマホ版の崩し方(`@media(max-width:768px)`)も含めて**あるので、SP対応もゼロから設計せず流用できます(崩し方の要点は composition.md の「スマホ版の構造(SP)」に記載)。

### 形を追加したくなったら

参考サイトのスクショとURLを Claude(Cowork)に渡せば、同じ形式で `sites/` に追加されます。
追加後は `git add . && git commit -m "add 008_..." && git push` で共有。

---

## 使い方(あなたの作業はURLを送るだけ)

1. 参考サイトのURLを送る(+どの部分かを一言)。
2. このフォルダに `sites/連番_名前/` が追加される。中身は:
   - `skeleton.html` … 色・文字を抜いた構造スケルトン(ブラウザで開くと形が見える)
   - `composition.md` … 一言の形の説明 + 再現のキモ
3. `catalog.html` をブラウザで開き、ワイヤーフレーム縮図を見て使う形を選ぶ。
4. Claude Code に `LAYOUT-001` のようなIDを伝えて流用する。

## なぜこの方式か

形はHTML/CSSそのものに書いてある。スクショを目で書き起こすより、構造を骨格HTMLとして保管する方が速く・正確で、Claude Codeがコードを直接流用できる。

## フォルダ構成

```
参考要素倉庫/
├─ README.md
├─ catalog.html          ← ワイヤーフレーム縮図一覧(ブラウザで見る)
├─ sites/
│  └─ 001_nisshin/
│     ├─ skeleton.html        ← 構造スケルトン
│     └─ composition.md      ← 形の説明＋再現のキモ
├─ patterns/           ← 背景の柄(SVG)。1柄=1ファイル
│  └─ PATTERN-001.svg
└─ indexes/
   ├─ layouts.md      ← 構図パターン横断
   ├─ decorations.md           ← 形のパーツ横断
   └─ patterns.md              ← 柄(背景パターン)横断
```

`patterns/` は背景に敷く柄を `<pattern>` でタイル化したSVGで保管する(形の倉庫の例外。柄は図柄そのものが成果物)。
`catalog.html` の「柄(PATTERN)」セクションで縮図を見て選び、IDを Claude Code に渡して使う。

## ID命名ルール

- `LAYOUT-xxx` レイアウト・構図(主役)
- `DECO-xxx` 形のあしらい(リボン・区切り・ボタン形など)
- `PATTERN-xxx` 背景の柄(ドット・斜線・格子・市松など)

## 登録サイト一覧

| No | サイト名 | 形タグ | 骨格 | メモ |
|----|---------|--------|------|------|
| 001 | 日新ネットワークス | #フルブリードヒーロー #左テキスト右ビジュアル #斜め曲線リボン | [skeleton.html](sites/001_nisshin/skeleton.html) | [composition.md](sites/001_nisshin/composition.md) |
| 002 | 日立 | #中央寄せヒーロー #2段ヘッダー #ピル型CTA #カード重ねオフセット | [skeleton.html](sites/002_hitachi/skeleton.html) | [composition.md](sites/002_hitachi/composition.md) |
| 003 | 岩崎電気 | #テキスト左画像右 #下線見出し #交互積み #固定ヘッダー #メニュー併設 #放射状グロー | [skeleton.html](sites/003_iwasaki/skeleton.html) | [composition.md](sites/003_iwasaki/composition.md) |
| 004 | 福助 | #円形カードナビ #3カード横並び #長方形バナー2連 #ぼかし写真背景(1セット) #フッター | [skeleton.html](sites/004_fukuske/skeleton.html) | [composition.md](sites/004_fukuske/composition.md) |
| 005 | Apple系 | #中央寄せ製品ヒーロー #ピル型CTA #角丸カード #セグメントタブ #非対称グリッド | [skeleton.html](sites/005_apple/skeleton.html) | [composition.md](sites/005_apple/composition.md) |
| 006 | 安川電機 | #情報密度ヘッダー #2段ヘッダー #スライダーヒーロー #ニュース行リスト #カラーラベル | [skeleton.html](sites/006_yaskawa/skeleton.html) | [composition.md](sites/006_yaskawa/composition.md) |
| 007 | PROGRIT | #超大型見出し #斜め装飾シェイプ #カードグリッド3+2 #浮き立体カード #人物はみ出し #大型フッター | [skeleton.html](sites/007_progrit/skeleton.html) | [composition.md](sites/007_progrit/composition.md) |
| 008 | ビズリーチ | #問い合わせ案内 #中央寄せ #主CTA+電話 #補足リンク文 | [skeleton.html](sites/008_bizreach/skeleton.html) | [composition.md](sites/008_bizreach/composition.md) |
| 009 | 京都きもの学院 | #リード訴求 #中央寄せ #キャッチ見出し #明朝系 #余白広め | [skeleton.html](sites/009_kyoto_kimono/skeleton.html) | [composition.md](sites/009_kyoto_kimono/composition.md) |
| 010 | セブン-イレブン | #リンクグリッド #サービス案内 #見出し+説明 #取組み紹介カード横並び | [skeleton.html](sites/010_seven/skeleton.html) | [composition.md](sites/010_seven/composition.md) |
| 011 | 幕張ベイパーク耳鼻咽喉科 | #全画面KV #オーバーラップ情報カード #メガメニュー #正方形リンクパネル | [skeleton.html](sites/011_makuhari_jibika/skeleton.html) | [composition.md](sites/011_makuhari_jibika/composition.md) |
| 012 | 日本ゼトック | #コーポレートトップ丸ごと #番号バッジカード3連 #はみ出し白ボックス特集カード | [skeleton.html](sites/012_zettoc/skeleton.html) | [composition.md](sites/012_zettoc/composition.md) |
| 013 | ノダRFテクノロジーズ | #製造業トップ丸ごと #番号ページャ同期スライダ #CVフッター | [skeleton.html](sites/013_nrf/skeleton.html) | [composition.md](sites/013_nrf/composition.md) |
| 014 | Golfcart Vision | #浮きヘッダー #ダブルCTAブロック #アンカーナビ | [skeleton.html](sites/014_golfcart/skeleton.html) | [composition.md](sites/014_golfcart/composition.md) |
| 015 | primeNumber | #ソリッドカラーヒーロー #ロゴマーキー帯 #見出しグループ付きドロップダウンナビ | [skeleton.html](sites/015_primenumber/skeleton.html) | [composition.md](sites/015_primenumber/composition.md) |
| 016 | Ubie | #淡グラデヒーロー #対象者別リンク3連 #正方ダブルCTA #サービス交互ブロック | [skeleton.html](sites/016_ubie/skeleton.html) | [composition.md](sites/016_ubie/composition.md) |
| 017 | LayerX | #余白極大タイポヒーロー #複合ピルCTA | [skeleton.html](sites/017_layerx/skeleton.html) | [composition.md](sites/017_layerx/composition.md) |
| 018 | 杉本法律事務所 | #料金表 #プラン比較表 #含む含まないリスト | [skeleton.html](sites/018_sugimoto_lawyer/skeleton.html) | [composition.md](sites/018_sugimoto_lawyer/composition.md) |
| 019 | つなぐ | #相談の流れ #番号ステップ #CTA帯 | [skeleton.html](sites/019_tsunagu/skeleton.html) | [composition.md](sites/019_tsunagu/composition.md) |
| 020 | 弁護士法人ステラ | #FAQ #カテゴリ内リンク #QA縦積み | [skeleton.html](sites/020_stellalaw/skeleton.html) | [composition.md](sites/020_stellalaw/composition.md) |
| 021 | Angelux | #代表挨拶 #キャッチコピー主役 #署名 | [skeleton.html](sites/021_angelux/skeleton.html) | [composition.md](sites/021_angelux/composition.md) |
