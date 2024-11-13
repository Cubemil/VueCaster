const { test, expect } = require('@playwright/test');

test('Open start page', async ({ page }) => {
    await page.goto('http://localhost:8080');
    expect(await page.title()).toBe('WMP');
});

