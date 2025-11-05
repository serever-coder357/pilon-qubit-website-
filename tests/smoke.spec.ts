import { test, expect } from '@playwright/test';

test('homepage loads and nav works', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Quantum-grade strategy/i })).toBeVisible();
  await page.getByRole('link', { name: /Services/i }).click();
  await expect(page.locator('#services')).toBeInViewport();
  await page.getByRole('link', { name: /About/i }).click();
  await expect(page.locator('#about')).toBeInViewport();
  await page.getByRole('link', { name: /Contact/i }).click();
  await expect(page.locator('#contact')).toBeInViewport();
});

test('contact form validates and submits mock', async ({ page }) => {
  await page.goto('/#contact');
  await page.getByLabel('Your name').fill('Test User');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Message').fill('Hello from Playwright');
  const [req] = await Promise.all([
    page.waitForRequest('**/api/contact'),
    page.getByRole('button', { name: /Send message/i }).click()
  ]);
  expect(req.url()).toContain('/api/contact');
});
