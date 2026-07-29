import * as React from "react"
import { cn } from "@/lib/utils"

export interface JtgsCheckProps extends Omit<React.ComponentProps<"button">, "onChange"> {
  checked: boolean
  /** 일부만 선택된 헤더 상태 */
  indeterminate?: boolean
  onCheckedChange?: (next: boolean) => void
}

/** 그리드 셀 안에서 쓰는 16px 체크박스 — 행 클릭과 이벤트가 겹치지 않도록 stopPropagation */
function JtgsCheck({ checked, indeterminate, onCheckedChange, className, ...props }: JtgsCheckProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      onClick={(e) => {
        e.stopPropagation()
        onCheckedChange?.(!checked)
      }}
      className={cn(
        "inline-flex size-4 items-center justify-center rounded-[4px] border text-[11px] font-black leading-none text-white",
        "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--jtgs-step-blue-fg)]",
        checked || indeterminate
          ? "border-[#1d4ed8] bg-[#2563eb]"
          : "border-[#cbd5e1] bg-white hover:border-[#94a3b8]",
        className,
      )}
      {...props}
    >
      {checked ? "✓" : indeterminate ? "–" : ""}
    </button>
  )
}

export { JtgsCheck }
