/**
 * 
 * @param amountInt 
 * @param currencyCode 
 * @returns string formatted without the symbol
 * I need to remove the symbol because in some parts of the UI I need and some don't
 */

export function currencyFormat(amountInt: number, currencyCode = "USD"): string{
    const amountCents = amountInt/100;
    if((isNaN(amountCents) || amountCents === 0)){
      return "0.00";
    }
    const formatter = new Intl.NumberFormat(undefined, {style: "currency", currency: currencyCode});
    const parts = formatter.formatToParts(amountCents);
    const filtered = parts.filter((part) => part.type !== "currency" && part.type !== "literal");
    return filtered.map(part => part.value).join("");
}