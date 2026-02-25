'use client'

import { useState, useEffect } from 'react'
import { WeightChart } from '@/components/progress/WeightChart'
import { CardioChart } from '@/components/progress/CardioChart'
import { getWeightHistory, getCardioHistory, getExerciseNames } from '@/actions/records'
import { PageHeader } from '@/components/layout/PageHeader'

type Tab = 'strength' | 'cardio'
type CardioMetric = 'pace' | 'distance'

export default function ProgressPage() {
  const [tab, setTab] = useState<Tab>('strength')
  const [gymNames, setGymNames] = useState<string[]>([])
  const [cardioNames, setCardioNames] = useState<string[]>([])
  const [selectedGym, setSelectedGym] = useState<string>('')
  const [selectedCardio, setSelectedCardio] = useState<string>('')
  const [cardioMetric, setCardioMetric] = useState<CardioMetric>('pace')
  const [weightData, setWeightData] = useState<Array<{ date: string; weight: number; reps: number }>>([])
  const [cardioData, setCardioData] = useState<Array<{ date: string; distance: number; pace: number | null; duration: number }>>([])

  useEffect(() => {
    getExerciseNames('gym').then(setGymNames)
    getExerciseNames('cardio').then(setCardioNames)
  }, [])

  useEffect(() => {
    if (selectedGym) getWeightHistory(selectedGym).then(setWeightData)
    else setWeightData([])
  }, [selectedGym])

  useEffect(() => {
    if (selectedCardio) getCardioHistory(selectedCardio).then(setCardioData)
    else setCardioData([])
  }, [selectedCardio])

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Progress" />

      {/* Tab selector */}
      <div className="px-4 flex gap-2">
        {(['strength', 'cardio'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 h-10 rounded-xl text-sm font-medium transition-colors capitalize ${
              tab === t ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-4 flex flex-col gap-4">
        {tab === 'strength' ? (
          <>
            {gymNames.length > 0 ? (
              <select
                value={selectedGym}
                onChange={(e) => setSelectedGym(e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select exercise...</option>
                {gymNames.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            ) : (
              <p className="text-slate-500 text-sm">Complete gym workouts to see your progress here.</p>
            )}
            <WeightChart data={weightData} />
          </>
        ) : (
          <>
            {cardioNames.length > 0 ? (
              <select
                value={selectedCardio}
                onChange={(e) => setSelectedCardio(e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select activity...</option>
                {cardioNames.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            ) : (
              <p className="text-slate-500 text-sm">Complete cardio workouts to see your progress here.</p>
            )}
            {selectedCardio && (
              <div className="flex gap-2">
                {(['pace', 'distance'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setCardioMetric(m)}
                    className={`flex-1 h-9 rounded-xl text-sm font-medium transition-colors capitalize ${
                      cardioMetric === m ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
            <CardioChart data={cardioData} metric={cardioMetric} />
          </>
        )}
      </div>
    </div>
  )
}
