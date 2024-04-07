// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('localhost:10000/cause-of-deaths');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/SOS2324-21/);
});

test('list cause of deaths', async ({ page }) => {
  //await page.goto('http://localhost:10000/api/v1/cause-of-deaths/loadInitialData');
  await page.goto('http://localhost:10000/cause-of-deaths');

  //await page.waitForTimeout(2000);

  // Expects the number of reports to be more than 0
  let deathsCount =  (await page.locator('.listItem').all()).length;  
  expect(deathsCount).toBeGreaterThan(0);
});