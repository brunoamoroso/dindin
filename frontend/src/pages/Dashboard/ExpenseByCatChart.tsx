import { Separator } from "@/components/ui/separator";
import { currencyFormat } from "@/utils/currency-format";
import getCategoryIcon from "@/utils/get-category-icon";
import { cloneElement, useMemo } from "react";
import type { ReactElement } from "react";
import * as Types from "@/types/TransactionTypes";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  Cell,
  Pie,
  PieChart,
  type PieLabelRenderProps,
} from "recharts";


export default function ExpenseByCatChart({
  data,
}: {
  data: Types.TransactionType[];
}) {
  const dataExtractExpenses = useMemo(
    () => data.filter((o) => o.type === "expense"),
    [data]
  );

  const dataSorted = useMemo(
    () =>
      Object.groupBy(dataExtractExpenses, ({ category }) => category) as {
        [desc: string]: Types.TransactionType[];
      },
      [dataExtractExpenses]
    );
    
    const totalAllAmount = useMemo(
      () => dataExtractExpenses.reduce((acc, cV) => acc + cV.amount, 0),
      [dataExtractExpenses]
    );
    
  const chartData = useMemo(
  () =>
    Object.entries(dataSorted ?? {}).map(([category, txs]) => {
      const total = txs.reduce((acc, t) => acc + t.amount, 0);
      const badge = getCategoryIcon(category); // has icon, dataVizColor, dataVizBorderColor
      const percentage = totalAllAmount
        ? Math.round((total / totalAllAmount) * 100)
        : 0;

      return {
        key: category,
        value: total,
        fill: badge.dataVizColor,
        stroke: badge.dataVizBorderColor,
        icon: badge.icon,
        percentage: percentage,
      };
    }),
  [dataSorted, totalAllAmount]
  );

  const chartConfig = useMemo<ChartConfig>(() => {
    return chartData.reduce<ChartConfig>((acc, item) => {
      acc[item.key] = {
        label: item.key,
        color: item.fill,
        stroke: item.stroke,
        icon: () => item.icon,
      };
      return acc;
    }, {});
  }, [chartData]);

  const categoriesList = (dataSorted: {
    [description: string]: Types.TransactionType[];
  }) => {
    const el = [];
    let i = 1;
    for (const description in dataSorted) {
      const totalCatAmount = dataSorted[description].reduce(
        (acc, cV) => acc + cV.amount,
        0
      );
      const percentage = Math.round((totalCatAmount / totalAllAmount) * 100);
      const badge = getCategoryIcon(description);
      el.push(
        <div className="flex flex-col" key={i}>
          <div className="flex items-center py-3.5 gap-4 justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div
                className={"p-2 rounded text-content-primary"}
                style={{
                  backgroundColor: badge.dataVizColor,
                  borderColor: badge.dataVizBorderColor,
                }}
              >
                {badge.icon}
              </div>
              <div>
                <h2 className="label-large text-content-primary">
                  {description}
                </h2>
                <p className="body-small text-content-subtle">
                  {dataSorted[description].length}{" "}
                  {dataSorted[description].length > 1
                    ? "transações"
                    : "transação"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="label-large text-critical">
                {currencyFormat(totalCatAmount)}
              </p>
              <p className="body-small text-content-subtle">{percentage}%</p>
            </div>
          </div>
          {i < Object.keys(dataSorted).length && <Separator />}
        </div>
      );
      i++;
    }
    return el;
  };

 const RAD = Math.PI / 180;

  const renderLabel = (props: PieLabelRenderProps) => {
    const {
      index = 0,
      cx = 0,
      cy = 0,
      outerRadius = 0,
      midAngle = 0,
    } = props;

    const entry = chartData[index];
    const percentage = entry?.percentage ?? 0;

    // distance from center where we want the label
    const radius = (outerRadius as number) + 40;

    // Recharts angles are in degrees, 0° is to the right, positive is clockwise.
    const x = (cx as number) + radius * Math.cos(-(midAngle as number) * RAD);
    const y = (cy as number) + radius * Math.sin(-(midAngle as number) * RAD);

    const icon =
      entry?.icon &&
      cloneElement(entry.icon as ReactElement, {
        size: 18,
        color: "#FFF",
        strokeWidth: 2,
      });

    return (
      <g transform={`translate(${x}, ${y})`} pointerEvents="none" textAnchor="middle">
        {icon && <g transform="translate(-8, -16)">{icon}</g>}
        <text
          y={icon ? 10 : 0}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#FFF"
          fontSize={12}
          fontWeight={700}
        >
          {percentage}%
        </text>
      </g>
    );
  };

  return (
    <>
      <div className="mx-6">
        <h1 className="title-small text-content-primary">
          Como estou gastando
        </h1>
        {data.length === 0 && (
          <span className="flex py-4 text-content-subtle body-large">
            Sem transções neste mês.
          </span>
        )}
        {data && data.length > 0 && (
        <ChartContainer config={chartConfig} className="min-h-[380px] w-full pt-4">
          <PieChart>
            <Pie
              data={chartData}
              dataKey={"value"}
              labelLine={{stroke: "#FFF", strokeWidth:2}}
              innerRadius={55}
              outerRadius={120}
              paddingAngle={3}
              cornerRadius="4"
              label={renderLabel}
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.key}`}
                  fill={chartConfig[entry.key as keyof typeof chartConfig].color}
                  stroke={
                    chartConfig[entry.key as keyof typeof chartConfig].stroke
                  }
                  strokeWidth={4}
                />
              ))}
              
            </Pie>
          </PieChart>
        </ChartContainer>
        )}
        {data && data.length > 0 && <div>{categoriesList(dataSorted)}</div>}
      </div>
    </>
  );
}
