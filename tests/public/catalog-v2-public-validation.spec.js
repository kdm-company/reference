// 公開GitHub Pages（catalog-v2.html / parts/manifest.json）に対する最終公開ページ検証。
// 既存のカタログデータ・schema・vocab・manifest・catalog-v2.html・Notionは一切変更しない。
// 本ファイルは一時ブランチ test/catalog-v2-public-visual-validation 専用の検証スクリプト。
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const BASE = "https://kdm-company.github.io/reference/";
const PAGE_URL = BASE + "catalog-v2.html";
const MANIFEST_URL = BASE + "parts/manifest.json";
const OUT_DIR = path.join(__dirname, "output");

const AXES = { part: "部位", use: "用途", industry: "業種", taste: "テイスト" };

function buildMarkdownReport(r) {
  const lines = [];
  lines.push("# カタログv2 公開ページ最終検証レポート");
  lines.push("");
  lines.push("## manifest・カード");
  lines.push("- manifest HTTP: " + r.manifest.status);
  lines.push("- manifest件数: " + r.manifest.count);
  lines.push("- manifest ID重複: " + r.manifest.duplicateCount);
  lines.push("- カード件数: " + r.initialLoad.cardCount);
  lines.push("- カードIDユニーク数: " + r.initialLoad.uniqueCardIdCount);
  lines.push("- 欠落ID: " + JSON.stringify(r.initialLoad.missingIds));
  lines.push("- 余分ID: " + JSON.stringify(r.initialLoad.extraIds));
  lines.push("- 重複カード: " + r.initialLoad.duplicateCardCount);
  lines.push("- 致命的エラーバナー表示: " + r.initialLoad.errorBannerVisible);
  lines.push("");
  lines.push("## 通信・Console");
  lines.push("- manifest.json（ページ内）: " + r.network.manifestPageStatus);
  lines.push("- vocab.json（ページ内）: " + r.network.vocabPageStatus);
  lines.push("- JSON成功件数（HTTP直接）: " + r.network.jsonOk);
  lines.push("- JSON失敗件数（HTTP直接）: " + r.network.jsonFail);
  lines.push("- SVG成功件数（HTTP直接）: " + r.network.svgOk);
  lines.push("- SVG失敗件数（HTTP直接）: " + r.network.svgFail);
  lines.push("- JSON成功件数（ページ内通信）: " + r.network.inPageJsonOk);
  lines.push("- JSON失敗件数（ページ内通信）: " + r.network.inPageJsonFail);
  lines.push("- SVG成功件数（ページ内通信）: " + r.network.inPageSvgOk);
  lines.push("- SVG失敗件数（ページ内通信）: " + r.network.inPageSvgFail);
  lines.push("- requestfailed件数: " + r.network.requestFailedCount);
  lines.push("- console.error件数（favicon等除外後）: " + r.network.consoleErrorCount);
  lines.push("- pageerror件数: " + r.network.pageErrorCount);
  lines.push("");
  lines.push("## 検索・フィルター");
  lines.push("| テスト | 表示件数 | 詳細 |");
  lines.push("|---|---:|---|");
  for (const s of r.search) {
    lines.push(`| ${s.name} | ${s.displayCount} | ${JSON.stringify(s)} |`);
  }
  for (const f of r.filters) {
    lines.push(`| ${AXES[f.axis]}:${f.value} | ${f.displayCount} | allMatch=${f.allMatch} violating=${JSON.stringify(f.violatingIds)} |`);
  }
  for (const a of r.andConditions) {
    lines.push(`| ${a.name} | ${a.count} | allMatch=${a.allMatch} |`);
  }
  lines.push("");
  lines.push("## 背景装飾");
  lines.push("- 表示件数: " + r.backgroundDecoration.count);
  lines.push("- 欠落ID: " + JSON.stringify(r.backgroundDecoration.missing));
  lines.push("- 余分ID: " + JSON.stringify(r.backgroundDecoration.extra));
  lines.push("- 壊れたプレビュー数: " + r.backgroundDecoration.brokenImgCount);
  lines.push("- 空プレビュー数: " + r.backgroundDecoration.emptyImgCount);
  lines.push("");
  lines.push("## PATTERN内部制作資産");
  lines.push("| ID | 検索可 | KDM内製バッジ | 元サイトリンク | undefined/null | SVG正常 | kind:background | 用途:背景装飾 | 業種:汎用 |");
  lines.push("|---|---|---|---|---|---|---|---|---|");
  for (const p of r.patterns) {
    lines.push(`| ${p.id} | ${p.foundBySearch} | ${p.internalBadge} | ${p.externalSiteLink} | ${p.undefinedOrNull} | ${p.svgOk} | ${p.kindBackground} | ${p.useBackgroundDecoration} | ${p.industryGeneral} |`);
  }
  lines.push("");
  lines.push("## DECO-005");
  lines.push("```json");
  lines.push(JSON.stringify(r.deco005, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("## 代表リンク");
  lines.push("| ID | 元サイト | skeleton | composition | skeletonHTTP | compositionHTTP | 元サイトHTTP | JSON一致 |");
  lines.push("|---|---|---|---|---|---|---|---|");
  for (const l of r.representativeLinks) {
    lines.push(`| ${l.id} | ${l.siteHref || ""} | ${l.skeletonHref || ""} | ${l.compositionHref || ""} | ${l.skeletonStatus} | ${l.compositionStatus} | ${l.siteStatus} | site=${l.siteMatchesJson},skeleton=${l.skeletonMatchesJson},composition=${l.compositionMatchesJson} |`);
  }
  lines.push("");
  lines.push("## PC表示 (1440x1200)");
  lines.push("- scrollWidth/clientWidth: " + JSON.stringify(r.pc));
  lines.push("");
  lines.push("## SP表示 (375x812)");
  lines.push("- scrollWidth/clientWidth: " + JSON.stringify(r.sp));
  lines.push("");
  lines.push("## 障害分離");
  lines.push("```json");
  lines.push(JSON.stringify(r.faultIsolation, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("## 最終判定");
  lines.push("- 検出された問題: " + (r.issues && r.issues.length ? JSON.stringify(r.issues) : "なし"));
  lines.push("- overallPass: " + r.overallPass);
  return lines.join("\n");
}

test("公開ページ最終検証", async ({ browser, request }) => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const report = {
    manifest: {},
    initialLoad: {},
    network: {
      jsonOk: 0,
      jsonFail: 0,
      svgOk: 0,
      svgFail: 0,
      notFound: [],
    },
    search: [],
    filters: [],
    andConditions: [],
    backgroundDecoration: {},
    patterns: [],
    deco005: {},
    representativeLinks: [],
    pc: {},
    sp: {},
    faultIsolation: {},
    issues: [],
    overallPass: false,
  };

  try {
    // 1. 公開manifestのHTTP直接取得
    const manifestRes = await request.get(MANIFEST_URL);
    report.manifest.status = manifestRes.status();
    let manifestIds = [];
    try {
      manifestIds = await manifestRes.json();
    } catch (e) {
      report.issues.push("manifest JSON parse failed: " + e);
    }
    expect.soft(manifestRes.status(), "manifest HTTP status").toBe(200);
    expect.soft(Array.isArray(manifestIds), "manifest is array").toBe(true);
    report.manifest.count = manifestIds.length;
    expect.soft(manifestIds.length, "manifest count").toBe(55);
    const idSet = new Set(manifestIds);
    report.manifest.duplicateCount = manifestIds.length - idSet.size;
    expect.soft(report.manifest.duplicateCount, "manifest duplicate ids").toBe(0);
    const emptyIds = manifestIds.filter((id) => !id || String(id).trim() === "");
    report.manifest.emptyIdCount = emptyIds.length;
    expect.soft(emptyIds.length, "manifest empty ids").toBe(0);
    report.manifest.ids = manifestIds;

    // 2. 全パーツJSON・SVGをHTTP直接取得（正本として使用）
    const partData = {};
    await Promise.all(
      manifestIds.map(async (id) => {
        try {
          const r = await request.get(BASE + "parts/" + id + ".json");
          if (r.ok()) {
            partData[id] = await r.json();
            report.network.jsonOk++;
          } else {
            report.network.jsonFail++;
            report.network.notFound.push({ url: BASE + "parts/" + id + ".json", status: r.status() });
          }
        } catch (e) {
          report.network.jsonFail++;
          report.network.notFound.push({ url: BASE + "parts/" + id + ".json", error: String(e) });
        }
      })
    );
    expect.soft(report.network.jsonFail, "direct JSON fetch failures").toBe(0);

    await Promise.all(
      manifestIds.map(async (id) => {
        const p = partData[id];
        if (!p || !p.svg) {
          report.network.svgFail++;
          report.network.notFound.push({ url: "(no svg field for " + id + ")" });
          return;
        }
        try {
          const svgUrl = new URL(p.svg, BASE).toString();
          const r = await request.get(svgUrl);
          if (r.ok()) report.network.svgOk++;
          else {
            report.network.svgFail++;
            report.network.notFound.push({ url: svgUrl, status: r.status() });
          }
        } catch (e) {
          report.network.svgFail++;
          report.network.notFound.push({ url: p.svg, error: String(e) });
        }
      })
    );
    expect.soft(report.network.svgFail, "direct SVG fetch failures").toBe(0);

    // 3. PCコンテキストで初期表示・通信監視
    const pcContext = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
    const page = await pcContext.newPage();

    const consoleErrors = [];
    const pageErrors = [];
    const requestFailures = [];
    const responses = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => pageErrors.push(String(err)));
    page.on("requestfailed", (req) => {
      requestFailures.push({ url: req.url(), failure: req.failure() && req.failure().errorText });
    });
    page.on("response", (res) => {
      responses.push({ url: res.url(), status: res.status() });
    });

    const httpResponse = await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
    report.initialLoad.httpStatus = httpResponse ? httpResponse.status() : null;
    expect.soft(report.initialLoad.httpStatus, "page HTTP status").toBe(200);

    await page.waitForLoadState("networkidle");
    await expect.poll(async () => await page.locator(".grid .card").count(), { timeout: 30000 }).toBeGreaterThan(0);
    await page.waitForFunction(
      () => {
        const el = document.getElementById("count");
        return el && /\d+\s*\/\s*\d+\s*件/.test(el.textContent || "");
      },
      { timeout: 30000 }
    );

    report.initialLoad.title = await page.title();
    expect.soft(report.initialLoad.title.length > 0, "page title present").toBe(true);

    const errorBannerVisible = await page.locator("#errors.show").count();
    report.initialLoad.errorBannerVisible = errorBannerVisible > 0;
    expect.soft(errorBannerVisible, "no fatal error banner on initial load").toBe(0);

    const cardCount = await page.locator(".grid .card").count();
    report.initialLoad.cardCount = cardCount;
    expect.soft(cardCount, "card DOM count").toBe(55);

    const cardIdTexts = await page.locator(".grid .card .id").allTextContents();
    const parsedIds = cardIdTexts.map((t) => t.split("｜")[0].trim());
    const uniqueCardIds = new Set(parsedIds);
    report.initialLoad.uniqueCardIdCount = uniqueCardIds.size;
    expect.soft(uniqueCardIds.size, "unique card id count").toBe(55);
    report.initialLoad.duplicateCardCount = parsedIds.length - uniqueCardIds.size;
    expect.soft(report.initialLoad.duplicateCardCount, "duplicate cards").toBe(0);

    const missingIds = manifestIds.filter((id) => !uniqueCardIds.has(id));
    const extraIds = [...uniqueCardIds].filter((id) => !idSet.has(id));
    report.initialLoad.missingIds = missingIds;
    report.initialLoad.extraIds = extraIds;
    expect.soft(missingIds.length, "missing ids").toBe(0);
    expect.soft(extraIds.length, "extra ids").toBe(0);

    const countText = (await page.locator("#count").textContent()) || "";
    report.initialLoad.countText = countText.trim();

    const manifestResp = responses.find((r) => r.url.includes("parts/manifest.json"));
    const vocabResp = responses.find((r) => r.url.includes("parts/vocab.json"));
    report.network.manifestPageStatus = manifestResp ? manifestResp.status : null;
    report.network.vocabPageStatus = vocabResp ? vocabResp.status : null;
    expect.soft(report.network.manifestPageStatus, "manifest.json in-page status").toBe(200);
    expect.soft(report.network.vocabPageStatus, "vocab.json in-page status").toBe(200);

    const jsonResponses = responses.filter((r) => /parts\/.*\.json/.test(r.url) && !r.url.includes("manifest.json") && !r.url.includes("vocab.json"));
    const svgResponses = responses.filter((r) => /parts\/.*\.svg/.test(r.url));
    const jsonNotOk = jsonResponses.filter((r) => r.status !== 200);
    const svgNotOk = svgResponses.filter((r) => r.status !== 200);
    report.network.inPageJsonOk = jsonResponses.length - jsonNotOk.length;
    report.network.inPageJsonFail = jsonNotOk.length;
    report.network.inPageSvgOk = svgResponses.length - svgNotOk.length;
    report.network.inPageSvgFail = svgNotOk.length;
    expect.soft(jsonNotOk.length, "in-page JSON failures").toBe(0);
    expect.soft(svgNotOk.length, "in-page SVG failures").toBe(0);

    report.network.requestFailedCount = requestFailures.length;
    report.network.requestFailures = requestFailures;
    expect.soft(requestFailures.length, "requestfailed events").toBe(0);

    const relevantConsoleErrors = consoleErrors.filter((t) => !/favicon/i.test(t));
    report.network.consoleErrors = relevantConsoleErrors;
    report.network.consoleErrorCount = relevantConsoleErrors.length;
    expect.soft(relevantConsoleErrors.length, "console.error count").toBe(0);

    report.network.pageErrors = pageErrors;
    report.network.pageErrorCount = pageErrors.length;
    expect.soft(pageErrors.length, "pageerror count").toBe(0);

    async function resetFilters() {
      await page.selectOption("#f-part", "");
      await page.selectOption("#f-use", "");
      await page.selectOption("#f-industry", "");
      await page.selectOption("#f-taste", "");
      await page.fill("#f-text", "");
      await page.waitForTimeout(100);
    }

    async function getVisibleCardIds() {
      const texts = await page.locator(".grid .card .id").allTextContents();
      return texts.map((t) => t.split("｜")[0].trim());
    }

    async function getCardAttrs(cardLocator) {
      const chips = await cardLocator.locator(".attrs span").allTextContents();
      return chips.map((c) => c.trim());
    }

    // 7. 検索テスト
    await resetFilters();
    await page.fill("#f-text", "PATTERN-001");
    await page.waitForTimeout(150);
    let ids = await getVisibleCardIds();
    const testA = { name: "PATTERN-001検索", displayCount: ids.length, ids, unrelated: ids.filter((id) => id !== "PATTERN-001") };
    report.search.push(testA);
    expect.soft(ids.includes("PATTERN-001"), "PATTERN-001 search shows PATTERN-001").toBe(true);
    expect.soft(ids.length > 0, "PATTERN-001 search shows at least one card").toBe(true);

    await resetFilters();
    await page.fill("#f-text", "問い合わせ");
    await page.waitForTimeout(150);
    ids = await getVisibleCardIds();
    const testB = { name: "問い合わせ検索", displayCount: ids.length, ids, hasDeco034: ids.includes("DECO-034"), patternContamination: ids.filter((id) => id.startsWith("PATTERN-")) };
    report.search.push(testB);
    expect.soft(testB.hasDeco034, "問い合わせ search includes DECO-034").toBe(true);
    expect.soft(testB.patternContamination.length, "no PATTERN contamination in 問い合わせ search").toBe(0);

    await resetFilters();
    await page.fill("#f-text", "存在しない検索語_xyz_999");
    await page.waitForTimeout(150);
    ids = await getVisibleCardIds();
    const countTextC = (await page.locator("#count").textContent()) || "";
    const testC = { name: "0件検索", displayCount: ids.length, countText: countTextC.trim() };
    report.search.push(testC);
    expect.soft(ids.length, "0件検索 shows zero cards").toBe(0);
    expect.soft(await page.locator("#grid").count(), "grid element remains after empty search").toBe(1);

    await resetFilters();

    // 8. 属性フィルター
    async function testAttributeFilter(selectId, axisKey, value, expectDecoInclude) {
      await resetFilters();
      await page.selectOption(selectId, value);
      await page.waitForTimeout(150);
      const cardLocators = page.locator(".grid .card");
      const count = await cardLocators.count();
      let allMatch = true;
      const violatingIds = [];
      for (let i = 0; i < count; i++) {
        const card = cardLocators.nth(i);
        const attrs = await getCardAttrs(card);
        const label = AXES[axisKey] + ": " + value;
        if (!attrs.includes(label)) {
          allMatch = false;
          const idText = await card.locator(".id").textContent();
          violatingIds.push((idText || "").split("｜")[0].trim());
        }
      }
      const idsNow = await getVisibleCardIds();
      const result = { axis: axisKey, value, displayCount: count, allMatch, violatingIds, includesDeco034: idsNow.includes("DECO-034") };
      report.filters.push(result);
      expect.soft(count > 0, `${axisKey}=${value} shows at least one card`).toBe(true);
      expect.soft(allMatch, `${axisKey}=${value} all cards match attribute`).toBe(true);
      if (expectDecoInclude) {
        expect.soft(result.includesDeco034, `${axisKey}=${value} includes DECO-034`).toBe(true);
      }
      return result;
    }

    const heroResult = await testAttributeFilter("#f-part", "part", "ヒーロー", false);
    expect.soft(heroResult.displayCount < 55, "部位=ヒーロー is fewer than total").toBe(true);
    await testAttributeFilter("#f-use", "use", "問い合わせ", true);
    await testAttributeFilter("#f-industry", "industry", "医療", false);
    await testAttributeFilter("#f-taste", "taste", "先進", false);
    await resetFilters();

    // 9. AND条件
    await page.selectOption("#f-part", "ヒーロー");
    await page.selectOption("#f-use", "トップページ");
    await page.selectOption("#f-industry", "IT");
    await page.waitForTimeout(150);
    {
      const cardLocators = page.locator(".grid .card");
      const count = await cardLocators.count();
      let allMatch = true;
      for (let i = 0; i < count; i++) {
        const attrs = await getCardAttrs(cardLocators.nth(i));
        if (!attrs.includes("部位: ヒーロー") || !attrs.includes("用途: トップページ") || !attrs.includes("業種: IT")) allMatch = false;
      }
      report.andConditions.push({ name: "複合AND(ヒーロー×トップページ×IT)", count, allMatch });
      expect.soft(allMatch, "AND condition 1 all cards match").toBe(true);
    }
    await resetFilters();

    await page.selectOption("#f-part", "フォーム");
    await page.selectOption("#f-use", "背景装飾");
    await page.waitForTimeout(150);
    {
      const cardLocators = page.locator(".grid .card");
      const count = await cardLocators.count();
      let allMatch = true;
      for (let i = 0; i < count; i++) {
        const attrs = await getCardAttrs(cardLocators.nth(i));
        if (!(attrs.includes("部位: フォーム") && attrs.includes("用途: 背景装飾"))) allMatch = false;
      }
      const gridOk = await page.locator("#grid").count();
      report.andConditions.push({ name: "0件条件(フォーム×背景装飾)", count, allMatch: count === 0 ? true : allMatch, pageAlive: gridOk === 1 });
      expect.soft(count === 0 || allMatch, "0件条件 shows only matching or zero").toBe(true);
      expect.soft(gridOk, "page not broken after zero-result filter").toBe(1);
    }
    await resetFilters();

    // 10. 背景装飾フィルター
    await page.selectOption("#f-use", "背景装飾");
    await page.waitForTimeout(150);
    {
      const expectedIds = ["DECO-005", "PATTERN-001", "PATTERN-002", "PATTERN-003", "PATTERN-004", "PATTERN-005", "PATTERN-006", "PATTERN-007", "PATTERN-008", "PATTERN-009", "PATTERN-010"];
      const idsNow = await getVisibleCardIds();
      const missing = expectedIds.filter((id) => !idsNow.includes(id));
      const extra = idsNow.filter((id) => !expectedIds.includes(id));
      const cardLocators = page.locator(".grid .card");
      const count = await cardLocators.count();
      let brokenImgCount = 0;
      let emptyImgCount = 0;
      for (let i = 0; i < count; i++) {
        const img = cardLocators.nth(i).locator("img");
        const src = await img.getAttribute("src");
        if (!src) {
          emptyImgCount++;
          continue;
        }
        await img.scrollIntoViewIfNeeded();
        await page.waitForTimeout(50);
        const ok = await img.evaluate((el) => el.complete && el.naturalWidth > 0).catch(() => false);
        if (!ok) brokenImgCount++;
      }
      report.backgroundDecoration = { count: idsNow.length, missing, extra, brokenImgCount, emptyImgCount, ids: idsNow };
      expect.soft(idsNow.length, "background decoration count").toBe(11);
      expect.soft(missing.length, "no missing background decoration ids").toBe(0);
      expect.soft(extra.length, "no extra ids in background decoration filter").toBe(0);
      expect.soft(brokenImgCount, "no broken svg previews").toBe(0);
      expect.soft(emptyImgCount, "no empty svg preview src").toBe(0);
    }
    await resetFilters();

    // 11. PATTERN-001〜010 個別確認
    for (let n = 1; n <= 10; n++) {
      const id = "PATTERN-" + String(n).padStart(3, "0");
      await resetFilters();
      await page.fill("#f-text", id);
      await page.waitForTimeout(150);
      const cardLocators = page.locator(".grid .card").filter({ has: page.locator(".id", { hasText: id }) });
      const count = await cardLocators.count();
      const result = { id, foundBySearch: count > 0 };
      if (count > 0) {
        const card = cardLocators.first();
        const linksHtml = await card.locator(".links").innerHTML();
        const cardHtml = await card.innerHTML();
        const hasInternalBadge = linksHtml.includes("internal-badge") && linksHtml.includes("KDM内製");
        const hasSiteLink = /元サイト/.test(linksHtml) && !hasInternalBadge;
        const hasUndefinedOrNull = /undefined|null/.test(cardHtml);
        const attrs = await getCardAttrs(card);
        const img = card.locator("img");
        await img.scrollIntoViewIfNeeded();
        await page.waitForTimeout(50);
        const svgOk = await img.evaluate((el) => el.complete && el.naturalWidth > 0).catch(() => false);
        result.internalBadge = hasInternalBadge;
        result.externalSiteLink = hasSiteLink;
        result.undefinedOrNull = hasUndefinedOrNull;
        result.svgOk = svgOk;
        result.kindBackground = attrs.includes("kind: background");
        result.useBackgroundDecoration = attrs.includes("用途: 背景装飾");
        result.industryGeneral = attrs.includes("業種: 汎用");
      }
      report.patterns.push(result);
      expect.soft(result.foundBySearch, `${id} findable by search`).toBe(true);
      if (count > 0) {
        expect.soft(result.internalBadge, `${id} shows KDM内製 badge`).toBe(true);
        expect.soft(result.externalSiteLink, `${id} has no external site link`).toBe(false);
        expect.soft(result.undefinedOrNull, `${id} has no undefined/null text`).toBe(false);
        expect.soft(result.svgOk, `${id} svg preview loads`).toBe(true);
        expect.soft(result.kindBackground, `${id} kind is background`).toBe(true);
        expect.soft(result.useBackgroundDecoration, `${id} use includes 背景装飾`).toBe(true);
        expect.soft(result.industryGeneral, `${id} industry includes 汎用`).toBe(true);
      }
    }
    await resetFilters();

    // 12. DECO-005 個別確認
    {
      await page.fill("#f-text", "DECO-005");
      await page.waitForTimeout(150);
      const cardLocators = page.locator(".grid .card").filter({ has: page.locator(".id", { hasText: "DECO-005" }) });
      const count = await cardLocators.count();
      const result = { found: count > 0 };
      if (count > 0) {
        const card = cardLocators.first();
        const linksHtml = await card.locator(".links").innerHTML();
        const hasInternalBadge = linksHtml.includes("internal-badge");
        const siteLinkCount = await card.locator(".links a", { hasText: "元サイト" }).count();
        const siteLinkHref = siteLinkCount > 0 ? await card.locator(".links a", { hasText: "元サイト" }).getAttribute("href") : null;
        const attrs = await getCardAttrs(card);
        const img = card.locator("img");
        await img.scrollIntoViewIfNeeded();
        await page.waitForTimeout(50);
        const svgOk = await img.evaluate((el) => el.complete && el.naturalWidth > 0).catch(() => false);
        const skeletonHref = await card.locator(".links a", { hasText: "骨格HTML" }).getAttribute("href").catch(() => null);
        const compositionHref = await card.locator(".links a", { hasText: "構図メモ" }).getAttribute("href").catch(() => null);

        result.internalBadge = hasInternalBadge;
        result.siteUrl = siteLinkHref;
        result.svgOk = svgOk;
        result.kindBackground = attrs.includes("kind: background");
        result.partHero = attrs.includes("部位: ヒーロー");
        result.partContent = attrs.includes("部位: コンテンツセクション");
        result.useBackgroundDecoration = attrs.includes("用途: 背景装飾");
        result.industryManufacturing = attrs.includes("業種: 製造");
        result.industryGeneral = attrs.includes("業種: 汎用");
        result.tasteAdvanced = attrs.includes("テイスト: 先進");
        result.skeletonHref = skeletonHref;
        result.compositionHref = compositionHref;

        if (skeletonHref) {
          const r = await request.get(new URL(skeletonHref, PAGE_URL).toString());
          result.skeletonStatus = r.status();
        }
        if (compositionHref) {
          const r = await request.get(new URL(compositionHref, PAGE_URL).toString());
          result.compositionStatus = r.status();
        }
        if (siteLinkHref) {
          try {
            const r = await request.get(siteLinkHref, { failOnStatusCode: false });
            result.siteStatus = r.status();
          } catch (e) {
            result.siteStatus = "error: " + String(e);
          }
        }
      }
      report.deco005 = result;
      expect.soft(result.found, "DECO-005 found").toBe(true);
      if (result.found) {
        expect.soft(result.internalBadge, "DECO-005 is not KDM内製 badge").toBe(false);
        expect.soft(!!result.siteUrl, "DECO-005 has site link").toBe(true);
        expect.soft(result.siteUrl, "DECO-005 site url matches").toBe("https://www.iwasaki.co.jp/");
        expect.soft(result.kindBackground, "DECO-005 kind background").toBe(true);
        expect.soft(result.partHero, "DECO-005 part includes ヒーロー").toBe(true);
        expect.soft(result.partContent, "DECO-005 part includes コンテンツセクション").toBe(true);
        expect.soft(result.useBackgroundDecoration, "DECO-005 use includes 背景装飾").toBe(true);
        expect.soft(result.industryManufacturing, "DECO-005 industry includes 製造").toBe(true);
        expect.soft(result.industryGeneral, "DECO-005 industry includes 汎用").toBe(true);
        expect.soft(result.tasteAdvanced, "DECO-005 taste includes 先進").toBe(true);
        expect.soft(result.skeletonStatus, "DECO-005 skeleton link HTTP 200").toBe(200);
        expect.soft(result.compositionStatus, "DECO-005 composition link HTTP 200").toBe(200);
      }
    }
    await resetFilters();

    // 13. 代表リンク確認
    for (const id of ["DECO-034", "LAYOUT-002", "LAYOUT-014"]) {
      await resetFilters();
      await page.fill("#f-text", id);
      await page.waitForTimeout(150);
      const cardLocators = page.locator(".grid .card").filter({ has: page.locator(".id", { hasText: id }) });
      const count = await cardLocators.count();
      const result = { id, found: count > 0 };
      if (count > 0) {
        const card = cardLocators.first();
        const siteHref = await card.locator(".links a", { hasText: "元サイト" }).getAttribute("href").catch(() => null);
        const skeletonHref = await card.locator(".links a", { hasText: "骨格HTML" }).getAttribute("href").catch(() => null);
        const compositionHref = await card.locator(".links a", { hasText: "構図メモ" }).getAttribute("href").catch(() => null);
        result.siteHref = siteHref;
        result.skeletonHref = skeletonHref;
        result.compositionHref = compositionHref;

        const expectedPart = partData[id] || {};
        result.siteMatchesJson = !!(expectedPart.site && expectedPart.site.url === siteHref);
        result.skeletonMatchesJson = !!(expectedPart.links && expectedPart.links.skeleton && new URL(expectedPart.links.skeleton, PAGE_URL).toString() === new URL(skeletonHref, PAGE_URL).toString());
        result.compositionMatchesJson = !!(expectedPart.links && expectedPart.links.composition && new URL(expectedPart.links.composition, PAGE_URL).toString() === new URL(compositionHref, PAGE_URL).toString());

        if (skeletonHref) {
          const r = await request.get(new URL(skeletonHref, PAGE_URL).toString());
          result.skeletonStatus = r.status();
        }
        if (compositionHref) {
          const r = await request.get(new URL(compositionHref, PAGE_URL).toString());
          result.compositionStatus = r.status();
        }
        if (siteHref) {
          try {
            const r = await request.get(siteHref, { failOnStatusCode: false });
            result.siteStatus = r.status();
          } catch (e) {
            result.siteStatus = "error: " + String(e);
          }
        }
      }
      report.representativeLinks.push(result);
      expect.soft(result.found, `${id} found`).toBe(true);
      if (result.found) {
        expect.soft(!!result.siteHref, `${id} has site link`).toBe(true);
        expect.soft(!!result.skeletonHref, `${id} has skeleton link`).toBe(true);
        expect.soft(!!result.compositionHref, `${id} has composition link`).toBe(true);
        expect.soft(result.skeletonStatus, `${id} skeleton HTTP 200`).toBe(200);
        expect.soft(result.compositionStatus, `${id} composition HTTP 200`).toBe(200);
        expect.soft(result.siteMatchesJson, `${id} site link matches JSON`).toBe(true);
        expect.soft(result.skeletonMatchesJson, `${id} skeleton link matches JSON`).toBe(true);
        expect.soft(result.compositionMatchesJson, `${id} composition link matches JSON`).toBe(true);
      }
    }
    await resetFilters();

    // 14. PC表示・スクリーンショット
    await page.screenshot({ path: path.join(OUT_DIR, "catalog-v2-pc-1440.png"), fullPage: true });
    const pcScroll = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    report.pc = { viewport: "1440x1200", ...pcScroll, noHorizontalScroll: pcScroll.scrollWidth <= pcScroll.clientWidth + 1 };
    expect.soft(report.pc.noHorizontalScroll, "PC no unwanted horizontal scroll").toBe(true);
    await pcContext.close();

    // 15. SP表示・スクリーンショット
    const spContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const spPage = await spContext.newPage();
    await spPage.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
    await spPage.waitForLoadState("networkidle");
    await expect.poll(async () => await spPage.locator(".grid .card").count(), { timeout: 30000 }).toBeGreaterThan(0);
    await spPage.screenshot({ path: path.join(OUT_DIR, "catalog-v2-sp-375.png"), fullPage: true });
    const spScroll = await spPage.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    await spPage.selectOption("#f-use", "背景装飾");
    await spPage.waitForTimeout(200);
    const spBgIds = await spPage.locator(".grid .card .id").allTextContents();
    const spBgCount = spBgIds.length;
    const spFirstLinksHtml = await spPage.locator(".grid .card").first().locator(".links").innerHTML().catch(() => "");
    const spBadgeVisibleSample = spFirstLinksHtml.includes("internal-badge");
    report.sp = {
      viewport: "375x812",
      ...spScroll,
      noHorizontalScroll: spScroll.scrollWidth <= spScroll.clientWidth + 1,
      backgroundFilterCount: spBgCount,
      badgeVisibleSample: spBadgeVisibleSample,
    };
    expect.soft(report.sp.noHorizontalScroll, "SP no unwanted horizontal scroll").toBe(true);
    expect.soft(spBgCount, "SP background decoration filter count").toBe(11);
    await spContext.close();

    // 16. 障害分離（別コンテキスト、route機能で1件だけ不正JSONに差し替え）
    const faultContext = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
    const faultPage = await faultContext.newPage();
    const brokenId = "DECO-032";
    await faultPage.route("**/parts/" + brokenId + ".json*", (route) => {
      route.fulfill({ status: 200, contentType: "application/json", body: "{invalid json" });
    });
    const faultPageErrors = [];
    faultPage.on("pageerror", (err) => faultPageErrors.push(String(err)));
    await faultPage.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
    await faultPage.waitForLoadState("networkidle");
    await expect.poll(async () => await faultPage.locator(".grid .card").count(), { timeout: 30000 }).toBeGreaterThan(0);
    const remainingCount = await faultPage.locator(".grid .card").count();
    const faultErrorBanner = await faultPage.locator("#errors.show").count();
    report.faultIsolation = {
      brokenId,
      remainingCardCount: remainingCount,
      pageAlive: (await faultPage.locator("#grid").count()) === 1,
      errorBannerShown: faultErrorBanner > 0,
      unhandledExceptionCount: faultPageErrors.length,
    };
    expect.soft(remainingCount, "54 remaining cards after fault injection").toBe(54);
    expect.soft(report.faultIsolation.errorBannerShown, "error banner shown to user").toBe(true);
    expect.soft(faultPageErrors.length, "no unhandled exceptions during fault isolation").toBe(0);
    await faultContext.close();

    // 最終判定の集計
    const issues = [];
    if (report.manifest.count !== 55) issues.push("manifestが55件でない");
    if (report.initialLoad.cardCount !== 55) issues.push("カードが55件でない");
    if ((report.initialLoad.missingIds || []).length || (report.initialLoad.extraIds || []).length) issues.push("manifestとカードのID不一致");
    if (report.network.jsonFail > 0 || report.network.inPageJsonFail > 0) issues.push("JSONの404/失敗あり");
    if (report.network.svgFail > 0 || report.network.inPageSvgFail > 0) issues.push("SVGの404/失敗あり");
    if (report.network.requestFailedCount > 0) issues.push("failed requestあり");
    if (report.network.consoleErrorCount > 0 || report.network.pageErrorCount > 0) issues.push("致命的Consoleエラーあり");
    if (report.filters.some((f) => !f.allMatch)) issues.push("フィルター誤動作");
    if (report.backgroundDecoration.count !== 11) issues.push("背景装飾が11件でない");
    if (report.patterns.some((p) => !p.internalBadge)) issues.push("PATTERNのKDM内製バッジ欠落");
    if (report.patterns.some((p) => p.externalSiteLink)) issues.push("PATTERNに元サイトリンクが存在");
    if (report.deco005.found && (!report.deco005.kindBackground || !report.deco005.useBackgroundDecoration)) issues.push("DECO-005の属性不一致");
    if (!report.pc.noHorizontalScroll) issues.push("PCで不要な横スクロール");
    if (!report.sp.noHorizontalScroll) issues.push("SPで不要な横スクロール");
    if (report.faultIsolation.remainingCardCount !== 54) issues.push("障害分離で54件が維持されない");
    report.issues = issues;
    report.overallPass = issues.length === 0;

    expect(issues, "compiled issue list should be empty").toEqual([]);
  } finally {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(path.join(OUT_DIR, "visual-check-report.json"), JSON.stringify(report, null, 2));
    fs.writeFileSync(path.join(OUT_DIR, "visual-check-report.md"), buildMarkdownReport(report));
  }
});
