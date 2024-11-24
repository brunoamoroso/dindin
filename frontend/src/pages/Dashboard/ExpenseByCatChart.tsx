import { Separator } from '@/components/ui/separator';
import { currencyFormat } from '@/utils/currency-format';
import getCategoryIcon from '@/utils/get-category-icon';
import {Chart, DoughnutController, ArcElement, ChartTypeRegistry} from 'chart.js/auto';
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
import { useEffect, useMemo, useRef } from 'react';
import * as Types from '@/types/TransactionTypes';

export default function ExpenseByCatChart({data} : {data: Types.TransactionType[]}){
    const chartRef = useRef<Chart<keyof ChartTypeRegistry> | null>(null);
    const dataExtractExpenses = useMemo(() => data.filter((o) => o.type === "expense"), [data]);
    const dataSorted = useMemo(() => Object.groupBy(dataExtractExpenses, ({category}) => category.desc) as {[desc: string]: Types.TransactionType[]}, [dataExtractExpenses]);
    const totalAllAmount = useMemo(() => data.reduce((acc, cV) => acc + cV.amount, 0), [data]);
    
    const labelsData = (data: {[desc: string]: Types.TransactionType[]} ) => Object.keys(data);
    
    const valuesData = (data: {[desc: string]: Types.TransactionType[]} ) => Object.values(data).map((i) => i.reduce((acc, cV) => acc + cV.amount, 0));
    
    const bgColors = (data: {[desc: string]: Types.TransactionType[]} ) => Object.keys(data).map((desc: string) => getCategoryIcon(desc).dataVizColor);
    
    const borderColors = (data: {[desc: string]: Types.TransactionType[]} ) => Object.keys(data).map((desc: string) => getCategoryIcon(desc).dataVizBorderColor);

    useEffect(() => {
        if(dataSorted !== undefined && Object.keys(dataSorted).length > 0){
            if(chartRef.current){
                chartRef.current.destroy();
            }
            const chart =  document.getElementById("chart") as HTMLCanvasElement;
            Chart.register(DoughnutController, ArcElement, ChartDataLabels);
            chartRef.current = new Chart<keyof ChartTypeRegistry>(
                    chart,
                    {
                        type: "doughnut",
                        data: {
                            labels: labelsData(dataSorted),
                            datasets: [{
                                data: valuesData(dataSorted),
                                backgroundColor: bgColors(dataSorted),
                                borderColor: borderColors(dataSorted),
                            }]
                        },
                        options: {
                            layout: {
                                padding: 80,
                            },
                            datasets:{
                                doughnut:{
                                    borderRadius: 4,
                                    borderWidth: 4,
                                    spacing: 4,
                                },
                            },
                            plugins:{
                                datalabels: {
                                    align: "end",
                                    anchor: "end",
                                    padding: 12,
                                    color: "#FFFFFF",
                                    formatter: (value: number, ctx: Context) => {
                                        if(ctx.chart.data.labels !== undefined){
                                            const percentage = Math.round((value/totalAllAmount) * 100);
                                            return ctx.chart.data.labels[ctx.dataIndex] + `\n ${percentage}%`;
                                        }
                                    },
                                },
                                legend:{
                                    display: false,
                                },
                                tooltip:{
                                    enabled: false,
                                }
                            }   
                        }
                    }
                );
            }
        }, [dataSorted, totalAllAmount]); 

    const categoriesList = (dataSorted : {[desc: string]: Types.TransactionType[]}) => {
        const el = [];
        let i = 1;
        for (const desc in dataSorted){
            const totalCatAmount = dataSorted[desc].reduce((acc, cV) => acc + cV.amount, 0);
            const percentage = Math.round((totalCatAmount / totalAllAmount) * 100);
            const badge = getCategoryIcon(desc);
            el.push(
                <div className='flex flex-col px-6' key={i}>
                    <div className='flex items-center py-3.5 gap-4 justify-between'>
                        <div className='flex flex-1 items-center gap-4'>
                            <div className={'p-2 rounded text-title'} style={{
                                backgroundColor: badge.dataVizColor,
                                borderColor: badge.dataVizBorderColor
                            }}>
                                {badge.icon}
                            </div>
                            <div>
                                <h2 className='label-large text-title'>{desc}</h2>
                                <p className='body-small text-subtle'>{dataSorted[desc].length} {dataSorted[desc].length > 1 ? "transações" : "transação"}</p>
                            </div>
                        </div>

                        <div className='text-right'>
                            <p className='label-large text-negative'>{currencyFormat(totalCatAmount)}</p>
                            <p className='body-small text-subtle'>{percentage}%</p>
                        </div>
                    </div>
                    {i < Object.keys(dataSorted).length && <Separator />}
                </div>
            )
            i++;
        }
        return el;
    }


    return(
        <div className="bg-container2 rounded-lg py-4">
            <h1 className="title-small text-title px-6">Gasto por Categoria</h1>
            {data.length === 0 && (
                <span className="flex px-6 py-4 text-subtle body-large">Sem transções neste mês.</span>
            )}
            {(data && data.length > 0) && (
                <div className='flex justify-center'>
                    <canvas id="chart"></canvas>
                </div>
            )}
            {(data && data.length > 0) && (
                <div>
                    {categoriesList(dataSorted)}
                </div>
            )}
        </div>
    )
}