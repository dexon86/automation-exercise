import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function globalSetup(): Promise<void> {
  const storageStatePath = path.join(__dirname, '.auth', 'user.json');
  const authDir = path.dirname(storageStatePath);

  // Ensure .auth directory exists
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the base URL to establish a session
  const baseURL = process.env.BASE_URL || 'https://automationexercise.com';
  await page.goto(baseURL);

  // Save storage state for reuse across tests
  await context.storageState({ path: storageStatePath });
  await browser.close();

  console.log('✓ Global setup complete: storage state saved');
}

export default globalSetup;
