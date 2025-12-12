import { test, expect } from '@playwright/test';

test('Verify New Features: Markup, Extra Commission, and Low Price Fee', async ({ page }) => {
  await page.goto('http://localhost:5179');

  // 1. Verify Markup Label rename
  await expect(page.getByText('Markup', { exact: true })).toBeVisible();
  await expect(page.getByText('Markup Multiplicador')).not.toBeVisible();

  // 2. Verify Default Markup is 1.5x
  // The Select value isn't directly visible as text unless opened, but we can check the calculation.
  // Set Cost = 100.
  await page.fill('input[id="costPrice"]', '100');
  // Default Markup 1.5x -> Suggested Price = 150.
  // Use specific locator for the price result
  await expect(page.locator('p.text-4xl')).toContainText('R$ 150.00');

  // 2. Test Extra Commission
  // Note: Default marketplace is Mercado Livre. We must switch to Shopee to see "Comissões Extras" input.
  const marketplaceTrigger = page.getByRole('combobox').filter({ hasText: 'Mercado Livre' });
  if (await marketplaceTrigger.isVisible()) {
      await marketplaceTrigger.click();
      await page.getByRole('option', { name: 'Shopee' }).click();
  }

  // Add 10% extra.
  // We need to find the input for "Comissões Extras (%)"
  await page.fill('input[placeholder="0"]', '10');
  
  // Check Tax Description update
  // Should see "+ 10% (Extra)"
  await expect(page.getByText('10% (Extra)')).toBeVisible();

  // Check Calculation
  // Price = 150.
  // Shopee Fees: 14 + 6 + 10 = 30%.
  // Fixed Fee: R$ 4 (Price > 8).
  // Total Fees: 150 * 0.30 + 4 = 45 + 4 = 49.
  await expect(page.getByText('- R$ 49.00')).toBeVisible();

  // 4. Test Low Price Logic (< R$8)
  // Set Cost = 2.
  // Set Markup = 2.0x (Select "2.0x")
  
  // Clear Extra Commission first
  await page.fill('input[placeholder="0"]', '0');
  
  await page.fill('input[id="costPrice"]', '2');
  
  // Open Markup Select
  await page.locator('button:has-text("1.5x")').click(); // Current value is 1.5x
  await page.getByRole('option', { name: '2.0x' }).click();
  
  // Suggested Price = 2 * 2 = 4.00.
  await expect(page.locator('p.text-4xl')).toContainText('R$ 4.00');
  
  // Fixed Fee should be 50% of 4.00 = 2.00.
  // Check "Taxa Fixa" row in the results
  // Use a more specific locator to avoid confusion with the input label
  const resultCard = page.locator('.shadow-xl', { hasText: 'Resultado da Precificação' });
  await expect(resultCard.getByText('- R$ 2.00')).toBeVisible();
  
  // Check Tax Description has "R$4,00 (Tarifa Fixa)" static text?
  // No, the logic I wrote was:
  // taxDescription = ... + R$4,00 (Tarifa Fixa)
  // Even if the applied fee is dynamic, the description text I hardcoded as "R$4,00".
  // The user asked to add "(Tarifa Fixa)" to the text, implying the text is static description of the rule.
  // But the calculation (Fixed Fee row) should show the actual applied fee.
  // My test checks the "Taxa Fixa" row value, which is correct.

});
