import { test, expect } from '@playwright/test';

test('test route to search view', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: ' Search' }).click();

  await expect(page.getByLabel('Next page')).toBeVisible();
  await expect(page.getByLabel('Previous page')).toBeVisible();
});

test('test search bar and navigation visibility', async ({ page }) => {
  await page.goto('/search');

  await expect(page.getByLabel('Next page')).toBeVisible();
  await expect(page.getByLabel('Previous page')).toBeVisible();

  await expect(page.locator('#searchbar-container')).toBeVisible();
});

test('test search bar placeholder', async ({ page }) => {
  await page.goto('/search');

  await expect(page.getByPlaceholder('What do you want to play?')).toBeEmpty();
});

test('test search view categories visibility', async ({ page }) => {
  await page.goto('/search');

  await expect(page.locator('#search-view-container')).toMatchAriaSnapshot(`
    - button "Previous page"
    - button "Next page"
    - text: 
    - textbox "What do you want to play?"
    - heading "Arts" [level=2]
    - heading "Business" [level=2]
    - heading "Comedy" [level=2]
    - heading "Education" [level=2]
    - heading "Fiction" [level=2]
    - heading "Government" [level=2]
    - heading "History" [level=2]
    - heading "Health & Fitness" [level=2]
    - heading "Kids & Family" [level=2]
    - heading "Leisure" [level=2]
    - heading "Music" [level=2]
    - heading "Religion & Spirituality" [level=2]
    - heading "Science" [level=2]
    - heading "Society & Culture" [level=2]
    - heading "Sports" [level=2]
    - heading "Technology" [level=2]
    - heading "True Crime" [level=2]
    - heading "TV & Film" [level=2]
  `);
});

test('test search query', async ({ page }) => {
  await page.goto('/search');

  await page.getByPlaceholder('What do you want to play?').click();
  await page.getByPlaceholder('What do you want to play?').fill('Gaming');

  await page.getByLabel('Perform search').click();

  await page.waitForSelector('#podcast-list', { timeout: 20000 });

  const podcastItems = await page.locator('#podcast-list').locator('div').count();
  expect(podcastItems).toBeGreaterThan(0);

  await expect(page.locator('div').filter({ hasText: /^1\/4$/ })).toBeVisible();
});

test('test category search', async ({ browser }) => {
  // browser here since we need to set localStorage
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.addInitScript(() => {
    localStorage.setItem(
      'categories',
      JSON.stringify([
        { id: 1, name: 'Business' },
        { id: 2, name: 'Arts' },
        { id: 3, name: 'Sports' },
      ])
    );
  });

  await page.goto('/search');

  await page.locator('div').filter({ hasText: /^Business$/ }).click();

  // long timeout cuz feed takes a while sometimes
  await page.waitForSelector('#podcast-list', { timeout: 30000 });

  // checks that podcast lists gets populated and displayed
  const podcastItems = await page.locator('#podcast-list').locator('div').count();
  expect(podcastItems).toBeGreaterThan(0);

  // checks pagination and loading icon
  await expect(page.locator('div').filter({ hasText: /^1\/4$/ })).toBeVisible();
  await expect(page.locator('#loading-spinner')).toBeHidden();
});
