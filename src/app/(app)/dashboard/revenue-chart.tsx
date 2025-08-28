"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format } from "date-fns";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

interface RevenueChartProps {
  chartData: { date: string; revenue: number }[];
  chartConfig: ChartConfig;
}

export function RevenueChart({ chartData, chartConfig }: RevenueChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => format(new Date(value), "MMM d")}
        />
        <YAxis hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
