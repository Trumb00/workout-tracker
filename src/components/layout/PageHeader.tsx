import React from 'react'

interface PageHeaderProps {
  title: string
  back?: string
  action?: React.ReactNode
}

export function PageHeader({ title, back, action }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 pt-4 pb-2">
      {back && (
        <a href={back} className="p-2 -ml-2 rounded-xl text-slate-400 hover:bg-slate-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a>
      )}
      <h1 className="flex-1 text-xl font-bold text-slate-100">{title}</h1>
      {action && <div className="flex-none">{action}</div>}
    </div>
  )
}
