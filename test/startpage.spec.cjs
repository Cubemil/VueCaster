const { test, expect } = require('@playwright/test');

test('Open the start page', async ({ page }) => {
    await page.goto('http://localhost:8080/home');	
    expect(await page.title()).toBe('WMP');
});
