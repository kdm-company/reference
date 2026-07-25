# 旧カタログ資産のv2移行状況

最終更新: 2026-07-26（PATTERN-001〜010・DECO-005 内部制作資産バッチPR時点）

## 集計

- 対象旧資産: 51件（DECO 23 / LAYOUT 18 / PATTERN 10。DECO-001・DECO-007は欠番のため、想定50件と1件差）
- A. そのままv2移行可能: 35件
- B. 最小限の後方互換拡張により移行済み: 11件（DECO-005、PATTERN-001〜010。本バッチで`docs/internal-pattern-assets-policy.md`を新設し、schema/vocab/validator/catalog-v2/testsを最小限拡張したうえで移行）
- C. 重複・統合候補: 0件
- D. 旧版として維持: 5件（DECO-004 / DECO-006 / DECO-008 / DECO-009 / LAYOUT-007。個別確認の結果、用途属性を裏付ける明示的根拠が旧資料になく、vocabのuse語彙で正確に表現できないため）
- 未判定: 0件
- 情報不足: 0件（本バッチでB. 11件の情報不足状態を解消）
- 第1バッチ移行済み: 5件（DECO-003 / DECO-011 / DECO-014 / LAYOUT-005 / LAYOUT-011）
- 第2バッチ移行済み: 10件（DECO-002 / DECO-010 / DECO-013 / DECO-023 / LAYOUT-001 / LAYOUT-003 / LAYOUT-004 / LAYOUT-006 / LAYOUT-010 / LAYOUT-015）
- 第3バッチ移行済み: 10件（DECO-012 / DECO-015 / DECO-019 / DECO-020 / DECO-021 / LAYOUT-008 / LAYOUT-012 / LAYOUT-016 / LAYOUT-017 / LAYOUT-018）
- 第4バッチ移行済み: 9件（DECO-016 / DECO-017 / DECO-018 / DECO-022 / DECO-024 / DECO-025 / LAYOUT-009 / LAYOUT-013 / LAYOUT-014）
- 個別確認バッチ移行済み: 1件（LAYOUT-002。Notion側の名称誤記〈LAYOUT-001と同一の「トップビュー」〉をGitHub側の一貫した記述に基づき「フルブリードヒーロー(コピー中央+左右矢印スライダー)」へ訂正したうえで移行）
- 内部制作資産バッチ移行済み: 11件（DECO-005＝外部参照資産・用途語彙「背景装飾」追加のみで移行／PATTERN-001〜010＝内部制作資産・`sourceType: "internal"`と`internalSource`を追加して移行）
- v2移行済み合計(本ドキュメント対象の旧資産51件のうち): 46件
- 分類A(移行可能)のうち、未移行残り: 0件
- 分類B(情報不足)のうち、未移行残り: 0件（本バッチで11件すべて解消）
- 参考: parts/manifest.json 全体は55件（本ドキュメントの対象外である DECO-026〜034 の9件〈旧資産51件のカウント外・既存v2ネイティブパーツ〉を含む）

## 分類基準の解釈

- `sites/<サイト>/skeleton.html` は実サイトから採取した構造資料であり、そこからのSVG作図はDECO-026〜034で確立済みのv2方式と同じ扱いとする（「推測でSVGを作る」には当たらない）。
- 第2バッチでは、`vocab.json`の`use`語彙に一致する明示的な用途記述が旧資料(indexes/*.md・composition.md)に直接存在する資産のみを対象とした。ヘッダー・フッター等のサイト全体UIチュームで、旧資料に用途軸を裏付ける明示的な記述がないもの（DECO-004固定ヘッダー、DECO-006フッター、DECO-008/DECO-009、LAYOUT-007の2段ヘッダー）は、属性を推測で埋めることになるため見送り、分類Aの未移行のまま残した。
- 第3バッチでは、未移行の分類A・25件を「現行schemaでの移行候補集合(Notion正式DB − manifest − 情報不足11件)」として機械的に再計算した。その結果、LAYOUT-002は25件の内数であり別枠の追加1件ではないことを確認した。あわせて、DECO-004・006・008・009・LAYOUT-007（用途属性の明示的根拠が不足）とLAYOUT-002（Notion名称がLAYOUT-001と重複し個別確認が必要）の6件を「A(個別確認が必要)」として区別し、残り19件を「高確度で移行可能」として整理した。
- 第4バッチでは、単体では用途軸の直接記述がないナビ・コンテンツセクション(DECO-017・018・022・024)およびヘッダーCTA(DECO-025)について、同一sites/<サイト>/composition.mdが対象範囲として明示する同一ページ文脈を共有し、かつ同一composition内の既存v2パーツ(LAYOUT-012・016・017・018等)がすでに用途「トップページ」で移行済みであることを根拠に、用途「トップページ」を設定した(第2〜3バッチで確立した方法論と同一)。LAYOUT-013・014はcomposition.mdの見出しが「トップページ全体テンプレ(形のみ)」と明記しているため、既存の layout/component/style/background とは区別し、kind=page(ページ全体)として丸ごとテンプレを新設した。
- 個別確認バッチでは、残る6件を1件ずつ、indexes/**・sites/**/skeleton.html・sites/**/skeleton.src.html・sites/**/composition.md・catalog.html・catalog.src.htmlの全資料とNotion正式DBを突き合わせて確認した。LAYOUT-002は名称を訂正して移行、DECO-004・006・008・009・LAYOUT-007は用途軸の明示的根拠が旧資料にないため旧資産として維持(分類D)に確定した。
- 内部制作資産バッチ（本更新）では、残るB(情報不足)11件を対象に、`docs/internal-pattern-assets-policy.md`で「外部参照資産／内部制作資産」の区分を新設した。PATTERN-001〜010は元サイトが存在しない横断的な柄素材であり、`sourceType: "internal"`と`internalSource`（正本: `patterns/PATTERN-XXX.svg`）を設定して移行した。DECO-005は元サイトURL(`https://www.iwasaki.co.jp/`)が既に存在する外部参照資産であり、障壁は(1)SVG原本がなくCSSが正本である点、(2)用途語彙の不足の2点のみだったため、`sites/003_iwasaki/skeleton.html`の`.dark::before`のCSS値(top:-10%/left:18%/幅60%/高さ70%/3段階のrgbaグラデーション)から決定的にプレビューSVGを新規作成し、`vocab.json`の`use`語彙に「背景装飾」を追加して移行した。属性は11件とも、部位・業種・テイストを実体（形状・色・雰囲気）から個別に判断し、カテゴリ名(PATTERN)だけを理由に同一属性を設定することはしなかった。

## 一覧

| ID | 名称 | 旧カテゴリ | 元サイト | 既存ファイル | 分類 | 不足情報 | 推奨 |
|---|---|---|---|---|---|---|---|
| DECO-002 | カード重ねオフセット | DECO | 日立 | parts/DECO-002.json、parts/DECO-002.svg、sites/002_hitachi/ | A | なし | 第2バッチで移行済み |
| DECO-003 | 見出しの型(英語ラベル+和文見出し+短下線) | DECO | 岩崎電気 | parts/DECO-003.json、parts/DECO-003.svg、sites/003_iwasaki/ | A | なし | 第1バッチで移行済み |
| DECO-004 | 固定ヘッダー(スクロール表示・言語トグル+検索併設) | DECO | 岩崎電気 | indexes/decorations.md、sites/003_iwasaki/ | D | 用途軸を裏付ける明示的根拠なし(個別確認済み) | 個別確認の結果、旧資産として維持。サイト全体共通の固定ヘッダーで、composition.md/indexes/decorations.mdに用途(ページ文脈)の明示的記述がなく、vocabのuse語彙で根拠をもって設定できない。再検討条件: 用途を明示する追加資料が見つかった場合 |
| DECO-005 | 放射状グロー背景(003 岩崎電気) | DECO(柄扱いでpatterns.mdへ移動済み) | 岩崎電気 | indexes/patterns.md、sites/003_iwasaki/、parts/DECO-005.json、parts/DECO-005.svg | B | なし(本バッチで解消。用途語彙「背景装飾」追加とCSS由来のプレビューSVG作成により移行) | 内部制作資産バッチで外部参照資産として移行済み(sourceType追加なし。site.urlは既存の岩崎電気URLを維持) |
| DECO-006 | フッター(濃色中央寄せ縦積み) | DECO | 福助 | indexes/decorations.md、sites/004_fukuske/ | D | 用途軸を裏付ける明示的根拠なし(個別確認済み) | 個別確認の結果、旧資産として維持。サイト全体共通のフッターで、用途(ページ文脈)の明示的根拠が旧資料にない。再検討条件: 用途を明示する追加資料が見つかった場合 |
| DECO-008 | 2カラム関連情報カード | DECO | Apple | indexes/decorations.md、sites/005_apple/ | D | 用途軸を裏付ける明示的根拠なし(個別確認済み) | 個別確認の結果、旧資産として維持。「サポート導線の並列紹介」という用途がvocabのuse語彙のいずれにも該当しない。再検討条件: vocab整備、または用途を明示する追加資料が見つかった場合 |
| DECO-009 | ピル型セグメントタブ | DECO | Apple | indexes/decorations.md、sites/005_apple/ | D | 用途軸を裏付ける明示的根拠なし(個別確認済み) | 個別確認の結果、旧資産として維持。「製品カテゴリのフィルター切替」という用途がvocabのuse語彙のいずれにも該当しない。再検討条件: vocab整備、または用途を明示する追加資料が見つかった場合 |
| DECO-010 | スライダー型ヒーロー | DECO | 安川電機 | parts/DECO-010.json、parts/DECO-010.svg、sites/006_yaskawa/ | A | なし | 第2バッチで移行済み |
| DECO-011 | ニュース行リスト(日付+カラーラベル+タイトル) | DECO | 安川電機 | parts/DECO-011.json、parts/DECO-011.svg、sites/006_yaskawa/ | A | なし | 第1バッチで移行済み |
| DECO-012 | 浮き立体カードのサービス紹介 | DECO | PROGRIT | parts/DECO-012.json、parts/DECO-012.svg、sites/007_progrit/ | A | なし | 第3バッチで移行済み |
| DECO-013 | 人物はみ出しメッセージカード | DECO | PROGRIT | parts/DECO-013.json、parts/DECO-013.svg、sites/007_progrit/ | A | なし | 第2バッチで移行済み |
| DECO-014 | 問い合わせ案内ブロック(見出し→主CTA→電話→補足) | DECO | ビズリーチ | parts/DECO-014.json、parts/DECO-014.svg、sites/008_bizreach/ | A | なし | 第1バッチで移行済み |
| DECO-015 | 見出し+リード訴求ブロック | DECO | 京都きもの学院 | parts/DECO-015.json、parts/DECO-015.svg、sites/009_kyoto_kimono/ | A | なし | 第3バッチで移行済み |
| DECO-016 | 取組み紹介カード横並び | DECO | セブン-イレブン | parts/DECO-016.json、parts/DECO-016.svg、sites/010_seven/ | A | なし | 第4バッチで移行済み |
| DECO-017 | 画像カード付きフルワイドメガメニュー | DECO | 幕張ベイパーク耳鼻咽喉科 | parts/DECO-017.json、parts/DECO-017.svg、sites/011_makuhari_jibika/ | A | なし | 第4バッチで移行済み |
| DECO-018 | 正方形リンクパネル横並び | DECO | 幕張ベイパーク耳鼻咽喉科 | parts/DECO-018.json、parts/DECO-018.svg、sites/011_makuhari_jibika/ | A | なし | 第4バッチで移行済み |
| DECO-019 | 番号バッジ付き画像カード3連 | DECO | 日本ゼトック | parts/DECO-019.json、parts/DECO-019.svg、sites/012_zettoc/ | A | なし | 第3バッチで移行済み |
| DECO-020 | 大画像+はみ出し白ボックスの特集カード | DECO | 日本ゼトック | parts/DECO-020.json、parts/DECO-020.svg、sites/012_zettoc/ | A | なし | 第3バッチで移行済み |
| DECO-021 | 番号ページャ付き テキスト×画像 同期スライダ | DECO | ノダRFテクノロジーズ | parts/DECO-021.json、parts/DECO-021.svg、sites/013_nrf/ | A | なし | 第3バッチで移行済み |
| DECO-022 | 見出しグループ付きドロップダウンナビ | DECO | primeNumber | parts/DECO-022.json、parts/DECO-022.svg、sites/015_primenumber/ | A | なし | 第4バッチで移行済み |
| DECO-023 | アイコン付き正方ダブルCTA | DECO | Ubie | parts/DECO-023.json、parts/DECO-023.svg、sites/016_ubie/ | A | なし | 第2バッチで移行済み |
| DECO-024 | 対象者タグピル付きサービス交互ブロック | DECO | Ubie | parts/DECO-024.json、parts/DECO-024.svg、sites/016_ubie/ | A | なし | 第4バッチで移行済み |
| DECO-025 | 複合ピルCTA | DECO | LayerX | parts/DECO-025.json、parts/DECO-025.svg、sites/017_layerx/ | A | なし | 第4バッチで移行済み |
| LAYOUT-001 | フルブリードヒーロー(左コピー+斜め曲線リボン) | LAYOUT | 日新ネットワークス | parts/LAYOUT-001.json、parts/LAYOUT-001.svg、sites/001_nisshin/ | A | なし | 第2バッチで移行済み |
| LAYOUT-002 | フルブリードヒーロー(コピー中央+左右矢印スライダー) | LAYOUT | 日立 | parts/LAYOUT-002.json、parts/LAYOUT-002.svg、sites/002_hitachi/ | A | なし | 個別確認により移行済み(Notion名称を「トップビュー」→「フルブリードヒーロー(コピー中央+左右矢印スライダー)」に訂正) |
| LAYOUT-003 | テキスト左・画像右セクション | LAYOUT | 岩崎電気 | parts/LAYOUT-003.json、parts/LAYOUT-003.svg、sites/003_iwasaki/ | A | なし | 第2バッチで移行済み |
| LAYOUT-004 | 円形カードナビ+バナー(1セット) | LAYOUT | 福助 | parts/LAYOUT-004.json、parts/LAYOUT-004.svg、sites/004_fukuske/ | A | なし | 第2バッチで移行済み |
| LAYOUT-005 | 中央寄せ製品ヒーロー(ピル型CTA2連+製品画像) | LAYOUT | Apple | parts/LAYOUT-005.json、parts/LAYOUT-005.svg、sites/005_apple/ | A | なし | 第1バッチで移行済み |
| LAYOUT-006 | 角丸カード非対称グリッド | LAYOUT | Apple | parts/LAYOUT-006.json、parts/LAYOUT-006.svg、sites/005_apple/ | A | なし | 第2バッチで移行済み |
| LAYOUT-007 | 情報密度の高い2段ヘッダー | LAYOUT | 安川電機 | indexes/layouts.md、sites/006_yaskawa/ | D | 用途軸を裏付ける明示的根拠なし(個別確認済み) | 個別確認の結果、旧資産として維持。サイト全体共通の2段ヘッダーで、用途(ページ文脈)の明示的根拠が旧資料にない。再検討条件: 用途を明示する追加資料が見つかった場合 |
| LAYOUT-008 | 超大型見出しヒーロー | LAYOUT | PROGRIT | parts/LAYOUT-008.json、parts/LAYOUT-008.svg、sites/007_progrit/ | A | なし | 第3バッチで移行済み |
| LAYOUT-009 | 価値観カードグリッド(3+2中央寄せ) | LAYOUT | PROGRIT | parts/LAYOUT-009.json、parts/LAYOUT-009.svg、sites/007_progrit/ | A | なし | 第4バッチで移行済み |
| LAYOUT-010 | ダーク中央CONTACT + 大型フッター | LAYOUT | PROGRIT | parts/LAYOUT-010.json、parts/LAYOUT-010.svg、sites/007_progrit/ | A | なし | 第2バッチで移行済み |
| LAYOUT-011 | サービス案内リンクグリッド(見出し+説明の小ブロック多数) | LAYOUT | セブン-イレブン | parts/LAYOUT-011.json、parts/LAYOUT-011.svg、sites/010_seven/ | A | なし | 第1バッチで移行済み |
| LAYOUT-012 | 全画面KV+右下オーバーラップ情報カード | LAYOUT | 幕張ベイパーク耳鼻咽喉科 | parts/LAYOUT-012.json、parts/LAYOUT-012.svg、sites/011_makuhari_jibika/ | A | なし | 第3バッチで移行済み |
| LAYOUT-013 | コーポレートトップ全体構成(丸ごとテンプレ) | LAYOUT | 日本ゼトック | parts/LAYOUT-013.json、parts/LAYOUT-013.svg、sites/012_zettoc/ | A | なし | 第4バッチで移行済み |
| LAYOUT-014 | 製造業トップ全体構成(丸ごとテンプレ) | LAYOUT | ノダRFテクノロジーズ | parts/LAYOUT-014.json、parts/LAYOUT-014.svg、sites/013_nrf/ | A | なし | 第4バッチで移行済み |
| LAYOUT-015 | ダブルCTAブロック付き浮きヘッダ | LAYOUT | Golfcart Vision | parts/LAYOUT-015.json、parts/LAYOUT-015.svg、sites/014_golfcart/ | A | なし | 第2バッチで移行済み |
| LAYOUT-016 | ソリッドカラーヒーロー+ロゴマーキー帯 | LAYOUT | primeNumber | parts/LAYOUT-016.json、parts/LAYOUT-016.svg、sites/015_primenumber/ | A | なし | 第3バッチで移行済み |
| LAYOUT-017 | 淡グラデヒーロー+対象者別リンク3連バー | LAYOUT | Ubie | parts/LAYOUT-017.json、parts/LAYOUT-017.svg、sites/016_ubie/ | A | なし | 第3バッチで移行済み |
| LAYOUT-018 | 余白極大タイポヒーロー | LAYOUT | LayerX | parts/LAYOUT-018.json、parts/LAYOUT-018.svg、sites/017_layerx/ | A | なし | 第3バッチで移行済み |
| PATTERN-001 | ドット(規則正しい水玉) | PATTERN | なし(KDM内部制作) | patterns/PATTERN-001.svg、indexes/patterns.md、parts/PATTERN-001.json、parts/PATTERN-001.svg | B | なし(本バッチで解消。sourceType=internal・internalSource追加により移行) | 内部制作資産バッチで内部制作資産として移行済み |
| PATTERN-002 | ストライプ(斜めの細い線) | PATTERN | なし(KDM内部制作) | patterns/PATTERN-002.svg、indexes/patterns.md、parts/PATTERN-002.json、parts/PATTERN-002.svg | B | なし(本バッチで解消) | 内部制作資産バッチで内部制作資産として移行済み |
| PATTERN-003 | グリッド(細い格子) | PATTERN | なし(KDM内部制作) | patterns/PATTERN-003.svg、indexes/patterns.md、parts/PATTERN-003.json、parts/PATTERN-003.svg | B | なし(本バッチで解消) | 内部制作資産バッチで内部制作資産として移行済み |
| PATTERN-004 | 市松(チェッカー) | PATTERN | なし(KDM内部制作) | patterns/PATTERN-004.svg、indexes/patterns.md、parts/PATTERN-004.json、parts/PATTERN-004.svg | B | なし(本バッチで解消) | 内部制作資産バッチで内部制作資産として移行済み |
| PATTERN-005 | 縦ストライプ(垂直の細い線) | PATTERN | なし(KDM内部制作) | patterns/PATTERN-005.svg、indexes/patterns.md、parts/PATTERN-005.json、parts/PATTERN-005.svg | B | なし(本バッチで解消) | 内部制作資産バッチで内部制作資産として移行済み |
| PATTERN-006 | シェブロン(山形のジグザグ) | PATTERN | なし(KDM内部制作) | patterns/PATTERN-006.svg、indexes/patterns.md、parts/PATTERN-006.json、parts/PATTERN-006.svg | B | なし(本バッチで解消) | 内部制作資産バッチで内部制作資産として移行済み |
| PATTERN-007 | プラス(十字マーク) | PATTERN | なし(KDM内部制作) | patterns/PATTERN-007.svg、indexes/patterns.md、parts/PATTERN-007.json、parts/PATTERN-007.svg | B | なし(本バッチで解消) | 内部制作資産バッチで内部制作資産として移行済み |
| PATTERN-008 | 三角(上向き三角の敷き詰め) | PATTERN | なし(KDM内部制作) | patterns/PATTERN-008.svg、indexes/patterns.md、parts/PATTERN-008.json、parts/PATTERN-008.svg | B | なし(本バッチで解消) | 内部制作資産バッチで内部制作資産として移行済み |
| PATTERN-009 | 波線(水平のなみ線) | PATTERN | なし(KDM内部制作) | patterns/PATTERN-009.svg、indexes/patterns.md、parts/PATTERN-009.json、parts/PATTERN-009.svg | B | なし(本バッチで解消) | 内部制作資産バッチで内部制作資産として移行済み |
| PATTERN-010 | 菱形格子(ダイヤの格子) | PATTERN | なし(KDM内部制作) | patterns/PATTERN-010.svg、indexes/patterns.md、parts/PATTERN-010.json、parts/PATTERN-010.svg | B | なし(本バッチで解消) | 内部制作資産バッチで内部制作資産として移行済み |

## 注記

- 一覧の名称は indexes/decorations.md・indexes/layouts.md・indexes/patterns.md の記載、および個別確認バッチで訂正したLAYOUT-002の正式名称に基づく。
- 旧資産（indexes/**、sites/**、patterns/**、catalog.html系）は削除しない。移行はv2ファイルの追加のみで行う。
- Notion正式DB「参考要素倉庫カタログ」のv2属性同期は、各バッチのPRマージ後に実施する。
- DECO-023とLAYOUT-015は旧資料(composition.md)で「golfcartの横長ダブルCTA(LAYOUT-015)のバリエーション」と明記された関係にあるが、ヘッダー内の配置(正方アイコン型/横長テキスト型)とサイト(Ubie/Golfcart Vision)が異なるため、それぞれ別パーツとして第2バッチで移行した。
- 第3バッチでは、DECO-004・006・008・009・LAYOUT-002・007の6件を「A(個別確認が必要)」に区分した。個別確認バッチでこの6件すべてに最終判定を行い、LAYOUT-002は分類Aのまま名称訂正のうえ移行、残り5件(DECO-004・006・008・009・LAYOUT-007)は分類D(旧版として維持)に確定した。
- 第4バッチにより、高確度で移行可能と分類されていた9件(DECO-016・017・018・022・024・025、LAYOUT-009・013・014)の移行が完了した。
- 個別確認バッチにより、分類Aの個別確認対象6件すべての最終判定が確定し、「個別確認が必要」という中間状態の資産はなくなった。DECO-004・006・008・009・LAYOUT-007は根拠不足のため旧資産として維持し、v2属性は設定していない。
- 内部制作資産バッチ（本更新）により、残っていた分類B(情報不足)11件（PATTERN-001〜010、DECO-005）すべての最終判定が確定した。`docs/internal-pattern-assets-policy.md`で外部参照資産／内部制作資産の区分を新設し、`parts.schema.json`・`parts/vocab.json`・`scripts/validate-catalog.js`・`catalog-v2.html`・`tests/**`を後方互換のまま最小限拡張したうえで、11件全件をv2へ移行した。既存44件のJSON・SVG・schemaの検証結果は変更していない。
