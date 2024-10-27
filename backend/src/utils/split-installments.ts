interface Props {
    amount: number;
    installments: number;
}

function splitInstallments({amount, installments }: Props): number[] {
    const baseAmount = Math.floor(amount / installments);

    const remainder = amount % installments;

    const splittedInstallments = Array(installments).fill(baseAmount);

    splittedInstallments[0] += remainder;

    return splittedInstallments;
}

export default splitInstallments
