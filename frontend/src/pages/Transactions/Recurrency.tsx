import AppBar from "@/components/AppBar";
import MenuListItem from "@/components/ui/menu-list-item";
import { TransactionsContextType } from "@/context/TransactionsContext";
import { MouseEvent } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function Recurrency() {
    const {setContextTransactionData}: TransactionsContextType = useOutletContext();
    const navigate = useNavigate();
    // this comes from a scalar type in the database
    const options = [
        {
            value: "never",
            desc: "Nunca"
        },
        {
            value: "day",
            desc: "Diário"
        },
        {
            value: "week",
            desc: "Semanal"
        },
        {
            value: "biweek",
            desc: "Quinzenal"
        },
        {
            value: "month",
            desc: "Mensal"
        },
        {
            value: "quarter",
            desc: "Trimestral"
        },
        {
            value: "semester",
            desc: "Semetral"
        },
        {
            value: "annual",
            desc: "Anual"
        }
    ];

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        const id = e.currentTarget.dataset.id;
        const desc = e.currentTarget.dataset.value;

        if((id === undefined) || (desc === undefined)){
            throw new Error("Recurrency value undefined");
        }
        setContextTransactionData((prevTransaction) => ({
            ...prevTransaction,
            recurrency: {id: id, desc: desc}
        }));
        navigate("/transaction");
    }
  return (
    <div className="bg-surface h-dvh flex flex-col">
        <AppBar title="Repetir essa transação" />
        <div className="container bg-layer-tertiary flex flex-1 flex-col rounded-t-lg py-10">
            {options.map((option, index, arr) => {
                if(arr.length - 1 === index){
                    return <MenuListItem size="lg" key={index} trailingIcon={false} dataId={option.value} value={option.desc} onClick={handleClick}>{option.desc}</MenuListItem>
                }else{
                    return <MenuListItem size="lg" key={index} separator={true} trailingIcon={false} dataId={option.value} value={option.desc} onClick={handleClick}>{option.desc}</MenuListItem>
                }
            })}
        </div>
    </div>
  )
}
