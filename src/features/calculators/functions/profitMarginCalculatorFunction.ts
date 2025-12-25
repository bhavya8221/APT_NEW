// ----------------------------------------------------
// Pure Calculation Functions
// ----------------------------------------------------

function calculateNetProfitMargin(revenue: number, cost: number): number {
  const netProfit = revenue - cost;
  return (netProfit / revenue) * 100;
}

function calculateProfitPercentage(netProfit: number, cost: number): number {
  return (netProfit / cost) * 100;
}

// ----------------------------------------------------
// Exported Function + Types
// ----------------------------------------------------

export interface ProfitMarginResult {
  netProfitMargin: string;
  netProfit: string;
  profitPercentage: string;
}

export function profitMarginCalculator(
  revenueInput: number | string,
  costInput: number | string
): ProfitMarginResult | null {
  const revenue = Number(revenueInput);
  const cost = Number(costInput);

  // -----------------------------
  // Validation
  // -----------------------------
  if (!revenue || revenue <= 0) return null;
  if (!cost || cost <= 0) return null;

  const netProfit = revenue - cost;
  const netProfitMargin = calculateNetProfitMargin(revenue, cost);
  const profitPercentage = calculateProfitPercentage(netProfit, cost);

  return {
    netProfitMargin: netProfitMargin.toFixed(2),
    netProfit: netProfit.toFixed(2),
    profitPercentage: profitPercentage.toFixed(2),
  };
}
