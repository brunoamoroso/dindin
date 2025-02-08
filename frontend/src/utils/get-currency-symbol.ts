export function getCurrencySymbol(currencyCode = "USD"): string {
    const formatter = new Intl.NumberFormat(undefined, {style: "currency", currency: currencyCode, currencyDisplay: "symbol"});

    const parts = formatter.formatToParts(0);

    const symbol = parts.find((part) => part.type === "currency");

    return symbol ? symbol.value : currencyCode;
}