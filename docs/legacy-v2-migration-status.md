# 旧カタログ資産のv2移行状況

最終更新: 2026-07-25（第2バッチPR時点）

## 集計

- 対象旧資産: 51件（DECO 23 / LAYOUT 18 / PATTERN 10。DECO-001・DECO-007は欠番のため、想定50件と1件差）
- A. そのままv2移行可能: 40件
- B. 一部情報不足: 11件（PATTERN-001〜010、DECO-005）
- C. 重複・統合候補: 0件
- D. 旧版として維持: 0件
- 未判定: 0件
- 第1バッチ移行済み: 5件（DECO-003 / DECO-011 / DECO-014 / LAYOUT-005 / LAYOUT-011）
- 第2バッチ移行済み: 10件（DECO-002 / DECO-010 / DECO-013 / DECO-023 / LAYOUT-001 / LAYOUT-003 / LAYOUT-004 / LAYOUT-006 / LAYOUT-010 / LAYOUT-015）
- v2移行済み合計(本ドキュメント対象の旧資産51件のうち): 15件
- 分類A(移行可能)の未移行残り: 25件
- 参考: parts/manifest.json 全体は24件（本ドキュメントの対象外である DECO-026〜034 の9件〈旧資産51件のカウント外・既存v2ネイティブパーツ〉を含む）

## 分類基準の解釈

- `sites/<サイト>/skeleton.html` は実サイトから採取した構造資料であり、そこからのSVG作図はDECO-026〜034で確立済みのv2方式と同じ扱いとする（「推測でSVGを作る」には当たらない）。
- PATTERN-001〜010は既存SVG原本（`patterns/*.svg`）があるが、横断的な柄のため元サイトURL（schema必須の`site.url`）と用途軸の統制語彙を根拠を持って設定できない。schema/vocab整備後に移行判断。
- DECO-005はSVG原本がなく実体はCSS（radial-gradient）のコード。用途軸の該当語彙もないためB。
- 第2バッチでは、`vocab.json`の`use`語彙に一致する明示的な用途記述（例:「トップページ」「問い合わせ」「会社概要」「お知らせ」「代表メッセージ」等）が旧資料(indexes/*.md・composition.md)に直接存在する資産のみを対象とした。ヘッダー・フッター等のサイト全体で使われるUIチュームで、旧資料に用途軸を裏付ける明示的な記述がないもの（DECO-004固定ヘッダー、DECO-006フッター、DECO-008/DECO-009等）は、属性を推測で埋めることになるため今回は見送り、分類Aの未移行のまま残した。

## 一覧

| ID | 名称 | 旧カテゴリ | 元サイト | 既存ファイル | 分類 | 不足情報 | 推奨 |
|---|---|---|---|---|---|---|---|
| DECO-002 | カード重ねオフセット | DECO | 日立 | parts/DECO-002.json、parts/DECO-002.svg、sites/002_hitachi/ | A | なし | 第2バッチで移行済み |
| DECO-003 | 見出しの型(英語ラベル+和文見出し+短下線) | DECO | 岩崎電気 | parts/DECO-003.json、parts/DECO-003.svg、sites/003_iwasaki/ | A | なし | 第1バッチで移行済み |
| DECO-004 | 固定ヘッダー(スクロール表示・言語トグル+検索併設) | DECO | 岩崎電気 | indexes/decorations.md、sites/003_iwasaki/ | A | なし | 第2バッチ以降で移行(用途軸の明示的根拠なし。要検討) |
| DECO-005 | 放射状グロー背景 | DECO(柄扱いでpatterns.mdへ移動済み) | 岩崎電気 | indexes/patterns.md、sites/003_iwasaki/ | B | SVG原本なし(実体はCSS radial-gradient)、用途軸の該当語彙なし | vocab整備後に移行判断 |
| DECO-006 | フッター(濃色中央寄せ縦積み) | DECO | 福助 | indexes/decorations.md、sites/004_fukuske/ | A | なし | 第2バッチ以降で移行(用途軸の明示的根拠なし。要検討) |
| DECO-008 | 2カラム関連情報カード | DECO | Apple | indexes/decorations.md、sites/005_apple/ | A | なし | 第2バッチ以降で移行(用途軸の明示的根拠なし。要検討) |
| DECO-009 | ピル型セグメントタブ | DECO | Apple | indexes/decorations.md、sites/005_apple/ | A | なし | 第2バッチ以降で移行(用途軸の明示的根拠なし。要検討) |
| DECO-010 | スライダー型ヒーロー | DECO | 安川電機 | parts/DECO-010.json、parts/DECO-010.svg、sites/006_yaskawa/ | A | なし | 第2バッチで移行済み |
| DECO-011 | ニュース行リスト(日付+カラーラベル+タイトル) | DECO | 安川電機 | parts/DECO-011.json、parts/DECO-011.svg、sites/006_yaskawa/ | A | なし | 第1バッチで移行済み |
| DECO-012 | 浮き立体カード | DECO | PROGRIT | indexes/decorations.md、sites/007_progrit/ | A | なし | 第2バッチ以降で移行 |
| DECO-013 | 人物はみ出しメッセージカード | DECO | PROGRIT | parts/DECO-013.json、parts/DECO-013.svg、sites/007_progrit/ | A | なし | 第2バッチで移行済み |
| DECO-014 | 問い合わせ案内ブロック(見出し→主CTA→電話→補足) | DECO | ビズリーチ | parts/DECO-014.json、parts/DECO-014.svg、sites/008_bizreach/ | A | なし | 第1バッチで移行済み |
| DECO-015 | 見出し+リード訴求ブロック | DECO | 京都きもの学院 | indexes/decorations.md、sites/009_kyoto_kimono/ | A | なし | 第2バッチ以降で移行 |
| DECO-016 | 取組み紹介カード横並び | DECO | セブン-イレブン | indexes/decorations.md、sites/010_seven/ | A | なし | 第2バッチ以降で移行 |
| DECO-017 | 画像カード付きフルワイドメガメニュー | DECO | 幕張ベイパーク耳鼻咽喉科 | indexes/decorations.md、sites/011_makuhari_jibika/ | A | なし | 第2バッチ以降で移行 |
| DECO-018 | 正方形リンクパネル横並び | DECO | 幕張ベイパーク耳鼻咽喉科 | indexes/decorations.md、sites/011_makuhari_jibika/ | A | なし | 第2バッチ以降で移行 |
| DECO-019 | 番号バッジ付き画像カード3連 | DECO | 日本ゼトック | indexes/decorations.md、sites/012_zettoc/ | A | なし | 第2バッチ以降で移行 |
| DECO-020 | 大画像+はみ出し白ボックスの特集カード | DECO | 日本ゼトック | indexes/decorations.md、sites/012_zettoc/ | A | なし | 第2バッチ以降で移行 |
| DECO-021 | 番号ページャ付き テキスト×画像 同期スライダ | DECO | ノダRFテクノロジーズ | indexes/decorations.md、sites/013_nrf/ | A | なし | 第2バッチ以降で移行 |
| DECO-022 | 見出しグループ付きドロップダウンナビ | DECO | primeNumber | indexes/decorations.md、sites/015_primenumber/ | A | なし | 第2バッチ以降で移行 |
| DECO-023 | アイコン付き正方ダブルCTA | DECO | Ubie | parts/DECO-023.json、parts/DECO-023.svg、sites/016_ubie/ | A | なし | 第2バッチで移行済み |
| DECO-024 | 対象者タグピル付きサービス交互ブロック | DECO | Ubie | indexes/decorations.md、sites/016_ubie/ | A | なし | 第2バッチ以降で移行 |
| DECO-025 | 複合ピルCTA | DECO | LayerX | indexes/decorations.md、sites/017_layerx/ | A | なし | 第2バッチ以降で移行 |
| LAYOUT-001 | フルブリードヒーロー(左コピー+斜め曲線リボン) | LAYOUT | 日新ネットワークス | parts/LAYOUT-001.json、parts/LAYOUT-001.svg、sites/001_nisshin/ | A | なし | 第2バッチで移行済み |
| LAYOUT-002 | フルブリードヒーロー(コピー中央+左右矢印スライダー) | LAYOUT | 日立 | indexes/layouts.md、sites/002_hitachi/ | A | なし(Notion DB上の名称がLAYOUT-001と同一。内容は別のため移行時に要確認) | 個別確認のうえ次バッチ以降で移行 |
| LAYOUT-003 | テキスト左・画像右セクション | LAYOUT | 岩崎電気 | parts/LAYOUT-003.json、parts/LAYOUT-003.svg、sites/003_iwasaki/ | A | なし | 第2バッチで移行済み |
| LAYOUT-004 | 円形カードナビ+バナー(1セット) | LAYOUT | 福助 | parts/LAYOUT-004.json、parts/LAYOUT-004.svg、sites/004_fukuske/ | A | なし | 第2バッチで移行済み |
| LAYOUT-005 | 中央寄せ製品ヒーロー(ピル型CTA2連+製品画像) | LAYOUT | Apple | parts/LAYOUT-005.json、parts/LAYOUT-005.svg、sites/005_apple/ | A | なし | 第1バッチで移行済み |
| LAYOUT-006 | 角丸カード非対称グリッド | LAYOUT | Apple | parts/LAYOUT-006.json、parts/LAYOUT-006.svg、sites/005_apple/ | A | なし | 第2バッチで移行済み |
| LAYOUT-007 | 情報密度の高い2段ヘッダー | LAYOUT | 安川電機 | indexes/layouts.md、sites/006_yaskawa/ | A | なし | 第2バッチ以降で移行(用途軸の明示的根拠なし。要検討) |
| LAYOUT-008 | 超大型見出しヒーロー | LAYOUT | PROGRIT | indexes/layouts.md、sites/007_progrit/ | A | なし | 第2バッチ以降で移行 |
| LAYOUT-009 | 価値観カードグリッド(3+2中央寄せ) | LAYOUT | PROGRIT | indexes/layouts.md、sites/007_progrit/ | A | なし | 第2バッチ以降で移行 |
| LAYOUT-010 | ダーク中央CONTACT + 大型フッター | LAYOUT | PROGRIT | parts/LAYOUT-010.json、parts/LAYOUT-010.svg、sites/007_progrit/ | A | なし | 第2バッチで移行済み |
| LAYOUT-011 | サービス案内リンクグリッド(見出し+説明の小ブロック多数) | LAYOUT | セブン-イレブン | parts/LAYOUT-011.json、parts/LAYOUT-011.svg、sites/010_seven/ | A | なし | 第1バッチで移行済み |
| LAYOUT-012 | 全画面KV+右下オーバーラップ情報カード | LAYOUT | 幕張ベイパーク耳鼻咽喉科 | indexes/layouts.md、sites/011_makuhari_jibika/ | A | なし | 第2バッチ以降で移行 |
| LAYOUT-013 | コーポレートトップ全体構成(丸ごとテンプレ) | LAYOUT | 日本ゼトック | indexes/layouts.md、sites/012_zettoc/ | A | なし | 第2バッチ以降で移行(全体構成テンプレのため個別検討) |
| LAYOUT-014 | 製造業トップ全体構成(丸ごとテンプレ) | LAYOUT | ノダRFテクノロジーズ | indexes/layouts.md、sites/013_nrf/ | A | なし | 第2バッチ以降で移行(全体構成テンプレのため個別検討) |
| LAYOUT-015 | ダブルCTAブロック付き浮きヘッダ | LAYOUT | Golfcart Vision | parts/LAYOUT-015.json、parts/LAYOUT-015.svg、sites/014_golfcart/ | A | なし | 第2バッチで移行済み |
| LAYOUT-016 | ソリッドカラーヒーロー+ロゴマーキー帯 | LAYOUT | primeNumber | indexes/layouts.md、sites/015_primenumber/ | A | なし | 第2バッチ以降で移行 |
| LAYOUT-017 | 淡グラデヒーロー+対象者別リンク3連バー | LAYOUT | Ubie | indexes/layouts.md、sites/016_ubie/ | A | なし | 第2バッチ以降で移行 |
| LAYOUT-018 | 余白極大タイポヒーロー | LAYOUT | LayerX | indexes/layouts.md、sites/017_layerx/ | A | なし | 第2バッチ以降で移行 |
| PATTERN-001 | ドット(規則正しい水玉) | PATTERN | なし(横断的な柄) | patterns/PATTERN-001.svg、indexes/patterns.md | B | 元サイトURL(schema必須のsite.url)、用途軸の該当語彙 | schema/vocab整備後に移行判断 |
| PATTERN-002 | ストライプ(斜めの細い線) | PATTERN | なし(横断的な柄) | patterns/PATTERN-002.svg、indexes/patterns.md | B | 元サイトURL、用途軸の該当語彙 | schema/vocab整備後に移行判断 |
| PATTERN-003 | グリッド(細い格子) | PATTERN | なし(横断的な柄) | patterns/PATTERN-003.svg、indexes/patterns.md | B | 元サイトURL、用途軸の該当語彙 | schema/vocab整備後に移行判断 |
| PATTERN-004 | 市松(チェッカー) | PATTERN | なし(横断的な柄) | patterns/PATTERN-004.svg、indexes/patterns.md | B | 元サイトURL、用途軸の該当語彙 | schema/vocab整備後に移行判断 |
| PATTERN-005 | 縦ストライプ(垂直の細い線) | PATTERN | なし(横断的な柄) | patterns/PATTERN-005.svg、indexes/patterns.md | B | 元サイトURL、用途軸の該当語彙 | schema/vocab整備後に移行判断 |
| PATTERN-006 | シェブロン(山形のジグザグ) | PATTERN | なし(横断的な柄) | patterns/PATTERN-006.svg、indexes/patterns.md | B | 元サイトURL、用途軸の該当語彙 | schema/vocab整備後に移行判断 |
| PATTERN-007 | プラス(十字マーク) | PATTERN | なし(横断的な柄) | patterns/PATTERN-007.svg、indexes/patterns.md | B | 元サイトURL、用途軸の該当語彙 | schema/vocab整備後に移行判断 |
| PATTERN-008 | 三角(上向き三角の敷き詰め) | PATTERN | なし(横断的な柄) | patterns/PATTERN-008.svg、indexes/patterns.md | B | 元サイトURL、用途軸の該当語彙 | schema/vocab整備後に移行判断 |
| PATTERN-009 | 波線(水平のなみ線) | PATTERN | なし(横断的な柄) | patterns/PATTERN-009.svg、indexes/patterns.md | B | 元サイトURL、用途軸の該当語彙 | schema/vocab整備後に移行判断 |
| PATTERN-010 | 菱形格子(ダイヤの格子) | PATTERN | なし(横断的な柄) | patterns/PATTERN-010.svg、indexes/patterns.md | B | 元サイトURL、用途軸の該当語彙 | schema/vocab整備後に移行判断 |

## 注記

- 一覧の名称は indexes/decorations.md・indexes/layouts.md・indexes/patterns.md の記載に基づく。
- 旧資産（indexes/**、sites/**、patterns/**、catalog.html系）は削除しない。移行はv2ファイルの追加のみで行う。
- Notion正式DB「参考要素倉庫カタログ」のv2属性同期は、各バッチのPRマージ後に実施する。
- DECO-023とLAYOUT-015は旧資料(composition.md)で「golfcartの横長ダブルCTA(LAYOUT-015)のバリエーション」と明記された関係にあるが、ヘッダー内の配置(正方アイコン型/横長テキスト型)とサイト(Ubie/Golfcart Vision)が異なるため、それぞれ別パーツとして第2バッチで移行した。
