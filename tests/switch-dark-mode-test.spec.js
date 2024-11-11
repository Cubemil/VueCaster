const { test, expect } = require('@playwright/test');

test('switch dark mode', async ({ page }) => {
    await page.goto('https: playwright.dev/');

    await expect(page).toHaveTheme('light');
    await page.click('button:has-text("Toggle dark mode")');
    await expect(page).toHaveTheme('dark');
});