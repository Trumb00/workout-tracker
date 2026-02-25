'use client'

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { formatDateShort } from '@/lib/utils/formatters'

interface WeightChartProps {
  data: Array<{ date: string; weight: number; reps: number }>
}

export function WeightChart({ data }: WeightChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
        No data yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => formatDateShort(v)}
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}kg`}
          width={42}
        />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 12, color: '#f1f5f9', fontSize: 13 }}
          formatter={(value, _, entry) => [`${value ?? 0} kg × ${entry?.payload?.reps ?? 0} reps`, 'Best set'] as [string, string]}
          labelFormatter={(label) => formatDateShort(label as string)}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#818cf8"
          strokeWidth={2}
          dot={{ fill: '#818cf8', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
