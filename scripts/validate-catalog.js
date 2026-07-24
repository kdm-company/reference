#!/usr/bin/env node
/**
 * カタログ v2 自動検証
 * 使い方: node scripts/validate-catalog.js [manifestPath]
 *   例: node scripts/validate-catalog.js parts/manifest.json                （本番）
 *   例: node scripts/validate-catalog.js tests/fixtures/manifest.test.json  （テスト用フィクスチャ。終了コード1が期待結果）
 * 終了コード: FAILが1件以上なら1、なければ0（WARNは0のまま）
 * ログ形式: FAIL [チェック名] id=対象ID file=ファイル名 : 理由
 * TEST-で始まるIDのJSONは tests/fixtures/ から、それ以外は parts/ から読み込む。
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PARTS_DIR = path.join(ROOT, "parts");
const manifestPath = process.argv[2] || "parts/manifest.json";
const RESERVED = ["manifest.json", "manifest.test.json", "vocab.json", "parts.schema.json"];
const TEST_PREFIX = "TEST-";
const FIXTURES_DIR = "tests/fixtures";
const partFile = (id) => (String(id).startsWith(TEST_PREFIX) ? `${FIXTURES_DIR}/${id}.json` : `parts/${id}.json`);
const REQUIRED_TOP = ["id", "name", "category", "kind", "site", "attrs", "desc", "links", "svg"];
const AXES = { part: "部位", use: "用途", industry: "業種", taste: "テイスト" };

let failCount = 0;
let warnCount = 0;
const fail = (check, id, file, reason) => { failCount++; console.log(`FAIL [${check}] id=${id} file=${file} : ${reason}`); };
const warn = (check, id, file, reason) => { warnCount++; console.log(`WARN [${check}] id=${id} file=${file} : ${reason}`); };
const pass = (check) => console.log(`PASS [${check}]`);

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

async function checkExternal(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 10000);
      const r = await fetch(url, { method, redirect: "follow", signal: ctl.signal });
      clearTimeout(t);
      if (r.ok) return true;
    } catch (e) { /* 次のmethodへフォールバック */ }
  }
  return false;
}

function finish() {
  console.log(`\n結果: FAIL ${failCount}件 / WARN ${warnCount}件`);
  process.exit(failCount ? 1 : 0);
}

(async () => {
  console.log(`対象manifest: ${manifestPath}`);

  // 統制語彙（正本）
  let vocab = {};
  try {
    vocab = readJson("parts/vocab.json");
  } catch (e) {
    fail("vocab-load", "-", "parts/vocab.json", `読み込み/パース失敗: ${e.message}`);
  }

  // manifest
  let ids = [];
  try {
    ids = readJson(manifestPath);
    if (!Array.isArray(ids)) throw new Error("配列ではない");
  } catch (e) {
    fail("manifest-load", "-", manifestPath, `読み込み/パース失敗: ${e.message}`);
    return finish();
  }

  // 3. ID重複
  const dup = [...new Set(ids.filter((v, i) => ids.indexOf(v) !== i))];
  if (dup.length) dup.forEach((d) => fail("duplicate-id", d, manifestPath, "manifest内で重複"));
  else pass("duplicate-id");

  // 10. manifestの並び順（ID昇順）
  const sorted = [...ids].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  if (JSON.stringify(sorted) === JSON.stringify(ids)) pass("manifest-order");
  else fail("manifest-order", "-", manifestPath, `ID昇順でない。期待: ${sorted.join(", ")} / 実際: ${ids.join(", ")}`);

  // 1. JSON構文 / 5. manifestにあるJSONの欠損
  const parts = {};
  let syntaxNg = false;
  let missingNg = false;
  for (const id of ids) {
    const file = partFile(id);
    if (!fs.existsSync(path.join(ROOT, file))) {
      missingNg = true;
      fail("missing-json", id, file, "manifestに登録されているがファイルが存在しない");
      continue;
    }
    try {
      parts[id] = readJson(file);
    } catch (e) {
      syntaxNg = true;
      fail("json-syntax", id, file, e.message);
    }
  }
  if (!syntaxNg) pass("json-syntax");
  if (!missingNg) pass("missing-json");

  // 6. JSONは存在するがmanifestにない（TEST-*とシステムファイルは対象外）
  const found = fs.readdirSync(PARTS_DIR)
    .filter((n) => n.endsWith(".json") && !RESERVED.includes(n) && !n.startsWith(TEST_PREFIX))
    .map((n) => n.replace(/\.json$/, ""));
  const orphans = found.filter((n) => !ids.includes(n));
  if (orphans.length) orphans.forEach((o) => fail("orphan-json", o, `parts/${o}.json`, "JSONは存在するがmanifestに登録されていない"));
  else pass("orphan-json");

  // 2. 必須項目 / 4. ID一致 / 7. kind / 8. 統制語彙 / 9. 内部リンク / 外部リンク(WARN)
  let reqNg = false, idNg = false, kindNg = false, vocabNg = false, linkNg = false;
  for (const [id, p] of Object.entries(parts)) {
    const file = partFile(id);

    // 2. 必須項目（下位キー含む）
    const missing = REQUIRED_TOP.filter((k) => p[k] === undefined);
    if (p.site) for (const k of ["no", "name", "url"]) { if (p.site[k] === undefined) missing.push(`site.${k}`); }
    if (p.attrs) for (const k of Object.keys(AXES)) { if (!Array.isArray(p.attrs[k]) || p.attrs[k].length === 0) missing.push(`attrs.${k}`); }
    if (p.links) for (const k of ["skeleton", "composition"]) { if (p.links[k] === undefined) missing.push(`links.${k}`); }
    if (missing.length) { reqNg = true; fail("required-fields", id, file, `欠落: ${missing.join(", ")}`); }

    // 4. JSON内IDとファイル名の一致
    if (p.id !== undefined && p.id !== id) { idNg = true; fail("id-filename-mismatch", id, file, `JSON内id "${p.id}" がファイル名と不一致`); }

    // 7. kind許可値
    if (vocab.kind && p.kind !== undefined && !vocab.kind.includes(p.kind)) { kindNg = true; fail("kind-vocab", id, file, `許可値外のkind: ${p.kind}`); }

    // 8. 統制語彙（category含む）
    if (vocab.category && p.category !== undefined && !vocab.category.includes(p.category)) { vocabNg = true; fail("attr-vocab", id, file, `許可値外のcategory: ${p.category}`); }
    for (const k of Object.keys(AXES)) {
      for (const v of (p.attrs && p.attrs[k]) || []) {
        if (vocab[k] && !vocab[k].includes(v)) { vocabNg = true; fail("attr-vocab", id, file, `統制語彙にない${AXES[k]}: ${v}`); }
      }
    }

    // 9. 内部リンク（FAIL）
    const internal = [p.links && p.links.skeleton, p.links && p.links.composition, p.svg].filter(Boolean);
    for (const rel of internal) {
      if (!fs.existsSync(path.join(ROOT, rel))) { linkNg = true; fail("internal-link", id, file, `内部リンク切れ: ${rel}`); }
    }

    // 外部リンク（WARNのみ。HEAD→GETフォールバック）
    const ext = p.site && p.site.url;
    if (ext) {
      const reachable = await checkExternal(ext);
      if (!reachable) warn("external-link", id, file, `外部リンクに到達できない: ${ext}`);
    }
  }
  if (!reqNg) pass("required-fields");
  if (!idNg) pass("id-filename-mismatch");
  if (!kindNg) pass("kind-vocab");
  if (!vocabNg) pass("attr-vocab");
  if (!linkNg) pass("internal-link");

  finish();
})();
