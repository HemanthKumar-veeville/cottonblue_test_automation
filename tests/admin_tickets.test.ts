import { Page } from 'playwright';

declare global {
  var __GLOBAL_PAGE__: Page;
}

describe('Admin Portal Tickets Test', () => {
  let page: Page;

  beforeAll(async () => {
    // Get the global page instance that was set up in jest.setup.ts
    page = global.__GLOBAL_PAGE__;
  });

  it('should navigate to tickets page and perform actions', async () => {
    // Change language from French to English
    console.log('Changing language to English...');
    const languageSelector = await page.locator('button[role="combobox"]').first();
    await languageSelector.click();
    await page.waitForTimeout(2000);
    
    const englishOption = await page.locator('div[role="option"]').filter({ hasText: 'English' });
    await englishOption.click();
    await page.waitForTimeout(2000);

    // Wait for language change to take effect
    console.log('Waiting for language change...');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Click on Tickets in the side panel
    console.log('Navigating to tickets page...');
    const ticketsLink = await page.getByRole('link', { name: 'Tickets' });
    await ticketsLink.click();
    await page.waitForTimeout(2000);

    // Wait for tickets page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Verify we're on the tickets page
    expect(page.url()).toContain('/support/tickets');
    await page.waitForTimeout(1000);

    // Verify the presence of ticket-related elements
    const ticketsHeading = await page.getByRole('heading', { name: 'Tickets', exact: true });
    expect(await ticketsHeading.isVisible()).toBe(true);
    await page.waitForTimeout(1000);

    // Verify additional ticket-related elements
    const ticketsInProgress = await page.getByRole('heading', { name: 'Tickets in progress' });
    const closedTickets = await page.getByRole('heading', { name: 'Closed tickets' });
    
    expect(await ticketsInProgress.isVisible()).toBe(true);
    expect(await closedTickets.isVisible()).toBe(true);
    await page.waitForTimeout(1000);

    // Click on the first closed ticket
    console.log('Clicking on first closed ticket...');
    await page.click('div:has-text("#14") >> nth=0');
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Click on Mark as complete button to reopen the ticket
    console.log('Reopening the closed ticket...');
    await page.click('button:has-text("Mark as complete")');
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Click on a ticket with open status
    console.log('Clicking on an open ticket...');
    await page.click('div:has-text("Open") >> nth=0');
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Enter response and send it
    console.log('Entering and sending response...');
    await page.fill('textarea[placeholder="Enter response..."]', 'This is the test reply from automation testing.');
    await page.waitForTimeout(2000);
    await page.click('button:has-text("Send response")');
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Close the ticket dialog
    console.log('Closing ticket dialog...');
    await page.click('button.inline-flex:has(svg.lucide-x)');
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

  }, 360000);
});
