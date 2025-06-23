"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
  bytes: {
    label: "Bytes",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

interface SkillsChartProps {
    chartData: {
        language: string;
        bytes: number;
        fill: string;
    }[];
}

export function SkillsChart({ chartData }: SkillsChartProps) {
    return (
        <Card className="bg-card/50 h-full">
            <CardHeader>
                <CardTitle>Language Distribution (github based)</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]">
                <ChartContainer config={chartConfig} className="w-full h-full">
                    <BarChart 
                        accessibilityLayer 
                        data={chartData} 
                        margin={{ top: 20, right: 20, bottom: 50, left: 20 }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="language"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            angle={-45}
                            textAnchor="end"
                            interval={0}
                            height={60}
                        />
                        <YAxis hide={true} />
                        <ChartTooltip
                            cursor={{ fill: 'hsl(var(--accent) / 0.3)' }}
                            content={<ChartTooltipContent 
                                labelKey="language" 
                                formatter={(value) => `${Number(value).toLocaleString()} bytes`} 
                                indicator="dot"
                            />}
                        />
                        <Bar dataKey="bytes" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
