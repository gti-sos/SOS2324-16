// @ts-check
const { test, expect } = require('@playwright/test');

test('List players', async ({ page }) => {
  await page.goto('http://localhost:10000');

  await page.getByRole('navigation').getByRole('link', { name: 'Jugadoras voleibol' }).click();
  
  await page.waitForTimeout(10000);

  let personCount = (await page.getByRole('listitem').all()).length;
  await expect(personCount).toBeGreaterThan(0);
});

test('Create a new player', async ({ page }) => {
  await page.goto('http://localhost:10000');

  await page.getByRole('navigation').getByRole('link', { name: 'Jugadoras voleibol' }).click();

  await page.getByRole('button', { name: 'Crear jugadora volleyball'}).click();
  let messageNewPerson = (await page.getByText('Jugadora creada correctamente'));
  
  await expect(messageNewPerson).toBeVisible();
});

test('Delete a player', async ({ page }) => {
  await page.goto('http://localhost:10000');

  await page.getByRole('navigation').getByRole('link', { name: 'Jugadoras voleibol' }).click();

  await page.locator('ul > li > button').first().click();

  let messageDeletedPerson = (await page.getByText('Jugadora borrada correctamente'));
  
  await expect(messageDeletedPerson).toBeVisible();
});

test('Delete all', async ({ page }) => {
  await page.goto('http://localhost:10000');

  await page.getByRole('navigation').getByRole('link', { name: 'Jugadoras voleibol' }).click();
  await page.waitForTimeout(10000);

  await page.getByRole('button', { name: 'Limpiar lista'}).click();

  let messageDeletedPerson = (await page.getByText('Todas las jugadoras borradas correctamente'));

  await expect(messageDeletedPerson).toBeVisible();
});