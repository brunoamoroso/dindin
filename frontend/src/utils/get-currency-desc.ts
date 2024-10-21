export function getRecurrencyDesc(desc: string){
    const listDesc: Record<string, string> = {
        "never": "Nunca",
        "day": "Diário",
        "week": "Semanal",
        "biweek": "Quinzenal",
        "month": "Mensal",
        "quarter": "Trimestral",
        "semester": "Semestral",
        "annual": "Anual"
    }

    return listDesc[desc] || "Recorrência não encontrada";
}