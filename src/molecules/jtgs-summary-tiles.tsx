import { cn } from "@/lib/utils"
import { STEP_META, STEP_TOKEN, won } from "@/lib/jtgs-if-logic"
import type { IfLineRow, IfStep } from "@/types/jtgs-if"

export interface JtgsSummaryTilesProps {
  rows: IfLineRow[]
  /** 선택된 진행 상태 (빈 배열 = 전체) */
  selected: IfStep[]
  onSelect: (next: IfStep[]) => void
  className?: string
}

const TILES: (IfStep | "전체")[] = ["전체", "미마감", "마감", "인터페이스", "오류"]

function JtgsSummaryTiles({ rows, selected, onSelect, className }: JtgsSummaryTilesProps) {
  return (
    <div className={cn("flex flex-wrap overflow-hidden rounded-[10px] border border-[var(--jtgs-line)] bg-white", className)}>
      {TILES.map((tile) => {
        const list = tile === "전체" ? rows : rows.filter((r) => r.step === tile)
        const on = tile === "전체" ? selected.length === 0 : selected.length === 1 && selected[0] === tile
        const fg = tile === "전체" ? "var(--jtgs-step-blue-fg)" : STEP_TOKEN[STEP_META[tile].kind].fg
        return (
          <button
            key={tile}
            type="button"
            onClick={() => onSelect(tile === "전체" ? [] : [tile])}
            className={cn(
              "flex min-w-0 flex-[1_1_150px] flex-col gap-[3px] px-4 py-2.5 text-left",
              tile !== "전체" && "border-l border-[var(--jtgs-line)]",
            )}
            style={{
              background: on ? "#f3f8ff" : "transparent",
              boxShadow: on ? `inset 0 -3px 0 ${fg}` : "none",
            }}
          >
            <span className="text-[12px] font-semibold text-[var(--jtgs-text-muted)]">
              {tile === "인터페이스" ? "인터페이스 완료" : tile}
            </span>
            <span
              className="text-[23px] font-extrabold leading-[1.25] tracking-[-.02em] tabular-nums"
              style={{ color: fg }}
            >
              {list.length}
              <span className="ml-1 text-[13px] font-bold">건</span>
            </span>
            <span className="text-[12px] tabular-nums text-[var(--jtgs-text-dim)]">
              {won(list.reduce((a, r) => a + r.amount, 0))}원
            </span>
          </button>
        )
      })}
    </div>
  )
}

export { JtgsSummaryTiles }
