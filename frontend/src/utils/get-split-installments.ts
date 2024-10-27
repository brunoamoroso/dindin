import { currencyFormat } from "./currency-format";

function splitInstallmentsDisplay(amount: number, installments: number): string {
  if (installments === 0) {
    return "";
  }

  if (installments === 1) {
    return "1x de R$" + currencyFormat(amount);
  }

  const baseAmount = Math.floor(amount / installments);

  const remainder = amount % installments;

  const splittedInstallments = Array(installments).fill(baseAmount);

  splittedInstallments[0] += remainder;

  if(splittedInstallments[0] === splittedInstallments[1]){
    //if the first is equal to the second so are the rest
    return `${installments}x de R$${currencyFormat(splittedInstallments[0])}`
  }

  return `1x de R$${currencyFormat(splittedInstallments[0])} e ${installments - 1}x de R$${currencyFormat(splittedInstallments[1])}`;
}

export default splitInstallmentsDisplay;
