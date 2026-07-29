import { IF_META, IF_ORDER, IF_SEED } from "@/data/jtgs-if-seed"
import type {
  ColDef, ColSpec, IfHeaderRow, IfKey, IfLineRow, IfLineSource, IfOverride, IfStep, StepKind,
} from "@/types/jtgs-if"

export const STEP_ORDER: IfStep[] = ["미마감", "마감", "인터페이스", "오류"]

export const STEP_META: Record<IfStep, { kind: StepKind; note: string; label: string }> = {
  "미마감":      { kind: "gray",  note: "실적 확정 전",        label: "미마감" },
  "마감":        { kind: "blue",  note: "마감 완료 · 전송 대기", label: "마감" },
  "인터페이스":  { kind: "green", note: "IF 전송 완료",         label: "인터페이스 완료" },
  "오류":        { kind: "red",   note: "재처리 필요",          label: "오류" },
}

export const STEP_TOKEN: Record<StepKind, { fg: string; bg: string; bd: string }> = {
  gray:  { fg: "var(--jtgs-step-gray-fg)",  bg: "var(--jtgs-step-gray-bg)",  bd: "var(--jtgs-step-gray-bd)" },
  blue:  { fg: "var(--jtgs-step-blue-fg)",  bg: "var(--jtgs-step-blue-bg)",  bd: "var(--jtgs-step-blue-bd)" },
  green: { fg: "var(--jtgs-step-green-fg)", bg: "var(--jtgs-step-green-bg)", bd: "var(--jtgs-step-green-bd)" },
  red:   { fg: "var(--jtgs-step-red-fg)",   bg: "var(--jtgs-step-red-bg)",   bd: "var(--jtgs-step-red-bd)" },
}

export const num = (v: unknown) => Number(String(v ?? "").replace(/[^0-9.-]/g, "")) || 0
export const won = (n: number) => Math.round(n).toLocaleString("ko-KR")

export function parseCol(spec: ColSpec): ColDef {
  const [label, align = "l", width] = spec.split("|")
  return { label, align: align as ColDef["align"], width: width ? Number(width) : undefined }
}

/** 전송결과 문자열 → 업무 진행 단계 */
export function stepOf(sendResult: string): IfStep {
  const s = String(sendResult).split(":")[0]
  if (/오류|차이발생/.test(s)) return "오류"
  if (/처리완료|검증완료/.test(s)) return "인터페이스"
  if (/처리중|검증대기/.test(s)) return "마감"
  return "미마감"
}

const statusIdxOf = (cols: ColSpec[]) => cols.findIndex((c) => /전송결과/.test(c.split("|")[0]))
const timeIdxOf   = (cols: ColSpec[]) => cols.findIndex((c) => /처리시각/.test(c.split("|")[0]))

/** override를 얹은 실제 진행 단계 */
export function stepAt(key: IfKey, rowIndex: number, raw: string, override: IfOverride): IfStep {
  return override[`${key}:${rowIndex}`] ?? stepOf(raw)
}

/** 헤더 그리드 — 인터페이스 4종 집계 */
export function buildHeaderRows(override: IfOverride): IfHeaderRow[] {
  return IF_ORDER.map((k) => {
    const src = IF_SEED[k]
    const si = statusIdxOf(src.cols)
    const ti = timeIdxOf(src.cols)
    const steps = src.rows.map((r, i) => stepAt(k, i, r[si], override))
    const cnt = (s: IfStep) => steps.filter((x) => x === s).length
    const times = ti < 0 ? [] : src.rows.map((r) => r[ti]).filter((x) => x && x !== "-")
    const err = cnt("오류"), unclosed = cnt("미마감"), closed = cnt("마감"), done = cnt("인터페이스")
    return {
      ...IF_META[k],
      count: src.rows.length,
      unclosed, closed, done, err,
      amount: src.rows.reduce((a, r) => a + num(r[src.amountIdx]), 0),
      last: times.length ? [...times].sort().slice(-1)[0] : "—",
      step: err ? "오류" : unclosed ? "미마감" : closed ? "마감" : "인터페이스",
    }
  })
}

const UNIFIED_MAP: Record<IfKey, { date: number; target: number; kind: number; amount: number; time: number | null }> = {
  credit: { date: 0, target: 3, kind: 4, amount: 7, time: 9 },
  cash:   { date: 0, target: 3, kind: 8, amount: 7, time: null },
  card:   { date: 0, target: 2, kind: 4, amount: 6, time: null },
  result: { date: 0, target: 2, kind: 4, amount: 5, time: null },
}

const UNIFIED_COLS: ColSpec[] = [
  "처리일|l|104", "주유소|l|76", "대상|l", "구분|l|88",
  "외상·선입금|r|122", "현금매출|r|112", "신용체크카드|r|122", "카드결제 실적|r|122",
  "전송결과|l|100", "처리시각|l|88", "오류내용|l|160",
]

/**
 * 라인 그리드 소스.
 * ifType이 "all"이면 4종을 한 그리드로 정규화하고, 종류별 고유 컬럼은 '대상 · 구분'으로 접는다.
 */
export function buildLineSource(ifType: IfKey | "all", override: IfOverride): IfLineSource {
  if (ifType !== "all") {
    const src = IF_SEED[ifType]
    const si = statusIdxOf(src.cols)
    return {
      cols: src.cols,
      statusIdx: si,
      amountCols: [src.amountIdx],
      unified: false,
      rows: src.rows.map((cells, i) => ({
        id: `${ifType}:${i}`,
        ifKey: ifType,
        kind: IF_META[ifType].label,
        cells,
        step: stepAt(ifType, i, cells[si], override),
        amount: num(cells[src.amountIdx]),
      })),
    }
  }

  const rows: IfLineRow[] = []
  IF_ORDER.forEach((k, ki) => {
    const src = IF_SEED[k]
    const m = UNIFIED_MAP[k]
    const si = statusIdxOf(src.cols)
    src.rows.forEach((r, ri) => {
      const amt = ["-", "-", "-", "-"]
      amt[ki] = r[m.amount]
      rows.push({
        id: `${k}:${ri}`,
        ifKey: k,
        kind: IF_META[k].label,
        cells: [r[m.date], r[1], r[m.target], r[m.kind], ...amt,
          r[si], m.time == null ? "-" : r[m.time], r[r.length - 1]],
        step: stepAt(k, ri, r[si], override),
        amount: num(r[m.amount]),
      })
    })
  })

  return { cols: UNIFIED_COLS, rows, amountCols: [4, 5, 6, 7], statusIdx: 8, unified: true }
}

export interface ApplyArgs {
  from: IfStep[]
  to: IfStep
  override: IfOverride
  /** 헤더 체크 시 해당 인터페이스 전체가 대상 */
  headerKeys?: IfKey[]
  /** 라인 체크 시 대상 라인 id 목록 */
  lineIds?: string[]
}

/** 마감 · 마감취소 · 전송 · 재처리 상태 전이 */
export function applyTransition({ from, to, override, headerKeys = [], lineIds = [] }: ApplyArgs) {
  const next: IfOverride = { ...override }
  let changed = 0

  const touch = (key: IfKey, i: number) => {
    const src = IF_SEED[key]
    const si = statusIdxOf(src.cols)
    const cur = stepAt(key, i, src.rows[i][si], override)
    if (from.includes(cur)) {
      next[`${key}:${i}`] = to
      changed++
    }
  }

  if (headerKeys.length) {
    headerKeys.forEach((key) => IF_SEED[key].rows.forEach((_, i) => touch(key, i)))
  } else {
    lineIds.forEach((id) => {
      const [key, ri] = id.split(":")
      touch(key as IfKey, Number(ri))
    })
  }

  return { override: next, changed }
}
