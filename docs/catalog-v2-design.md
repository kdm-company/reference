# カタログ v2 設計（1パーツ=1データファイル＋属性＋動的生成）

## 目的

- 追加コストを将来も一定に保つ（大きなファイルの全文書き換えを構造的になくす）
- kind＋部位・用途・業種・テイストで検索できるようにする
- カタログページはデータから生成し、手動貼り付けを廃止する

## 生成方式（動的生成）

- ビルド工程は持たない。**catalog-v2.html を開いたブラウザが parts/manifest.json と各パーツJSONを表示時に取得し、その場でカードを描画する（クライアントサイドの動的生成）**。GitHub Actions等による静的生成は行っていない。
- 対象環境は GitHub Pages（https://kdm-company.github.io/reference/）。file:// 直開きでは動かない。
- **障害分離**: JSONが1件破損・欠損していても該当カードのみ除外し、画面上部にエラー件数と対象IDを表示する。カタログ全体は表示され続ける。
- **並び順の固定**: カードはID昇順。フィルタ選択肢は parts/vocab.json の語彙順（語彙外の値は末尾に文字コード順）。表示のたびに順序が変わることはない。

## 構造

```
parts/
  manifest.json        … 登録パーツIDの配列（目録）
  vocab.json           … 統制語彙（kind・4軸・category）※語彙の正はこのファイル
  parts.schema.json    … パーツJSONのJSON Schema（構造の正はこのファイル）
  DECO-0XX.json        … 1パーツ=1データファイル
  DECO-0XX.svg         … ワイヤーフレーム（単体SVG）
  manifest.test.json / TEST-*.json … 検証用フィクスチャ（正式運用開始時に削除可）
catalog-v2.html        … 動的生成ビューア（?manifest= で読込先を差し替え可能）
validate.html          … 整合チェッカー（ブラウザ実行）
docs/catalog-v2-design.md … 本書
```

- git が正。Notion DB は従（従来通り）。
- SVGをJSONに埋めず別ファイルにする理由: エスケープ不要、`<img loading="lazy">` で遅延読み込みでき件数増に耐える。

## パーツJSONスキーマ

```json
{
  "id": "DECO-033",
  "name": "パーツ名",
  "category": "LAYOUT | DECO | PATTERN",
  "kind": "layout | section | component | style | background | page",
  "site": { "no": "025", "name": "参照サイト名", "url": "元サイトURL" },
  "attrs": {
    "part": ["部位"],
    "use": ["用途"],
    "industry": ["業種"],
    "taste": ["テイスト"]
  },
  "tags": ["#既存形式の形タグ"],
  "desc": "構造の要約（1〜2文）",
  "links": {
    "skeleton": "sites/NNN_x/skeleton.html",
    "composition": "sites/NNN_x/composition.md"
  },
  "svg": "parts/DECO-033.svg"
}
```

構造の必須項目・型は parts/parts.schema.json が正。属性値の許可語彙は parts/vocab.json が正（二重管理しない）。

## kind（種別）

| 値 | 意味 |
|---|---|
| layout | ページ骨格の分割方法 |
| section | 1セクションの構成 |
| component | 単一部品（ボタン、カード等） |
| style | 装飾・タイポグラフィ等の様式 |
| background | 背景表現 |
| page | 複数部位にまたがる1ページ分の型 |

## 統制語彙（vocab.json の内容）

新しい値が必要な場合は vocab.json に追加してから使う（野放図な増殖を防ぐ）。

| 軸 | 候補 |
|---|---|
| 部位 (part) | ヘッダー / ナビ / ヒーロー / コンテンツセクション / CTA / フォーム / フッター / ページ全体 |
| 用途 (use) | トップページ / 会社概要 / 沿革 / 代表挨拶 / 実績 / お客様の声 / 料金表 / FAQ / 相談の流れ / お知らせ / ブランド訴求 / 問い合わせ |
| 業種 (industry) | 汎用 / 士業 / 製造 / 医療 / IT / 政治家 / 寺社・観光 / 旅館 / 老舗 |
| テイスト (taste) | ミニマル / コーポレート / 上質 / 和風 / 親しみ / 先進 / 余白極大 / 端正 |

注意: 部位は**物理的な場所のみ**を表す。会社概要・沿革・料金表・FAQ等の内容分類は「用途」で管理する。「メイン」「サイド」は範囲が広すぎるため廃止した。

## 検証（validate.html）

ブラウザで開くと以下を自動チェックし、PASS/FAILを一覧表示する。

1. 必須項目の欠落（id/name/category/kind/site/attrs/desc/links/svg、下位キー含む）
2. manifest内のID重複
3. manifestにあるJSONの欠損・破損
4. JSONは存在するがmanifestにない状態（GitHub APIでparts/を一覧して比較）
5. 統制語彙にない属性値（kind・category・4軸）
6. skeleton / composition / SVG のリンク切れ（HEADリクエスト）

使い方:
- 通常チェック: `validate.html`
- テストデータでのチェック: `validate.html?manifest=parts/manifest.test.json`

制約: 項目4はGitHub APIの未認証枠（60回/時）を使う。上限超過時はその項目のみスキップ表示。

## 追加手順（v2でのSTEP4以降）

1. 使う属性値が vocab.json にあるか確認。なければ vocab.json に追加してpush
2. `parts/DECO-0XX.json` と `parts/DECO-0XX.svg` を新規作成してpush
3. `parts/manifest.json` にIDを1行追記
4. `validate.html` でPASSを確認
5. Notion DBに行追加（従来通り）
6. catalog-v2.html は自動反映（編集不要）

## 移行計画（既存は一括変更しない）

1. **検証期（今）**: パイロット2件（DECO-032, 033）＋テストフィクスチャで検証。既存ファイルは一切変更しない。
2. **並行期**: 新規パーツはv2形式で追加。DECO-026〜031をv2に変換。catalog.html / catalog-live.html はそのまま残す。
3. **統合期**: 既存001〜025をClaude Codeで一度だけv2形式に変換（属性付与込み）。以降 catalog-v2.html を正とし、旧catalog.htmlはアーカイブ扱い。

## 検証項目

- [ ] 初期表示で2件とも表示される
- [ ] 4軸フィルターが動く
- [ ] キーワード検索が動く
- [ ] 各リンク（骨格HTML・構図メモ・元サイト）が開く
- [ ] スマートフォン幅で操作できる
- [ ] JSONが1件壊れていても他のカードが表示され、エラー件数とIDが出る（manifest.test.jsonで確認）
- [ ] 未定義語彙が validate.html で検出される
