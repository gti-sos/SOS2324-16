// @ts-check
const { test, expect } = require('@playwright/test');

test('List players', async ({ page }) => {
  await page.goto('http://localhost:10000');

  await page.getByRole('navigation').getByRole('link', { name: 'Jugadores fútbol' }).click();
  
  await page.waitForTimeout(2000);

  let personCount = (await page.getByRole('listitem').all()).length;
  await expect(personCount).toBeGreaterThan(0);
});

test('Create a new player', async ({ page }) => {
  await page.goto('http://localhost:10000');

  await page.getByRole('navigation').getByRole('link', { name: 'Jugadores fútbol' }).click();

  await page.getByRole('button', { name: 'Crear jugador de fútbol'}).click();
  let messageNewPerson = (await page.getByText('Jugador creado correctamente'));
  
  await expect(messageNewPerson).toBeVisible();
});

test('Delete a player', async ({ page }) => {
  await page.goto('http://localhost:10000');

  await page.getByRole('navigation').getByRole('link', { name: 'Jugadores fútbol' }).click();

  await page.locator('ul > li > button').first().click();

  let messageDeletedPerson = (await page.getByText('Jugador borrado correctamente'));
  
  await expect(messageDeletedPerson).toBeVisible();
});

test('Delete all', async ({ page }) => {
  await page.goto('http://localhost:10000');

  await page.getByRole('navigation').getByRole('link', { name: 'Jugadores fútbol' }).click();
  await page.waitForTimeout(2000);

  await page.getByRole('button', { name: 'Limpiar lista'}).click();

  let messageDeletedPerson = (await page.getByText('Todos los jugadores borrados correctamente'));
  
  await expect(messageDeletedPerson).toBeVisible();
});