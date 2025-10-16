export function formatPrice(centsOrNumber: number) {
  const value = Number(centsOrNumber);
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);
}
