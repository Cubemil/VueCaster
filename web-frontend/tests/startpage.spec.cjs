const { test, expect } = require('@playwright/test');

test('start page has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/WMP/);
});