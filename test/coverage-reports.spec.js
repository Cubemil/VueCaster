const { test, expect } = require('@playwright/test');
const MCR = require('monocart-coverage-reports');

test('has title', async ({ page }) => {
    await page.coverage.startJSCoverage({
        resetOnNavigation: false
    });
    await page.goto('https: playwright.dev/');

    const jsCoverage = await page.coverage.stopJSCoverage();
    const coverageData = [ jsCoverage];

    const coverageReport = MCR({
        name: 'My Coverage Report',
        outputDir: './coveragereports',
        reports: ['v8', 'consoledetails']
    });

    await coverageReport.add(coverageData);
    await coverageReport.generate();

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);
});