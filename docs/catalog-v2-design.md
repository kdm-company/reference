# カタログ v2 設計（1パーツ=1データファイル＋属性＋動的生成）

## 目的

- 追加コストを将来も一定に保つ（大きなファイルの全文書き換えを構造的になくす）
- kind＋部位・用途・業種・テイストで検索できるようにする
- カタログページはデータから生成し、手動貼り付けを廃止する

## 生成方式（動的生成）

- カタログの描画にビルド工程は持たない。**catalog-v2.html を開いたブラウザが parts/manifest.json と各パーツJSONを表示時に取得し、その場でカードを描画する（クライアントサイドの動的生成）**。GitHub Actionsによる静的生成は行っていない（Actionsは後述の自動検証にのみ使用）。
- 対象環境は GitHub Pages（https://kdm-company.github.io/reference/）。file:// 直開きでは動かない。
- **障害分離**: JSONが1件破損・欠損していても該当カードのみ除外し、画面上部にエラー件数と対象IDを表示する。カタログ全体は表示され続ける。
- **並び順の固定**: カードはID昇順。フィルタ選択肢は parts/vocab.json の語彙順（語彙外の値は末尾に文字コード順）。表示のたびに順序が変わることはない。

## 構造

```
parts/                 … 本番データのみ（正式なパーツJSON・SVG・manifest・schema・vocab）
  manifest.json        … 登録パーツIDの配列（目録。ID昇順を維持）
  vocab.json           … 統制語彙（kind・4軸・category）。統制語彙の正本
  parts.schema.json    … パーツJSONのJSON Schema。構造（必須項目・型）の正本
  DECO-0XX.json        … 1パーツ=1データファイル
  DECO-0XX.svg         … ワイヤーフレーム（単体SVG）
tests/
  fixtures/            … 検証専用フィクスチャ（manifest.test.json / TEST-*.json）。本番parts/には置かない
  e2e/catalog.spec.js  … Playwrightブラウザ自動テスト
scripts/validate-catalog.js … 自動検証スクリプト（Node、依存なし）
.github/workflows/validate-catalog.yml   … push / Pull Request時にデータ検証＋ブラウザ自動テスト
.github/workflows/verify-package-lock.yml … push / Pull Request時にpackage-lock.jsonのnpm正規生成結果との一致を検証（検証専用。自動コミット・自動修正は行わない）
package.json / package-lock.json … E2Eテストの依存定義。依存はlockfileで固定し、CIは npm ci を使う
playwright.config.js   … E2Eテスト設定（ローカルHTTPサーバーを自動起動）
catalog-v2.html        … 動的生成ビューア（?manifest= で読込先を差し替え可能）
validate.html          … 整合チェッカー（ブラウザ実行の補助ツール）
docs/catalog-v2-design.md … 本書
```

- git が正。Notion DB は従（従来通り）。
- SVGをJSONに埋めず別ファイルにする理由: エスケープ不要、`<img loading="lazy">` で遅延読み込みでき件数増に耐える。
- **TEST-IDの解決ルール**: TEST- で始まるIDのJSONは tests/fixtures/ から、それ以外は parts/ から読み込む（catalog-v2.html・validate.html・validate-catalog.js 共通）。
- lockfile運用: package-lock.json は `npm install --package-lock-only` で正規生成した内容をそのままコミットする。integrity値を検索・手作業で構築することはしない。GitHub Actions（.github/workflows/verify-package-lock.yml）が正規生成結果と現在のpackage-lock.jsonの差分を自動検証する。依存を変更する場合は package.json 更新後、`npm install --package-lock-only` で package-lock.json を再生成し、検証PASSを確認してから反映すること。

## 役割分担（二重管理しない）

| ファイル | 管理するもの |
|---|---|
| parts/parts.schema.json | 構造：必須項目・型・ID形式 |
| parts/vocab.json | 属性語彙：kind・category・部位・用途・業種・テイストの許可値 |

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

## kind（種別）

許可値は以下の6種のみ。

| 値 | 意味 |
|---|---|
| layout | ページ骨格の分割方法 |
| section | 1セクションの構成 |
| component | 単一部品（ボタン、カード等） |
| style | 装飾・タイポグラフィ等の様式 |
| background | 背景表現 |
| page | 複数部位にまたがる1ページ分の型 |

## 統制語彙

**統制語彙の正本は parts/vocab.json**。以下はその写し。新しい値が必要な場合は vocab.json に追加してから使う。

| 軸 | 許可値 |
|---|---|
| 部位 (part) | ヘッダー / ナビ / ヒーロー / コンテンツセクション / CTA / フォーム / フッター / ページ全体（この8語のみ） |
| 用途 (use) | トップページ / 会社概要 / 沿革 / 代表挨拶 / 実績 / お客様の声 / 料金表 / FAQ / 相談の流れ / お知らせ / ブランド訴求 / 問い合わせ |
| 業種 (industry) | 汎用 / 士業 / 製造 / 医療 / IT / 政治家 / 寺社・観光 / 旅館 / 老舗 |
| テイスト (taste) | ミニマル / コーポレート / 上質 / 和風 / 親しみ / 先進 / 余白極大 / 端正 |

部位は**物理的な場所のみ**を表す。会社概要・沿革・料金表・FAQ等の内容分類は「用途」で管理する。範囲が広すぎる語は許可語彙に含めない。

## 検証（3層）

### 正式ゲート1: GitHub Actionsによるデータ検証

parts/・tests/・検証スクリプト等へのpush / Pull Request時に `scripts/validate-catalog.js` が自動実行される。push と pull_request の対象パスは同一（parts/**・catalog-v2.html・validate.html・scripts/**・tests/**・playwright.config.js・package.json・package-lock.json・ワークフロー自身）。検出項目:

1. JSON構文エラー
2. 必須項目の欠落（下位キー含む）
3. ID重複
4. JSON内IDとファイル名の不一致
5. manifestにあるJSONの欠損
6. JSONは存在するがmanifestにない状態（TEST-*とシステムファイルは対象外）
7. kindの許可値違反
8. 部位・用途・業種・テイストの統制語彙違反（category含む）
9. skeleton / composition / SVG の内部リンク切れ（**FAIL**）
10. manifestの並び順の不整合（ID昇順でなければFAIL）

外部リンク（元サイトURL）はHEADを拒否するサイトがあるため、HEAD→GETのフォールバックで確認し、到達不能でも**FAILではなくWARNING**とする。

ログは `FAIL [チェック名] id=対象ID file=ファイル名 : 理由` 形式で出力する。

- 本番manifest（parts/manifest.json）は終了コード0を要求する。
- テストフィクスチャ（tests/fixtures/manifest.test.json）は**終了コード1が期待結果**。正しく拒否されればステップはPASSとし、意図的なテストデータでワークフロー全体を赤にしない。

### 正式ゲート2: GitHub ActionsによるブラウザE2Eテスト（Playwright）

`tests/e2e/catalog.spec.js` をCI上のChromiumで実行し、初期表示・ID順固定・4軸フィルター・キーワード検索・内部リンク・スマートフォン幅・障害分離（1件破損時の表示とエラー件数/ID表示）・未定義語彙検出を確認する。依存は package-lock.json で固定し、CIでは `npm ci` でインストールする。

### 補助: validate.html（ブラウザ実行）

手元で即座に確認したいときの補助ツール。判定の正はGitHub Actions。

- 通常チェック: `validate.html`
- テストデータでのチェック: `validate.html?manifest=tests/fixtures/manifest.test.json`

## 追加手順（v2でのSTEP4以降）

**新規パーツは自動検証を通過してからmanifestへの追加を確定させる。**

1. 使う属性値が vocab.json にあるか確認。なければ vocab.json に先に追加
2. `parts/DECO-0XX.json` と `parts/DECO-0XX.svg` を新規作成
3. `parts/manifest.json` にIDを追記（ID昇順を維持）
4. 1〜3をpushするとGitHub Actionsの自動検証が実行される。**PASSを確認してから次へ進む**（FAILの場合は即修正。Pull Request経由なら検証通過後にmainへ反映でき、より安全）
5. Notion DBに行追加（従来通り）
6. catalog-v2.html は自動反映（編集不要）

## 移行計画（既存は一括変更しない）

1. **検証期（完了）**: パイロット2件（DECO-032, 033）＋テストフィクスチャで検証。既存ファイルは一切変更しない。
2. **並行期（現在稼働中）**: DECO-026〜033の8件がv2形式で稼働中（parts/manifest.jsonにID昇順で登録）。catalog.html / catalog-live.html はそのまま残す。新規パーツは今後もv2形式で追加する。
3. **統合期（未着手）**: 既存001〜025をClaude Codeで一度だけv2形式に変換（属性付与込み）。以降 catalog-v2.html を正とし、旧catalog.htmlはアーカイブ扱い。

## 検証項目

- [x] 初期表示で8件とも表示される（ID昇順で固定：DECO-026〜033）
- [x] 4軸フィルターが動く
- [x] キーワード検索が動く
- [x] 各リンク（骨格HTML・構図メモ・元サイト）が開く
- [x] スマートフォン幅で操作できる
- [x] JSONが1件壊れていても他のカードが表示され、エラー件数とIDが出る（tests/fixtures/manifest.test.jsonで確認）
- [x] 未定義語彙が検出される
- [x] GitHub Actionsの本番manifest検証がPASSする
- [x] テストフィクスチャは終了コード1で拒否され、ワークフロー全体はPASS（緑）になる
