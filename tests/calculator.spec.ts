import { test, expect } from '@playwright/test';

test('Dropshipping Calculator Functionality with Shadcn UI', async ({ page }) => {
  // 1. Start application
  await page.goto('http://localhost:5179');

  // 2. Verify initial state of result panel (gray background)
  // We look for the Card that contains "Resultado da Precificação"
  const resultCard = page.locator('.shadow-xl', { hasText: 'Resultado da Precificação' });
  await expect(resultCard).toHaveClass(/bg-gray-500/);
  await expect(resultCard).not.toHaveClass(/from-green-600/);

  // 3. Fill Cost Price to activate calculation
  // Shadcn Input is a standard input, can use fill
  await page.fill('input[id="costPrice"]', '50');

  // 4. Verify panel color change (to green gradient)
  await expect(resultCard).toHaveClass(/bg-gradient-to-br/);
  await expect(resultCard).toHaveClass(/from-green-600/);
  await expect(resultCard).toHaveClass(/to-emerald-600/);

  // 5. Test Marketplace Selection (Shadcn Select)
  // Initially Shopee. Change to Mercado Livre then back to Shopee to test interaction?
  // Or just verify Shopee elements are present.
  // Let's test interaction: Open Marketplace Select
  // The label is "Marketplace", the trigger is below it.
  const marketplaceTrigger = page.locator('button[role="combobox"]').filter({ hasText: 'Shopee' }).first();
  await expect(marketplaceTrigger).toBeVisible();
  
  // 6. Test Category Selection (Shadcn Select)
  // Label "Categoria (Estimativa de CPC)"
  // Trigger should show "Eletrônicos" initially
  const categoryTrigger = page.locator('button[role="combobox"]').filter({ hasText: 'Eletrônicos' });
  await categoryTrigger.click();
  
  // Select "Moda e Acessórios" from the dropdown content
  await page.getByRole('option', { name: 'Moda e Acessórios' }).click();

  // 7. Activate Shopee Ads (Shadcn Checkbox)
  // Label "Calcular Shopee Ads"
  const adsCheckbox = page.getByRole('checkbox', { name: 'Calcular Shopee Ads' });
  await adsCheckbox.click();

  // 8. Verify Inputs update based on category
  // Moda: CPC 0.35, CR 2.5
  // We need to wait a bit for state update if necessary, but React is fast.
  // We look for inputs inside the ads section.
  // We can find them by value or placeholder.
  const cpcInput = page.locator('input[placeholder="0.40"]'); // Placeholder is static, value changes
  const crInput = page.locator('input[placeholder="1.5"]');

  await expect(cpcInput).toHaveValue('0.35');
  await expect(crInput).toHaveValue('2.5');

  // 9. Verify CPA Calculation
  // CPC 0.35 / (2.5% / 100) = 14.00
  await expect(page.getByText('CPA (Custo por Aquisição)')).toBeVisible();
  await expect(page.getByText('R$ 14.00', { exact: true })).toBeVisible();

  // 10. Verify Mercado Livre Table
  await expect(page.getByText('Tabela de Margem Recomendada (Mercado Livre)')).toBeVisible();

  console.log('All Shadcn UI tests passed successfully!');
});
