const { test, expect } = require('@playwright/test');
//[1]
test.describe('SauceDemo Tests', () => {
  test('Verify Z-A sorting order', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // Login with standard user credentials
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Get the initial product names
    const initialProductNames = await page.$$eval('.inventory_item_name', (elements) =>
      elements.map((el) => el.textContent.trim())
    );

    // Click on the "Sort By" dropdown (assuming data-test ID)
    await page.getByText('Name (A to Z)Name (A to Z)').click();
    await page.locator('[data-test="product-sort-container"]').selectOption('za');

    // Wait for the sorting to complete (optional)
    await page.waitForTimeout(2000); // Adjust timeout if needed

     // Get the product names after sorting
    const sortedProductNames = await page.$$eval('.inventory_item_name', (elements) =>
      elements.map((el) => el.textContent)
    );

    // Assert that the products are sorted in descending alphabetical order
    expect(sortedProductNames).toEqual(initialProductNames.sort().reverse());
    
  });
//CP//
 
   //2
   test('Verify price order high to low', async ({ page }) => {
    // ... (previous steps to navigate and sort the products) ...
  
    const initialProductPrices = await page.$$eval('.product-price', (elements) => 
      elements.map((element) => parseFloat(element.textContent.replace('$', ''))) 
    );
  
    const sortedProductPrices = await page.$$eval('.product-price', (elements) => 
      elements.map((element) => parseFloat(element.textContent.replace('$', ''))) 
    );
  
    // Assert that the products are sorted in descending price order
    expect(sortedProductPrices).toEqual(initialProductPrices.sort((a, b) => b - a));
  });
   //2
  
//[3]
  test('Add items to cart and checkout', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // Login with standard user credentials
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();


    // Add two items to the cart 
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
   
    // Verify cart badge shows 2 items
    const cartBadge = await page.locator('[data-test="shopping-cart-link"]');
    await expect(cartBadge).toHaveText('2');

    // Click on the shopping cart icon
    await page.locator('[data-test="shopping-cart-link"]').click();

    // Verify two items are listed in the cart
    const cartItems = await page.$$eval('.cart_item', (elements) => elements.length);
    await expect(cartItems).toBe(2);

    // Proceed to checkout
    await page.locator('[data-test="checkout"]').click();

    // Fill out checkout information (replace with your details)
    await page.locator('#first-name').fill('Sadanand');
    await page.locator('#last-name').fill('Potdukhe');
    await page.locator('#postal-code').fill('12345');

    // Click on the "Continue" button
    await page.locator('[data-test="continue"]').click();

    // Verify overview page shows two items
    const overviewItems = await page.$$eval('.cart_item', (elements) => elements.length);
    await expect(overviewItems).toBe(2);

    // Click on the "Finish" button to complete checkout
    await page.locator('[data-test="finish"]').click();

    // Add assertions for successful checkout completion
     const orderMsg =await page.locator('.complete-header').textContent()
     expect(orderMsg).toContain('Thank you for your order!')
     const completeMsg= await page.locator('.title').textContent()
     expect(completeMsg).toContain('Checkout: Complete!')
  });
});