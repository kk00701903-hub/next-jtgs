import { cn } from "@/lib/utils"
import { JtgsCheck } from "@/atoms/jtgs-check"
import { JtgsStepBadge } from "@/atoms/jtgs-step-badge"
import { won } from "@/lib/jtgs-if-logic"
import type { IfHeaderRow, IfKey } from "@/types/jtgs-if"

export interface JtgsIfHeaderGridProps {
  rows: IfHeaderRow[]
  /** 일괄 처리 대상으로 체크된 인터페이스 */
  selected: IfKey[]
  onSelectedChange: (next: IfKey[]) => void
  /** 라인 그리드를 특정 인터페이스로 전환 */
  activeType: IfKey | "all"
  onActiveTypeChange: (next: IfKey | "all") => void
  className?: string
}

const TH = "whitespace-nowrap border-b border-[var(--jtgs-line)] bg-[#f7f9fc] px-3 py-2.5 text-[12px] font-bold text-[var(--jtgs-text-muted)]"
const TD = "whitespace-nowrap border-b border-[var(--jtgs-line-soft)] px-3 py-2.5 text-[13px] text-[var(--jtgs-text)]"

function JtgsIfHeaderGrid({
  rows, selected, onSelectedChange, activeType, onActiveTypeChange, className,
}: JtgsIfHeaderGridProps) {
  const allChecked = rows.length > 0 && rows.every((r) => selected.includes(r.key))
  const someChecked = !allChecked && selected.length > 0

  return (
    <div className={cn("overflow-x-auto rounded-[10px] border border-[var(--jtgs-line)] bg-white", className)}>
      <table className="w-full min-w-[1040px] border-collapse">
        <thead>
          <tr>
            <th className={cn(TH, "w-10 text-center")}>
              <JtgsCheck
                checked={allChecked}
                indeterminate={someChecked}
                aria-label="인터페이스 전체 선택"
                onCheckedChange={(next) => onSelectedChange(next ? rows.map((r) => r.key) : [])}
              />
            </th>
            <th className={cn(TH, "text-left")}>인터페이스</th>
            <th className={cn(TH, "text-left")}>주기</th>
            <th className={cn(TH, "text-left")}>대상</th>
            <th className={cn(TH, "text-right")}>대상 건수</th>
            <th className={cn(TH, "text-right")}>미마감</th>
            <th className={cn(TH, "text-right")}>마감</th>
            <th className={cn(TH, "text-right")}>완료</th>
            <th className={cn(TH, "text-right")}>오류</th>
            <th className={cn(TH, "text-right")}>금액</th>
            <th className={cn(TH, "text-left")}>최종 처리</th>
            <th className={cn(TH, "text-left")}>진행상태</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const on = selected.includes(r.key)
            const active = activeType === r.key
            return (
              <tr
                key={r.key}
                onClick={() => onActiveTypeChange(active ? "all" : r.key)}
                className="cursor-pointer transition-colors"
                style={{
                  background: on ? "var(--jtgs-row-selected)" : active ? "#f3f8ff" : "#fff",
                  boxShadow: active ? "inset 3px 0 0 var(--jtgs-step-blue-fg)" : "none",
                }}
              >
                <td className={cn(TD, "text-center")}>
                  <JtgsCheck
                    checked={on}
                    aria-label={r.label + " 선택"}
                    onCheckedChange={(next) =>
                      onSelectedChange(next ? [...selected, r.key] : selected.filter((k) => k !== r.key))
                    }
                  />
                </td>
                <td className={cn(TD, "font-bold")}>
                  {r.label}
                  <span className="ml-2 text-[11px] font-semibold text-[var(--jtgs-text-dim)]">{r.code}</span>
                </td>
                <td className={TD}>{r.cycle}</td>
                <td className={cn(TD, "text-[var(--jtgs-text-muted)]")}>{r.target}</td>
                <td className={cn(TD, "text-right tabular-nums font-bold")}>{r.count}</td>
                <td className={cn(TD, "text-right tabular-nums")}>{r.unclosed}</td>
                <td className={cn(TD, "text-right tabular-nums")}>{r.closed}</td>
                <td className={cn(TD, "text-right tabular-nums")}>{r.done}</td>
                <td
                  className={cn(TD, "text-right tabular-nums font-bold")}
                  style={{ color: r.err ? "var(--jtgs-step-red-fg)" : "var(--jtgs-text-dim)" }}
                >
                  {r.err}
                </td>
                <td className={cn(TD, "text-right tabular-nums font-bold")}>{won(r.amount)}</td>
                <td className={cn(TD, "text-[var(--jtgs-text-muted)]")}>{r.last}</td>
                <td className={TD}><JtgsStepBadge step={r.step} /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export { JtgsIfHeaderGrid }
