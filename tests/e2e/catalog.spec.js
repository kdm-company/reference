const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "../..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(rootDir, "parts/manifest.json"), "utf8")
);
const productionParts = manifest.map((id) =>
  JSON.parse(
    fs.readFileSync(path.join(rootDir, "parts", `${id}.json`), "utf8")
  )
);
const expectedIds = [...manifest].sort((a, b) =>
  String(a).localeCompare(String(b))
);

function expectedIdsFor(key, value) {
  return productionParts
    .filter((part) => (part.attrs?.[key] || []).includes(value))
    .map((part) => part.id)
    .sort((a, b) => a.localeCompare(b));
}

function expectedIdsForSearch(query) {
  return productionParts
    .filter((part) => JSON.stringify(part).includes(query))
    .map((part) => part.id)
    .sort((a, b) => a.localeCompare(b));
}

const deco034 = productionParts.find((p) => p.id === "DECO-034");

test.describe("カタログ v2（本番manifest）", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/catalog-v2.html");
  });

  test("本番manifestの全件が表示され、ID昇順で固定される", async ({ page }) => {
    await expect(page.locator(".card")).toHaveCount(expectedIds.length);
    const ids = await page.locator(".card .id").allTextContents();
    expectedIds.forEach((id, i) => expect(ids[i]).toContain(id));
    expect(ids[ids.length - 1]).toContain(expectedIds[expectedIds.length - 1]);
  });

  test("4軸フィルター（部位・用途・業種・テイスト）が動く", async ({ page }) => {
    await expect(page.locator(".card")).toHaveCount(expectedIds.length);

    async function assertFilter(selectId, value, expectedList) {
      await page.selectOption(selectId, value);
      await expect(page.locator(".card")).toHaveCount(expectedList.length);
      const ids = await page.locator(".card .id").allTextContents();
      expectedList.forEach((id, i) => expect(ids[i]).toContain(id));
      await page.selectOption(selectId, "");
    }

    await assertFilter("#f-part", "コンテンツセクション", expectedIdsFor("part", "コンテンツセクション"));
    await assertFilter("#f-part", "ページ全体", expectedIdsFor("part", "ページ全体"));
    await assertFilter("#f-part", "フォーム", expectedIdsFor("part", "フォーム"));

    await assertFilter("#f-use", "料金表", expectedIdsFor("use", "料金表"));
    await assertFilter("#f-use", "問い合わせ", expectedIdsFor("use", "問い合わせ"));

    await assertFilter("#f-industry", "寺社・観光", expectedIdsFor("industry", "寺社・観光"));
    await assertFilter("#f-industry", "士業", expectedIdsFor("industry", "士業"));

    await assertFilter("#f-taste", "和風", expectedIdsFor("taste", "和風"));
    await assertFilter("#f-taste", "コーポレート", expectedIdsFor("taste", "コーポレート"));
    await assertFilter("#f-taste", "端正", expectedIdsFor("taste", "端正"));
  });

  test("DECO-034（フォームコンポーネント）のカード内容が正しい", async ({ page }) => {
    const card = page.locator(".card").filter({ hasText: "DECO-034" });
    await expect(card).toHaveCount(1);
    await expect(card).toContainText(deco034.name);
    await expect(card).toContainText("kind: component");
    await expect(card).toContainText("部位: フォーム");
    await expect(card).toContainText("用途: 問い合わせ");
    await expect(card).toContainText("業種: 士業");
    await expect(card).toContainText("テイスト: コーポレート");
    await expect(card).toContainText("テイスト: 端正");
    await expect(card.locator("img")).toHaveAttribute("src", deco034.svg);
    await expect(card.locator("a", { hasText: "骨格HTML" })).toHaveAttribute("href", deco034.links.skeleton);
    await expect(card.locator("a", { hasText: "構図メモ" })).toHaveAttribute("href", deco034.links.composition);
    await expect(card.locator("a", { hasText: "元サイト" })).toHaveAttribute("href", deco034.site.url);
  });

  test("キーワード検索が動く", async ({ page }) => {
    await expect(page.locator(".card")).toHaveCount(expectedIds.length);

    await page.fill("#f-text", "沿革年表");
    const historyExpected = expectedIdsForSearch("沿革年表");
    await expect(page.locator(".card")).toHaveCount(historyExpected.length);
    await expect(page.locator(".card .id").first()).toContainText("DECO-032");

    await page.fill("#f-text", "存在しないキーワードXYZ123");
    await expect(page.locator(".card")).toHaveCount(0);

    await page.fill("#f-text", "問い合わせフォーム");
    const formExpected = expectedIdsForSearch("問い合わせフォーム");
    await expect(page.locator(".card")).toHaveCount(formExpected.length);
    const ids = await page.locator(".card .id").allTextContents();
    expect(ids.join(" ")).toContain("DECO-034");
  });

  test("内部リンク（skeleton・composition・SVG）が取得できる", async ({ page }) => {
    await expect(page.locator(".card")).toHaveCount(expectedIds.length);
    const hrefs = await page.locator(".card .links a").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    const srcs = await page.locator(".card img").evaluateAll((els) => els.map((e) => e.getAttribute("src")));
    const internal = [...hrefs, ...srcs].filter((u) => u && !/^https?:/.test(u));
    expect(internal.length).toBe(expectedIds.length * 3);
    for (const u of internal) {
      const res = await page.request.get("http://localhost:8080/" + u);
      expect(res.ok(), u + " が取得できない").toBeTruthy();
    }
    for (const u of [
      "sites/026_sugimoto_lawyer_contact/skeleton.html",
      "sites/026_sugimoto_lawyer_contact/composition.md",
      "parts/DECO-034.svg",
    ]) {
      expect(internal).toContain(u);
    }
  });
});

test.describe("スマートフォン幅（375px）", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("表示と操作ができる", async ({ page }) => {
    await page.goto("/catalog-v2.html");
    await expect(page.locator(".card")).toHaveCount(expectedIds.length);

    await page.selectOption("#f-taste", "和風");
    await expect(page.locator(".card")).toHaveCount(expectedIdsFor("taste", "和風").length);
    await page.selectOption("#f-taste", "");

    await page.fill("#f-text", "沿革");
    await expect(page.locator(".card")).toHaveCount(expectedIdsForSearch("沿革").length);
    await expect(page.locator(".card .id").first()).toContainText("DECO-032");
    await page.fill("#f-text", "");

    await page.selectOption("#f-part", "フォーム");
    await expect(page.locator(".card")).toHaveCount(expectedIdsFor("part", "フォーム").length);
    const card = page.locator(".card").filter({ hasText: "DECO-034" });
    await expect(card).toHaveCount(1);
    const box = await card.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(375);
    await expect(card.locator("a", { hasText: "骨格HTML" })).toBeVisible();
    await expect(card.locator("a", { hasText: "構図メモ" })).toBeVisible();
    await page.selectOption("#f-part", "");
  });
});

test.describe("テストmanifest（破損・語彙違反フィクスチャ。tests/fixtures/ から読込）", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/catalog-v2.html?manifest=tests/fixtures/manifest.test.json");
  });

  test("JSONが1件壊れても正常なカードが表示される", async ({ page }) => {
    await expect(page.locator(".card")).toHaveCount(3);
    const ids = await page.locator(".card .id").allTextContents();
    expect(ids.join(" ")).toContain("DECO-032");
    expect(ids.join(" ")).toContain("DECO-033");
  });

  test("エラー件数と対象IDが表示される", async ({ page }) => {
    await expect(page.locator("#errors")).toBeVisible();
    await expect(page.locator("#errors")).toContainText("1件");
    await expect(page.locator("#errors")).toContainText("TEST-BROKEN");
  });

  test("未定義語彙が（語彙外）として検出・表示される", async ({ page }) => {
    await expect(page.locator("#f-part option:has-text('メイン（語彙外）')")).toHaveCount(1);
    await expect(page.locator("#f-taste option:has-text('サイバー（語彙外）')")).toHaveCount(1);
  });
});
