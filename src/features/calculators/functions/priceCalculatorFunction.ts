// ---------------------------------------------
// Pure Calculation Helpers
// ---------------------------------------------

function calculateSellingPrice(
  cost: number,
  grossMarginDecimal: number
): number {
  return cost / (1 - grossMarginDecimal);
}

function calculateGrossProfit(
  revenue: number,
  grossMarginDecimal: number
): number {
  return revenue * grossMarginDecimal;
}

function calculateMarkupPercentage(grossProfit: number, cost: number): number {
  return (grossProfit / cost) * 100;
}

// ---------------------------------------------
// Exported Function + Types
// ---------------------------------------------

export interface PriceCalcResult {
  R: string; // Revenue / Selling Price
  P: string; // Gross Profit
  M: string; // Markup %
}

export function priceCalculator(
  costInput: string | number,
  grossMarginInput: string | number
): PriceCalcResult | null {
  const cost = Number(costInput);
  const marginPercent = Number(grossMarginInput);

  // -----------------------------
  // Validation
  // -----------------------------
  if (!cost || cost <= 0) return null;
  if (!marginPercent || marginPercent <= 0 || marginPercent >= 100) return null;

  // Convert % to decimal
  const margin = marginPercent / 100;

  // -----------------------------
  // Calculations
  // -----------------------------
  const revenue = calculateSellingPrice(cost, margin);
  const grossProfit = calculateGrossProfit(revenue, margin);
  const markup = calculateMarkupPercentage(grossProfit, cost);

  return {
    R: revenue.toFixed(2),
    P: grossProfit.toFixed(2),
    M: markup.toFixed(2),
  };
}
