import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { expectNoHorizontalOverflow, settle, watchErrors } from "./helpers";

type Reply = { status?: number; body: Record<string, unknown>; delay?: number };

async function mockChat(page: Page, reply: (q: string) => Reply) {
  await page.addInitScript(() => window.localStorage.setItem("oss_cookie_consent", "accepted"));
  const seen: string[] = [];
  await page.route("**/api/chat", async (route) => {
    const q = JSON.parse(route.request().postData() ?? "{}").messages.at(-1).content as string;
    seen.push(q);
    const r = reply(q);
    if (r.delay) await new Promise((x) => setTimeout(x, r.delay));
    await route.fulfill({ status: r.status ?? 200, contentType: "application/json", body: JSON.stringify(r.body) });
  });
  return seen;
}
const price = { reply: "Our packages are fixed-price: Launch is £189 and Growth is £489.", actions: [{ label: "See packages and prices", href: "/packages" }], source: "site" };
const open = async (page: Page) => {
  await page.getByRole("button", { name: /Open chat with Sid/ }).click();
  await expect(page.getByRole("dialog", { name: /Chat with Sid/ })).toBeVisible();
};

for (const width of [390, 1440]) {
  test.describe(`chat @ ${width}`, () => {
    test.use({ viewport: { width, height: width === 390 ? 844 : 900 } });

    test("opens, answers a suggested question, links to the right page and closes with Escape", async ({ page }) => {
      const errors = watchErrors(page);
      const seen = await mockChat(page, () => ({ body: price }));
      await page.goto("/about");
      await settle(page);
      await open(page);
      const dialog = page.getByRole("dialog", { name: /Chat with Sid/ });
      await expect(dialog.getByText(/I'm Sid/)).toBeVisible();
      await dialog.getByRole("button", { name: "What do packages cost?" }).click();
      await expect(dialog.getByText(/Launch is £189/)).toBeVisible();
      expect(seen).toEqual(["What do packages cost?"]);
      await expect(dialog.getByRole("link", { name: "See packages and prices" })).toHaveAttribute("href", "/packages");
      await expect(dialog.getByText(/AI can get things wrong/)).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(page.getByRole("button", { name: /Open chat with Sid/ })).toBeFocused();
      await expectNoHorizontalOverflow(page);
      expect(errors).toEqual([]);
    });

    test("typing and Enter sends, Shift+Enter does not, and the action link navigates", async ({ page }) => {
      await mockChat(page, () => ({ body: price }));
      await page.goto("/about");
      await settle(page);
      await open(page);
      const box = page.getByLabel("Message Sid");
      await box.fill("how much");
      await box.press("Shift+Enter");
      await expect(page.getByText("Launch is £189")).toHaveCount(0);
      await box.press("Enter");
      await expect(page.getByText(/Launch is £189/)).toBeVisible();
      await page.getByRole("dialog", { name: /Chat with Sid/ }).getByRole("link", { name: "See packages and prices" }).click();
      await expect(page).toHaveURL(/\/packages$/);
      await expect(page.getByRole("dialog", { name: /Chat with Sid/ })).toBeHidden();
    });

    test("shows a typing indicator, remembers the conversation across pages, and can start again", async ({ page }) => {
      await mockChat(page, () => ({ body: price, delay: 700 }));
      await page.goto("/faq");
      await settle(page);
      await open(page);
      await page.getByLabel("Message Sid").fill("what does it cost");
      await page.getByRole("button", { name: "Send message" }).click();
      await expect(page.getByRole("status").filter({ hasText: "Sid is typing" })).toBeVisible();
      await expect(page.getByText(/Launch is £189/)).toBeVisible();
      await page.getByRole("link", { name: "Packages and prices" }).count();
      await page.goto("/contact");
      await settle(page);
      await open(page);
      await expect(page.getByText(/You: what does it cost/)).toBeVisible();
      await page.getByRole("button", { name: "Start a new chat" }).click();
      await expect(page.getByText(/You: what does it cost/)).toHaveCount(0);
    });

    test("offline and error states are friendly and point to the contact form", async ({ page }) => {
      await mockChat(page, () => ({ status: 503, body: { error: "The chat assistant is offline right now. You can reach the team through the contact form.", offline: true } }));
      await page.goto("/about");
      await settle(page);
      await open(page);
      await page.getByLabel("Message Sid").fill("do you do seo");
      await page.getByRole("button", { name: "Send message" }).click();
      await expect(page.getByText(/offline right now/).first()).toBeVisible();
      await expect(page.getByRole("dialog", { name: /Chat with Sid/ }).getByRole("link", { name: "Use the contact form" })).toBeVisible();
      await expect(page.getByLabel("Message Sid")).toHaveCount(0);
    });

    test("is hidden on payment and onboarding pages", async ({ page }) => {
      await page.goto("/checkout/cancel");
      await settle(page);
      await expect(page.getByRole("button", { name: /Open chat with Sid/ })).toHaveCount(0);
      await page.goto("/onboard");
      await settle(page);
      await expect(page.getByRole("button", { name: /Open chat with Sid/ })).toHaveCount(0);
    });

    test("axe: launcher, open panel with a reply", async ({ page }) => {
      await mockChat(page, () => ({ body: price }));
      await page.goto("/about");
      await settle(page);
      const run = async (label: string) => {
        await page.waitForTimeout(350);
        const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
        expect(r.violations.map((v) => `${v.id}: ${v.nodes[0]?.target.join(" ")}`), label).toEqual([]);
      };
      await run("launcher");
      await open(page);
      await page.getByRole("button", { name: "What do packages cost?" }).click();
      await expect(page.getByText(/Launch is £189/)).toBeVisible();
      await run("open");
    });
  });
}

test("on a phone the panel fills the visible area and keeps the composer visible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 420 }); // roughly what is left with the keyboard open
  await mockChat(page, () => ({ body: price }));
  await page.goto("/about");
  await settle(page);
  await open(page);
  await page.waitForTimeout(400);
  const box = await page.getByRole("dialog", { name: /Chat with Sid/ }).boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(420.5);
  await expect(page.getByLabel("Message Sid")).toBeInViewport();
  await expect(page.getByRole("button", { name: "Close chat" })).toBeInViewport();
});

test("the launcher waits until the cookie notice is dismissed", async ({ page }) => {
  await page.goto("/about");
  await settle(page);
  await expect(page.getByRole("dialog", { name: "Cookie notice" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Open chat with Sid/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Close cookie notice" }).click();
  await expect(page.getByRole("button", { name: /Open chat with Sid/ })).toBeVisible();
});
