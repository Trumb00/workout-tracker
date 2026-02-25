'use client'

import { useState, useEffect, useCallback } from 'react'
import { upsertCustomMetric } from '@/actions/exercises'
import { Input } from '@/components/ui/Input'
import { NumberInput } from '@/components/ui/NumberInput'
import type { CustomMetricLog } from '@/types/app'

interface CustomBlockProps {
  exerciseId: string
  exerciseName: string
  initialMetrics?: CustomMetricLog[]
  onDelete: () => void
}

interface MetricRow {
  id?: string
  metric_name: string
  metric_value: number | ''
  metric_unit: string
}

export function CustomBlock({ exerciseId, exerciseName, initialMetrics = [], onDelete }: CustomBlockProps) {
  const [metrics, setMetrics] = useState<MetricRow[]>(
    initialMetrics.length > 0
      ? initialMetrics.map((m) => ({
          id: m.id,
          metric_name: m.metric_name,
          metric_value: m.metric_value ?? '',
          metric_unit: m.metric_unit ?? '',
        }))
      : [{ metric_name: '', metric_value: '', metric_unit: '' }]
  )

  const saveMetric = useCallback(async (index: number, row: MetricRow) => {
    if (!row.metric_name.trim()) return
    const id = await upsertCustomMetric({
      id: row.id,
      session_exercise_id: exerciseId,
      metric_name: row.metric_name,
      metric_value: row.metric_value === '' ? null : row.metric_value as number,
      metric_unit: row.metric_unit || null,
    })
    setMetrics((prev) => prev.map((m, i) => i === index ? { ...m, id } : m))
  }, [exerciseId])

  function updateMetric(index: number, patch: Partial<MetricRow>) {
    setMetrics((prev) => {
      const updated = prev.map((m, i) => i === index ? { ...m, ...patch } : m)
      const timer = setTimeout(() => saveMetric(index, updated[index]), 800)
      return updated
    })
  }

  return (
    <div className="bg-slate-900 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-100">{exerciseName}</h3>
        <button onClick={onDelete} className="text-slate-500 hover:text-red-400 p-1 rounded-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {metrics.map((metric, index) => (
        <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
          <Input
            label={index === 0 ? 'Metric' : undefined}
            value={metric.metric_name}
            onChange={(e) => updateMetric(index, { metric_name: e.target.value })}
            placeholder="Name"
          />
          <NumberInput
            label={index === 0 ? 'Value' : undefined}
            value={metric.metric_value}
            onChange={(v) => updateMetric(index, { metric_value: v })}
            placeholder="0"
          />
          <Input
            label={index === 0 ? 'Unit' : undefined}
            value={metric.metric_unit}
            onChange={(e) => updateMetric(index, { metric_unit: e.target.value })}
            placeholder="kg"
            className="w-16"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setMetrics([...metrics, { metric_name: '', metric_value: '', metric_unit: '' }])}
        className="h-10 rounded-xl border border-dashed border-slate-700 text-slate-500 text-sm hover:border-slate-500 hover:text-slate-400 transition-colors"
      >
        + Add Metric
      </button>
    </div>
  )
}
