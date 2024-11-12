// To Run: npx playwright test test/lightmode.spec.js
// import test, expect = Playwright test runner APIs
const { test, expect } = require('@playwright/test');

// test = test case
// expect = assertion library
// page = browser context
// arrow function = async function, because Playwright APIs are async
test('Switch to light mode', async ({ page }) => {
    // goto = navigates to a URL
    await page.goto('https://playwright.dev/');

    // adding a pause here before clicking the button to visually inspect the browser
    // pause = pauses the test execution
    await page.pause();
    await page.waitForTimeout(3000); // Temporary delay for debugging

    // [] = attribute selector
    await page.click('button[title="Switch between dark and light mode (currently dark mode)"]');
    await page.waitForTimeout(1000); // Temporary delay for debugging

    const currentColor = await page.locator('nav').evaluate((element) => {
        return window.getComputedStyle(element).backgroundColor;
    });
    console.log('Current Navbar Color:', currentColor);

    // Wait for the mode change to reflect in the DOM
    // waitForFunction = waits for a function to return a truthy value
    await page.waitForFunction(() => {
        return window.getComputedStyle(document.querySelector('nav')).backgroundColor === 'rgb(255, 255, 255)';
    });

    // locator = selects the element on the page via a CSS selector
    // evaluate = runs a function in the browser
    // getComputedStyle = gets the computed style of an element
    const navBackgroundColor = await page.locator('nav').evaluate((element) => {
        return window.getComputedStyle(element).backgroundColor; 
    });

    // expect = assertions
    // toBe = matching condition
    expect(navBackgroundColor).toBe('rgb(255, 255, 255)');
});