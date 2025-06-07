import { Page } from 'playwright';
import path from 'path';

declare global {
  var __GLOBAL_PAGE__: Page;
}

describe('Admin Add Client Flow', () => {
  let page: Page;

  beforeAll(async () => {
    page = global.__GLOBAL_PAGE__;
  });

  it('should successfully add a new client', async () => {
    // 1. Change Language to English
    console.log('Changing language to English...');
    await page.waitForSelector('button[role="combobox"]', { state: 'visible', timeout: 60000 });
    const languageSelector = await page.locator('button[role="combobox"]').first();
    await languageSelector.click();
    await page.waitForTimeout(2000);
    
    const englishOption = await page.locator('div[role="option"]').filter({ hasText: 'English' });
    await englishOption.click();
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');
    
    // Verify English language is selected
    console.log('Verifying English language...');
    const addClientText = await page.getByRole('link', { name: 'Add Client' });
    expect(await addClientText.isVisible()).toBe(true);
    
    // 2. Navigate to Add Client Page
    console.log('Navigating to Add Client page...');
    await addClientText.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // // 3. Verify Form Fields Availability
    // console.log('Verifying form fields...');
    // const requiredFields = [
    //   { selector: '[data-testid="input-client-name"]', label: 'Client name field' },
    //   { selector: '[data-testid="input-brand-logo"]', label: 'File upload field' },
    //   { selector: '[data-testid="color-input-background"]', label: 'Background color field' },
    //   { selector: '[data-testid="color-input-text"]', label: 'Text color field' },
    //   { selector: '[data-testid="input-postal-code"]', label: 'Postal code field' },
    //   { selector: '[data-testid="input-city"]', label: 'City field' },
    //   { selector: '[data-testid="input-address"]', label: 'Address field' },
    //   { selector: '[data-testid="input-address-comment"]', label: 'Address comment field' },
    //   { selector: '[data-testid="input-validation-email"]', label: 'Admin email field' },
    //   { selector: '[data-testid="input-admin-mobile"]', label: 'Client mobile field' },
    //   { selector: '[data-testid="input-client-email"]', label: 'Client email field' }
    // ];

    // for (const field of requiredFields) {
    //   console.log(`Checking ${field.label}...`);
    //   const element = await page.locator(field.selector);
    //   await element.waitFor({ state: 'visible', timeout: 30000 });
    //   expect(await element.isVisible()).toBe(true);
    //   expect(await element.isEnabled()).toBe(true);
    // }

    // 4. Fill Client Details
    console.log('Filling client details...');
    await page.fill('[data-testid="input-client-name"]', 'Blue Widgets Ltd.');
    
    // Upload logo
    console.log('Uploading brand logo...');
    const fileInput = await page.locator('[data-testid="input-brand-logo"]');
    await fileInput.setInputFiles(path.join(__dirname, '../test-assets/logo.png'));
    await page.waitForTimeout(2000);
    
    // Set and verify brand colors
    console.log('Setting brand colors...');
    await page.fill('[data-testid="color-input-background"]', '#32486B');
    await page.fill('[data-testid="color-input-text"]', '#FFFFFF');
    
    // // Verify contrast indicators
    // console.log('Verifying contrast indicators...');
    // const minContrast = await page.locator('text=Minimum contrast');
    // const optContrast = await page.locator('text=Optimal contrast');
    // await minContrast.waitFor({ state: 'visible', timeout: 30000 });
    // await optContrast.waitFor({ state: 'visible', timeout: 30000 });
    // expect(await minContrast.getAttribute('class')).toContain('success');
    // expect(await optContrast.getAttribute('class')).toContain('success');
    
    // 5. Fill Location and Contact Details
    console.log('Filling location and contact details...');
    const contactFields = [
      { selector: '[data-testid="input-postal-code"]', value: '12345' },
      { selector: '[data-testid="input-city"]', value: 'Paris' },
      { selector: '[data-testid="input-address"]', value: '123 Rue Lafayette' },
      { selector: '[data-testid="input-address-comment"]', value: 'Building number 2' },
      { selector: '[data-testid="input-validation-email"]', value: 'admin@bluewidgets.com' },
      { selector: '[data-testid="input-admin-mobile"]', value: '+33123456789' },
      { selector: '[data-testid="input-client-email"]', value: 'info@bluewidgets.com' }
    ];

    for (const field of contactFields) {
      await page.fill(field.selector, field.value);
      await page.waitForTimeout(500);
    }

    // 6. Form Review and Submission
    console.log('Reviewing and submitting the form...');
    const addClientButton = await page.locator('[data-testid="button-submit"]');
    await addClientButton.waitFor({ state: 'visible', timeout: 30000 });
    expect(await addClientButton.isEnabled()).toBe(true);
    await addClientButton.click();
    await page.waitForLoadState('networkidle');
    
  }, 360000);
});
