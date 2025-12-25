// ----------------------------------------------------
// Helper functions (pure)
// ----------------------------------------------------

function calculateDiscountedPrice(
  listPrice: number,
  percentageOff: number
): number {
  const decimal = percentageOff / 100;
  return listPrice - listPrice * decimal;
}

function calculateMultiItemDiscount(
  listPrice: number,
  itemsAtListPrice: number,
  itemsInDeal: number
): number {
  if (!itemsInDeal || itemsInDeal <= 0) return 0;
  const totalCost = listPrice * itemsAtListPrice;
  return totalCost / itemsInDeal;
}

function calculateFractionDiscount(
  listPrice: number,
  fraction: number
): number {
  return listPrice - listPrice * fraction;
}

// ----------------------------------------------------
// Exported Main Calculator
// ----------------------------------------------------

export interface SalePriceCalcResult {
  discountedPrice: string;
  discountedPricePerItem: string;
  salePrice: string;
}

export function salePriceCalculator(
  listPriceInput: number | string,
  percentageOffInput: number | string,
  multiItemListPriceInput: number | string,
  itemsAtListInput: number | string,
  itemsInDealInput: number | string,
  fractionListPriceInput: number | string,
  fractionInput: number | string
): SalePriceCalcResult {
  // Convert all inputs to numbers
  const listPrice = Number(listPriceInput);
  const percentageOff = Number(percentageOffInput);
  const priceOfMultiItemCal = Number(multiItemListPriceInput);
  const numberOfItemsAtListPrice = Number(itemsAtListInput);
  const numberOfItemsInDeal = Number(itemsInDealInput);
  const priceOfFractionCal = Number(fractionListPriceInput);
  const fraction = Number(fractionInput);

  // ----------------------------------------------------
  // Defensive validation (keeps UI from breaking)
  // ----------------------------------------------------
  const safe = (n: number) => (Number.isFinite(n) ? n : 0);

  const discountedPrice = safe(
    calculateDiscountedPrice(listPrice, percentageOff)
  );

  const discountedPricePerItem = safe(
    calculateMultiItemDiscount(
      priceOfMultiItemCal,
      numberOfItemsAtListPrice,
      numberOfItemsInDeal
    )
  );

  const salePrice = safe(
    calculateFractionDiscount(priceOfFractionCal, fraction)
  );

  return {
    discountedPrice: discountedPrice.toFixed(2),
    discountedPricePerItem: discountedPricePerItem.toFixed(2),
    salePrice: salePrice.toFixed(2),
  };
}
