'use client'

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { formatDateShort } from '@/lib/utils/formatters'
import { formatPace } from '@/lib/utils/pace'

interface CardioChartProps {
  data: Array<{ date: string; distance: number; pace: number | null; duration: number }>
  metric: 'pace' | 'distance'
}

export function CardioChart({ data, metric }: CardioChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
        No data yet
      </div>
    )
  }

  const dataKey = metric === 'pace' ? 'pace' : 'distance'

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
          reversed={metric === 'pace'}
          tickFormatter={(v) => metric === 'pace' ? formatPace(v) : `${v}km`}
          width={metric === 'pace' ? 56 : 42}
        />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 12, color: '#f1f5f9', fontSize: 13 }}
          formatter={(value) => [
            metric === 'pace' ? formatPace((value as number) ?? 0) : `${value ?? 0} km`,
            metric === 'pace' ? 'Pace' : 'Distance',
          ]}
          labelFormatter={(label) => formatDateShort(label as string)}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="#34d399"
          strokeWidth={2}
          dot={{ fill: '#34d399', r: 4 }}
          activeDot={{ r: 6 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
