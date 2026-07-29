import { FassButton } from "@/components/fass/atoms/fass-button"
import { cn } from "@/lib/utils"

export interface JtgsIfAction {
  label: string
  variant: "primary" | "secondary" | "danger" | "ghost"
  enabled: boolean
  /** 비활성 사유 툴팁 */
  hint: string
  onClick?: () => void
}

export interface JtgsIfActionBarProps {
  actions: JtgsIfAction[]
  /** "인터페이스 2종 · 대상 18건" 또는 "3건 선택됨" */
  selectionLabel: string
  /** 선택이 잘못됐을 때의 안내 */
  why?: string
  className?: string
}

function JtgsIfActionBar({ actions, selectionLabel, why, className }: JtgsIfActionBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="mr-1 text-[12px] font-bold text-[var(--jtgs-text-muted)]">{selectionLabel}</span>
      {actions.map((a) => (
        <FassButton
          key={a.label}
          size="sm"
          variant={a.variant}
          disabled={!a.enabled}
          onClick={a.onClick}
          title={a.enabled ? `${a.label} · ${selectionLabel}` : why || a.hint}
          className="whitespace-nowrap"
        >
          {a.label}
        </FassButton>
      ))}
      {why && <span className="text-[12px] text-[var(--jtgs-text-dim)]">{why}</span>}
    </div>
  )
}

export { JtgsIfActionBar }
