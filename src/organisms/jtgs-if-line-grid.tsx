import { cn } from "@/lib/utils"
import { JtgsCheck } from "@/atoms/jtgs-check"
import { JtgsStepBadge } from "@/atoms/jtgs-step-badge"
import { num, parseCol, won } from "@/lib/jtgs-if-logic"
import type { IfLineRow, IfLineSource } from "@/types/jtgs-if"

export interface JtgsIfLineGridProps {
  source: IfLineSource
  /** 필터가 적용된 표시 대상 */
  rows: IfLineRow[]
  /** 필터 이전 전체 대상 (합계 문구용) */
  totalCount: number
  selected: string[]
  onSelectedChange: (next: string[]) => void
  filterLabel: string
  className?: string
}

const KIND_BY_COL = ["외상·선입금", "현금매출", "신용체크카드", "카드결제 실적"]

function JtgsIfLineGrid({
  source, rows, totalCount, selected, onSelectedChange, filterLabel, className,
}: JtgsIfLineGridProps) {
  const cols = source.cols.map(parseCol)
  const allChecked = rows.length > 0 && rows.every((r) => selected.includes(r.id))

  const toggle = (id: string) =>
    onSelectedChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])

  const sumOf = (ci: number) => won(rows.reduce((a, r) => a + num(r.cells[ci]), 0))
  const leadSpan = source.amountCols[0] + 2

  return (
    <div className={cn("overflow-x-auto rounded-[10px] border border-[var(--jtgs-line)] bg-white", className)}>
      <table className="w-full min-w-[1180px] border-collapse">
        <thead>
          <tr>
            <th className="w-10 whitespace-nowrap border-b border-[var(--jtgs-line)] bg-[#f7f9fc] px-2 py-2.5 text-center">
              <JtgsCheck
                checked={allChecked}
                aria-label="표시된 라인 전체 선택"
                onCheckedChange={(next) => onSelectedChange(next ? rows.map((r) => r.id) : [])}
              />
            </th>
            <th className="w-[108px] whitespace-nowrap border-b border-[var(--jtgs-line)] bg-[#f7f9fc] px-3 py-2.5 text-left text-[12px] font-bold text-[var(--jtgs-text-muted)]">
              진행상태
            </th>
            {cols.map((c, i) => (
              <th
                key={`${c.label}-${i}`}
                style={{ width: c.width }}
                className={cn(
                  "whitespace-nowrap border-b border-[var(--jtgs-line)] bg-[#f7f9fc] px-3 py-2.5 text-[12px] font-bold text-[var(--jtgs-text-muted)]",
                  c.align === "r" ? "text-right" : c.align === "c" ? "text-center" : "text-left",
                )}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => {
            const on = selected.includes(r.id)
            return (
              <tr
                key={r.id}
                onClick={() => toggle(r.id)}
                className="cursor-pointer transition-colors hover:bg-[var(--jtgs-row-hover)]"
                style={{ background: on ? "var(--jtgs-row-selected)" : undefined }}
              >
                <td className="border-b border-[var(--jtgs-line-soft)] px-2 py-2.5 text-center">
                  <JtgsCheck
                    checked={on}
                    aria-label={r.kind + " " + r.cells[0] + " 라인 선택"}
                    onCheckedChange={() => toggle(r.id)}
                  />
                </td>
                <td className="whitespace-nowrap border-b border-[var(--jtgs-line-soft)] px-3 py-2.5">
                  <JtgsStepBadge step={r.step} />
                </td>
                {r.cells.map((v, ci) => {
                  const c = cols[ci]
                  const amountSlot = source.unified ? source.amountCols.indexOf(ci) : -1
                  const own = amountSlot >= 0 && r.kind === KIND_BY_COL[amountSlot]
                  return (
                    <td
                      key={ci}
                      className={cn(
                        "whitespace-nowrap border-b border-[var(--jtgs-line-soft)] px-3 py-2.5 text-[13px]",
                        c.align === "r" ? "text-right tabular-nums" : c.align === "c" ? "text-center" : "text-left",
                      )}
                      style={
                        amountSlot >= 0
                          ? {
                              borderLeft: "1px solid var(--jtgs-line-soft)",
                              color: own ? "var(--jtgs-text)" : "#cbd5e1",
                              fontWeight: own ? 700 : 500,
                              background: own && !on ? "#f8fbfd" : undefined,
                            }
                          : undefined
                      }
                    >
                      {String(v).split(":")[0]}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>

        <tfoot>
          <tr>
            <td
              colSpan={leadSpan}
              className="sticky bottom-0 z-[2] border-t border-[#cbd5e1] bg-[var(--jtgs-foot-bg)] px-3 py-2.5 text-[13px] font-bold text-[var(--jtgs-text-muted)]"
            >
              합계 · {rows.length}건{filterLabel === "전체" ? "" : ` (${filterLabel} 필터)`} / 전체 {totalCount}건
            </td>
            {source.amountCols.map((ci) => (
              <td
                key={ci}
                className="sticky bottom-0 z-[2] border-t border-[#cbd5e1] bg-[var(--jtgs-foot-bg)] px-3 py-2.5 text-right text-[14px] font-extrabold tabular-nums text-[var(--jtgs-text)]"
              >
                {sumOf(ci)}
              </td>
            ))}
            <td
              colSpan={Math.max(1, cols.length + 2 - leadSpan - source.amountCols.length)}
              className="sticky bottom-0 z-[2] border-t border-[#cbd5e1] bg-[var(--jtgs-foot-bg)] px-3 py-2.5"
            />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export { JtgsIfLineGrid }
