const { test, expect } = require("@playwright/test");

test.describe("カタログ v2（本番manifest）", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/catalog-v2.html");
  });

  test("初期表示でDECO-032・033の2件が表示され、ID昇順で固定", async ({ page }) => {
    await expect(page.locator(".card")).toHaveCount(2);
    const ids = await page.locator(".card .id").allTextContents();
    expect(ids[0]).toContain("DECO-032");
    expect(ids[1]).toContain("DECO-033");
  });

  test("4軸フィルター（部位・用途・業種・テイスト）が動く", async ({ page }) => {
    await expect(page.locator(".card")).toHaveCount(2);
    await page.selectOption("#f-part", "コンテンツセクション");
    await expect(page.locator(".card")).toHaveCount(1);
    await expect(page.locator(".card .id").first()).toContainText("DECO-032");
    await page.selectOption("#f-part", "");
    await page.selectOption("#f-use", "ブランド訴求");
    await expect(page.locator(".card")).toHaveCount(1);
    await expect(page.locator(".card .id").first()).toContainText("DECO-033");
    await page.selectOption("#f-use", "");
    await page.selectOption("#f-industry", "製造");
    await expect(page.locator(".card")).toHaveCount(1);
    await expect(page.locator(".card .id").first()).toContainText("DECO-032");
    await page.selectOption("#f-industry", "");
    await page.selectOption("#f-taste", "和風");
    await expect(page.locator(".card")).toHaveCount(1);
    await expect(page.locator(".card .id").first()).toContainText("DECO-033");
  });

  test("キーワード検索が動く", async ({ page }) => {
    await expect(page.locator(".card")).toHaveCount(2);
    await page.fill("#f-text", "沿革年表");
    await expect(page.locator(".card")).toHaveCount(1);
    await expect(page.locator(".card .id").first()).toContainText("DECO-032");
    await page.fill("#f-text", "存在しないキーワードXYZ123");
    await expect(page.locator(".card")).toHaveCount(0);
  });

  test("内部リンク（skeleton・composition・SVG）が取得できる", async ({ page }) => {
    await expect(page.locator(".card")).toHaveCount(2);
    const hrefs = await page.locator(".card .links a").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    const srcs = await page.locator(".card img").evaluateAll((els) => els.map((e) => e.getAttribute("src")));
    const internal = [...hrefs, ...srcs].filter((u) => u && !/^https?:/.test(u));
    expect(internal.length).toBeGreaterThanOrEqual(6);
    for (const u of internal) {
      const res = await page.request.get("http://localhost:8080/" + u);
      expect(res.ok(), u + " が取得できない").toBeTruthy();
    }
  });
});

test.describe("スマートフォン幅（375px）", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("表示と操作ができる", async ({ page }) => {
    await page.goto("/catalog-v2.html");
    await expect(page.locator(".card")).toHaveCount(2);
    await page.selectOption("#f-taste", "和風");
    await expect(page.locator(".card")).toHaveCount(1);
    await page.selectOption("#f-taste", "");
    await page.fill("#f-text", "沿革");
    await expect(page.locator(".card")).toHaveCount(1);
    await expect(page.locator(".card .id").first()).toContainText("DECO-032");
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
