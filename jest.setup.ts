import { Browser, Page, chromium } from 'playwright';

declare global {
  var __GLOBAL_BROWSER__: Browser;
  var __GLOBAL_PAGE__: Page;
}

jest.setTimeout(30000);

beforeAll(async () => {
  // Launch browser
  global.__GLOBAL_BROWSER__ = await chromium.launch({
    headless: true
  });
  const context = await global.__GLOBAL_BROWSER__.newContext({
    ignoreHTTPSErrors: true,
    viewport: {
      width: 1280,
      height: 720
    }
  });
  global.__GLOBAL_PAGE__ = await context.newPage();

  // Enable console logging
  global.__GLOBAL_PAGE__.on('console', msg => console.log('Browser console:', msg.text()));
  
  // Navigate to the login page
  console.log('Navigating to login page...');
  await global.__GLOBAL_PAGE__.goto('https://admin.cottonblue.ddnsfree.com', { 
    waitUntil: 'networkidle' 
  });
  console.log('Page loaded');

  // Wait for and verify login form elements
  console.log('Waiting for login form elements...');
  await global.__GLOBAL_PAGE__.waitForSelector('input[type="email"]', { state: 'visible', timeout: 60000 });
  await global.__GLOBAL_PAGE__.waitForSelector('input[type="password"]', { state: 'visible', timeout: 60000 });
  const submitButton = await global.__GLOBAL_PAGE__.waitForSelector('button[type="submit"]', { state: 'visible', timeout: 60000 });
  console.log('Login form elements found');

  // Fill in login credentials
  console.log('Filling login credentials...');
  await global.__GLOBAL_PAGE__.fill('input[type="email"]', 'contact@himyt.com');
  await global.__GLOBAL_PAGE__.fill('input[type="password"]', 'Abraham@2025');
  console.log('Credentials filled');

  // Wait for login button to be enabled and click
  console.log('Waiting for login button to be enabled...');
  await global.__GLOBAL_PAGE__.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 60000 });
  await submitButton?.click();
  console.log('Login button clicked');

  // Wait for navigation and API calls to complete
  console.log('Waiting for navigation after login...');
  await global.__GLOBAL_PAGE__.waitForLoadState('networkidle');
  console.log('Navigation complete');

  // Wait a bit for the dashboard to fully load
  await global.__GLOBAL_PAGE__.waitForTimeout(5000);
});

afterAll(async () => {
  if (global.__GLOBAL_PAGE__) {
    // Try to find and click logout button
    console.log('Searching for logout button...');
    try {
      // Try multiple possible selectors
      const logoutButton = await global.__GLOBAL_PAGE__.waitForSelector([
        'button:has-text("Déconnexion")',
        'button:has-text("Logout")',
        'button:has-text("Log out")',
        'a:has-text("Logout")',
        'a:has-text("Log out")',
        '[data-testid="logout-button"]',
        '.logout-button',
        '#logout',
        'button[aria-label="Logout"]',
        'button[title="Logout"]',
        'button[title="Log out"]'
      ].join(','), { 
        state: 'visible',
        timeout: 60000 
      });

      if (logoutButton) {
        console.log('Logout button found, clicking...');
        await logoutButton.click();
        console.log('Logout button clicked');

        // Wait for logout to complete
        await global.__GLOBAL_PAGE__.waitForLoadState('networkidle');
        console.log('Logout complete');
      }
    } catch (error) {
      console.error('Error finding logout button:', error);
    }

    // Close page and browser
    await global.__GLOBAL_PAGE__.close();
  }
  if (global.__GLOBAL_BROWSER__) {
    await global.__GLOBAL_BROWSER__.close();
  }
}); 