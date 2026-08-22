import { expect, test } from "@playwright/test";

test("home page loads and identifies RISC", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /RISC/i }),
  ).toBeVisible();
});
