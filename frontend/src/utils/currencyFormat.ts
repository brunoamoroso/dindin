export const currencyFormat = (amountInt: number) => {
    let amountCents = amountInt/100;
    if(isNaN(amountCents)){
      amountCents = 0;
    }
    return new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL"}).format(amountCents).slice(3);
}