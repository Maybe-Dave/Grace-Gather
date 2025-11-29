"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps } from "recharts"

interface AttendanceChartProps {
    data: {
        name: string
        total: number
    }[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-popover p-2 shadow-sm">
                <p className="text-sm font-medium text-popover-foreground">{label}</p>
                <p className="text-sm text-primary">
                    Total: {payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};

export function AttendanceChart({ data }: AttendanceChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: 'transparent' }}
                />
                <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
