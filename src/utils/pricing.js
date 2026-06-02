export const DEFAULT_STORE_SETTINGS = {
  taxRatePercent: 5,
  shippingCharge: 49,
  freeShippingThreshold: 499
};

export const calculatePricing = (subtotal, settings = DEFAULT_STORE_SETTINGS) => {
  const safeSubtotal = Number(subtotal) || 0;
  const shipping = safeSubtotal >= settings.freeShippingThreshold ? 0 : settings.shippingCharge;
  const tax = Math.round(safeSubtotal * (settings.taxRatePercent / 100));
  const total = safeSubtotal + shipping + tax;

  return { shipping, tax, total };
};
