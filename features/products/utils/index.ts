export function formatPrice(centsOrNumber: number) {
  const value = Number(centsOrNumber);
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
  }).format(value);
}
