// ---------------------------------------------------------
// Types
// ---------------------------------------------------------
export interface SellingPriceResult {
  answer: {
    sellingPrice: string;
  };
  summaryOfValues: {
    itemCost: number;
    shippingCost: number;
    sellingCost: string;
    transactionCost: string;
    cost: string;
    revenue: string;
    profit: string;
    margin: number;
    markup: number;
  };
  invoiceForBuyer: {
    itemPrice: string;
    shipping: number;
    subTotal: string;
    total: string;
  };
}

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------
const toNum = (n: any) => {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
};

// ---------------------------------------------------------
// MAIN FUNCTION
// ---------------------------------------------------------
export function sellingPriceCalculator(
  targetProfitAmount: number = 0,
  targetMarginPercentage: number = 0,
  targetMarkupPercentage: number = 0,
  itemCostAmount: number = 0,
  shippingCostAmount: number = 0,
  shippingChargeAmount: number = 0,
  sellingFeePercentage: number = 0,
  sellingFeeFixedAmount: number = 0,
  transactionFeePercentage: number = 0,
  transactionFeeFixedAmount: number = 0
): SellingPriceResult | null {
  // ---------------------------------------------------------
  // Parse/validate numbers
  // ---------------------------------------------------------
  const costItem = toNum(itemCostAmount);
  const shipCost = toNum(shippingCostAmount);
  const shipCharge = toNum(shippingChargeAmount);
  const saleFeePct = toNum(sellingFeePercentage);
  const saleFeeFixed = toNum(sellingFeeFixedAmount);
  const txnFeePct = toNum(transactionFeePercentage);
  const txnFeeFixed = toNum(transactionFeeFixedAmount);

  const targetProfit = toNum(targetProfitAmount);
  let marginPct = toNum(targetMarginPercentage);
  let markupPct = toNum(targetMarkupPercentage);

  if (costItem <= 0) return null;

  // ---------------------------------------------------------
  // Determine profit/margin/markup mode
  // ---------------------------------------------------------
  let percentageCost = 1; // denominator portion
  let totalCost = 0;

  if (targetProfit > 0) {
    // MODE: PROFIT AMOUNT
    totalCost = costItem + targetProfit + shipCost + saleFeeFixed + txnFeeFixed;

    percentageCost = (100 - (saleFeePct + txnFeePct)) / 100;
  } else if (marginPct > 0) {
    // MODE: MARGIN PERCENTAGE
    totalCost = costItem + shipCost + saleFeeFixed + txnFeeFixed;

    percentageCost = (100 - (saleFeePct + txnFeePct + marginPct)) / 100;

    const decimalMargin = marginPct / 100;
    markupPct = Math.floor((decimalMargin / (1 - decimalMargin)) * 100);
  } else if (markupPct > 0) {
    // MODE: MARKUP PERCENTAGE
    const markupDecimal = markupPct / 100;
    marginPct = (markupDecimal / (1 + markupDecimal)) * 100;

    totalCost = costItem + shipCost + saleFeeFixed + txnFeeFixed;

    percentageCost = (100 - (saleFeePct + txnFeePct + marginPct)) / 100;

    const decimalMargin = markupDecimal / (1 + markupDecimal);
    marginPct = Math.floor(decimalMargin * 100);
  } else {
    // No mode provided
    return null;
  }

  if (percentageCost <= 0) return null;

  // ---------------------------------------------------------
  // SELLING PRICE CALCULATION
  // ---------------------------------------------------------
  const sellingPrice = totalCost / percentageCost - shipCharge;

  const revenue = sellingPrice + shipCharge;

  const sellingCost = (revenue * saleFeePct) / 100 + saleFeeFixed;

  const transactionCost = (revenue * txnFeePct) / 100 + txnFeeFixed;

  const cost = costItem + sellingCost + transactionCost + shipCost;

  const profit = revenue - cost;

  // Recalculate margin/markup if profit mode
  if (targetProfit > 0) {
    marginPct = Math.floor((profit / revenue) * 100);
    const decimalMargin = marginPct / 100;
    markupPct = Math.ceil((decimalMargin / (1 - decimalMargin)) * 100);
  }

  // ---------------------------------------------------------
  // RESPONSE
  // ---------------------------------------------------------
  return {
    answer: {
      sellingPrice: sellingPrice.toFixed(2),
    },
    summaryOfValues: {
      itemCost: costItem,
      shippingCost: shipCost,
      sellingCost: sellingCost.toFixed(2),
      transactionCost: transactionCost.toFixed(2),
      cost: cost.toFixed(2),
      revenue: revenue.toFixed(2),
      profit: profit.toFixed(2),
      margin: marginPct,
      markup: markupPct,
    },
    invoiceForBuyer: {
      itemPrice: sellingPrice.toFixed(2),
      shipping: shipCharge,
      subTotal: (sellingPrice + shipCharge).toFixed(2),
      total: (sellingPrice + shipCharge).toFixed(2),
    },
  };
}
