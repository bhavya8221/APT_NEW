// ---------------------------------------------
// Pure helper functions
// ---------------------------------------------

function calculateMarkupPercentage(cost: number, revenue: number): number {
  const profit = revenue - cost;
  return (profit / cost) * 100;
}

function calculateGrossMarginPercentage(cost: number, revenue: number): number {
  const profit = revenue - cost;
  return (profit / revenue) * 100;
}

function calculateGrossProfit(cost: number, revenue: number): number {
  return revenue - cost;
}

// ---------------------------------------------
// Main Exported Function
// ---------------------------------------------

export interface MarginCalcResult {
  M: string; // Markup %
  G: string; // Gross margin %
  P: string; // Gross profit $
}

export function marginCalculator(
  costInput: number | string,
  revenueInput: number | string
): MarginCalcResult | null {
  const cost = Number(costInput);
  const revenue = Number(revenueInput);

  // Validate inputs
  if (!cost || !revenue || cost <= 0 || revenue <= 0) {
    return null;
  }

  const markup = calculateMarkupPercentage(cost, revenue);
  const margin = calculateGrossMarginPercentage(cost, revenue);
  const profit = calculateGrossProfit(cost, revenue);

  return {
    M: markup.toFixed(2),
    G: margin.toFixed(2),
    P: profit.toFixed(2),
  };
}
