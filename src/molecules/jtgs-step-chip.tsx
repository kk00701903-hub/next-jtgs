import * as React from "react"
import { cn } from "@/lib/utils"

export interface JtgsStepChipProps extends React.ComponentProps<"button"> {
  label: string
  count: number
  checked: boolean
  /** 활성 색 (진행상태 칩은 상태색, 인터페이스 칩은 --jtgs-kind-*) */
  tone: { fg: string; bg: string; bd: string }
  onToggle?: () => void
}

function JtgsStepChip({ label, count, checked, tone, onToggle, className, ...props }: JtgsStepChipProps) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onToggle}
      className={cn(
        "inline-flex h-[30px] items-center gap-[7px] whitespace-nowrap rounded-full border px-[11px] text-[12px]",
        checked ? "font-extrabold" : "font-semibold",
        className,
      )}
      style={{
        borderColor: checked ? tone.bd : "var(--jtgs-line)",
        background: checked ? tone.bg : "var(--jtgs-surface)",
        color: checked ? tone.fg : "var(--jtgs-text-muted)",
      }}
      {...props}
    >
      <span
        className="inline-flex size-[15px] shrink-0 items-center justify-center rounded-[4px] border text-[10px] font-black leading-none text-white"
        style={{
          borderColor: checked ? tone.fg : "#cbd5e1",
          background: checked ? tone.fg : "#fff",
        }}
      >
        {checked ? "✓" : ""}
      </span>
      {label}
      <span
        className="rounded-full px-1.5 py-px text-[11px] font-extrabold"
        style={{
          background: checked ? "rgba(255,255,255,.65)" : "var(--jtgs-line-soft)",
          color: checked ? tone.fg : "var(--jtgs-text-dim)",
        }}
      >
        {count}
      </span>
    </button>
  )
}

export { JtgsStepChip }
