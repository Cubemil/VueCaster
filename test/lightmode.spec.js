const { test, expect } = require('@playwright/test');

test('Switch to light mode', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // [] = attribute selector
    await page.click('button[title="Switch between dark and light mode (currently dark mode)"]');

    // locator = selects the element on the page via a CSS selector
    // evaluate = runs a function in the browser
    // getComputedStyle = gets the computed style of an element
    const navBackgroundColor = await page.locator('nav').evaluate((element) => {
       return window.getComputedStyle(element).backgroundColor; 
    });

    // short pause to wait for mode switch
    await page.waitForTimeout(500);

    // expect = assertions
    // toBe = matching condition
    expect(navBackgroundColor).toBe('rgb(255, 255, 255)');
});