import { test, expect } from '@playwright/test';

test('has username input', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page.getByTestId('username-input')).toBeVisible();
});

test('signup successfully', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  
  await page.getByTestId('username-input').fill('testuser');
  await page.getByTestId('password-input').fill('password123');
  await page.getByText('Sign up').click();

  await expect(page.getByTestId('welcome-message')).toContainText('Welcome, testuser!');
});

test('signup with invalid username', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByTestId('username-input').fill('1');
  await page.getByTestId('password-input').fill('password123');
  await page.getByTestId('signup-button').click();

  await expect(page.getByTestId('auth-error')).toBeVisible();
  await expect(page.getByTestId('auth-error')).toContainText('Username must be between 3 and 32 characters');
});
