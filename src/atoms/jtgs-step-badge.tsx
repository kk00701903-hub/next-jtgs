import * as React from "react"
import { cn } from "@/lib/utils"
import { STEP_META, STEP_TOKEN } from "@/lib/jtgs-if-logic"
import type { IfStep } from "@/types/jtgs-if"

export interface JtgsStepBadgeProps extends React.ComponentProps<"span"> {
  step: IfStep
  /** 색각 보조 기호 노출 */
  showMark?: boolean
}

const MARK: Record<IfStep, string> = {
  "미마감": "○", "마감": "◐", "인터페이스": "●", "오류": "▲",
}

function JtgsStepBadge({ step, showMark = false, className, ...props }: JtgsStepBadgeProps) {
  const t = STEP_TOKEN[STEP_META[step].kind]
  return (
    <span
      title={STEP_META[step].note}
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5",
        "text-[12px] font-extrabold leading-[1.5]",
        className,
      )}
      style={{ color: t.fg, background: t.bg, borderColor: t.bd }}
      {...props}
    >
      {showMark && <span className="text-[11px] font-black leading-none">{MARK[step]}</span>}
      {step}
    </span>
  )
}

export { JtgsStepBadge }
