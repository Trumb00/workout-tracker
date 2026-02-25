'use client'

import React from 'react'

interface NumberInputProps {
  label?: string
  value: number | ''
  onChange: (value: number | '') => void
  min?: number
  max?: number
  step?: number
  placeholder?: string
  className?: string
  error?: string
}

export function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  placeholder,
  className = '',
  error,
}: NumberInputProps) {
  const decrement = () => {
    const current = value === '' ? 0 : value
    const next = current - step
    if (min !== undefined && next < min) return
    onChange(next)
  }

  const increment = () => {
    const current = value === '' ? 0 : value
    const next = current + step
    if (max !== undefined && next > max) return
    onChange(next)
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <div className="flex items-center h-11 rounded-xl border border-slate-700 bg-slate-800 overflow-hidden">
        <button
          type="button"
          onClick={decrement}
          className="flex-none w-11 h-full flex items-center justify-center text-slate-400 hover:bg-slate-700 active:bg-slate-600 text-xl font-light transition-colors"
        >
          −
        </button>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          onChange={(e) => {
            const v = e.target.value
            onChange(v === '' ? '' : parseFloat(v))
          }}
          className="flex-1 h-full text-center bg-transparent text-slate-100 text-base focus:outline-none"
        />
        <button
          type="button"
          onClick={increment}
          className="flex-none w-11 h-full flex items-center justify-center text-slate-400 hover:bg-slate-700 active:bg-slate-600 text-xl font-light transition-colors"
        >
          +
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
