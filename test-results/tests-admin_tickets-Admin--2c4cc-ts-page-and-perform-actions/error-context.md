# Test info

- Name: Admin Portal Tickets Test >> should navigate to tickets page and perform actions
- Location: C:\Users\User\hemanth\cotton_blue_saas_admin_test\tests\admin_tickets.test.ts:25:7

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "YOUR_APP_URL", waiting until "load"

    at C:\Users\User\hemanth\cotton_blue_saas_admin_test\tests\admin_tickets.test.ts:18:16
```

# Test source

```ts
   1 | import { test, expect, chromium, Browser, Page } from '@playwright/test';
   2 |
   3 | test.describe('Admin Portal Tickets Test', () => {
   4 |   let browser: Browser;
   5 |   let page: Page;
   6 |
   7 |   test.beforeAll(async () => {
   8 |     browser = await chromium.launch();
   9 |   });
  10 |
  11 |   test.afterAll(async () => {
  12 |     await browser.close();
  13 |   });
  14 |
  15 |   test.beforeEach(async () => {
  16 |     page = await browser.newPage();
  17 |     // Navigate to your application URL
> 18 |     await page.goto('YOUR_APP_URL'); // Replace with your actual application URL
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  19 |   });
  20 |
  21 |   test.afterEach(async () => {
  22 |     await page.close();
  23 |   });
  24 |   
  25 |   test('should navigate to tickets page and perform actions', async () => {
  26 |     // Change language from French to English
  27 |     console.log('Changing language to English...');
  28 |     await page.click('button[role="combobox"]:has(span:first-child)');
  29 |     await page.click('div[role="option"]:has-text("English")');
  30 |
  31 |     // Wait for language change to take effect
  32 |     console.log('Waiting for language change...');
  33 |     await page.waitForLoadState('networkidle');
  34 |
  35 |     // Click on Tickets in the side panel
  36 |     console.log('Navigating to tickets page...');
  37 |     await page.click('a[href="/support/tickets"]');
  38 |
  39 |     // Wait for tickets page to load
  40 |     await page.waitForLoadState('networkidle');
  41 |
  42 |     // Verify we're on the tickets page
  43 |     expect(page.url()).toContain('/support/tickets');
  44 |
  45 |     // Verify the presence of ticket-related elements
  46 |     const ticketsHeading = await page.locator('text=Tickets');
  47 |     expect(await ticketsHeading.isVisible()).toBe(true);
  48 |
  49 |     // Note: Removed the 5-minute wait as it's generally not a good practice
  50 |     // If you need to wait for something specific, use explicit waits instead
  51 |   });
  52 | });
  53 |
```