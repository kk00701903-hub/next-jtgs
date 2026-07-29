import * as React from "react"
import { JtgsIfHeaderGrid } from "@/organisms/jtgs-if-header-grid"
import { JtgsIfLineGrid } from "@/organisms/jtgs-if-line-grid"
import { JtgsIfActionBar, type JtgsIfAction } from "@/organisms/jtgs-if-action-bar"
import { JtgsSummaryTiles } from "@/molecules/jtgs-summary-tiles"
import { JtgsStepChip } from "@/molecules/jtgs-step-chip"
import {
  STEP_META, STEP_ORDER, STEP_TOKEN, applyTransition, buildHeaderRows, buildLineSource,
} from "@/lib/jtgs-if-logic"
import type { IfKey, IfOverride, IfStep } from "@/types/jtgs-if"

const KIND_TONE = { fg: "var(--jtgs-kind-fg)", bg: "var(--jtgs-kind-bg)", bd: "var(--jtgs-kind-bd)" }
const KINDS = ["외상·선입금", "현금매출", "신용체크카드", "카드결제 실적"]

/**
 * JTGS010140 · 150 · 160 · 170 을 한 화면으로 통합한 IF 연계 통합 현황.
 * 헤더 그리드에서 인터페이스 단위, 라인 그리드에서 건 단위로 마감·전송을 처리한다.
 */
function JtgsIfIntegrationPage() {
  const [override, setOverride] = React.useState<IfOverride>({})
  const [ifType, setIfType] = React.useState<IfKey | "all">("all")
  const [headSel, setHeadSel] = React.useState<IfKey[]>([])
  const [lineSel, setLineSel] = React.useState<string[]>([])
  const [stepSel, setStepSel] = React.useState<IfStep[]>([])
  const [kindSel, setKindSel] = React.useState<string[]>([])
  const [message, setMessage] = React.useState("")

  const headers = React.useMemo(() => buildHeaderRows(override), [override])
  const source = React.useMemo(() => buildLineSource(ifType, override), [ifType, override])

  const scoped = kindSel.length ? source.rows.filter((r) => kindSel.includes(r.kind)) : source.rows
  const shown = stepSel.length ? scoped.filter((r) => stepSel.includes(r.step)) : scoped
  const filterLabel = stepSel.length === 0 ? "전체" : stepSel.join(" · ")

  const selRows = scoped.filter((r) => lineSel.includes(r.id))
  const selSteps = [...new Set(selRows.map((r) => r.step))]
  const headMode = headSel.length > 0
  const heads = headers.filter((h) => headSel.includes(h.key))

  const gate = (headOk: (h: (typeof headers)[number]) => boolean, step: IfStep) =>
    headMode ? heads.every(headOk) : selRows.length > 0 && selSteps.length === 1 && selSteps[0] === step

  const canClose  = gate((h) => h.unclosed > 0, "미마감")
  const canCancel = gate((h) => h.closed > 0, "마감")
  const canRetry  = gate((h) => h.err > 0, "오류")

  const why =
    !headMode && selSteps.length > 1
      ? "서로 다른 진행 상태를 함께 선택하면 일괄 처리할 수 없습니다"
      : !headMode && selRows.length === 0
        ? "헤더 또는 라인 체크박스로 처리 대상을 먼저 선택하세요"
        : ""

  const selectionLabel = headMode
    ? `인터페이스 ${heads.length}종 · 대상 ${heads.reduce((a, h) => a + h.count, 0)}건`
    : `${selRows.length}건 선택됨`

  const run = (from: IfStep[], to: IfStep, label: string) => () => {
    const { override: next, changed } = applyTransition({
      from, to, override, headerKeys: headSel, lineIds: lineSel,
    })
    setOverride(next)
    setHeadSel([])
    setLineSel([])
    setMessage(changed ? `${label} 처리 완료 · ${changed}건` : `${label} 대상 없음`)
  }

  const actions: JtgsIfAction[] = [
    { label: "마감", variant: "primary", enabled: canClose, hint: "미마감 건만 마감할 수 있습니다", onClick: run(["미마감"], "마감", "마감") },
    { label: "마감 취소", variant: "danger", enabled: canCancel, hint: "마감 완료된 건만 취소할 수 있습니다", onClick: run(["마감"], "미마감", "마감 취소") },
    { label: "인터페이스 전송", variant: "secondary", enabled: canCancel, hint: "마감 완료된 건만 전송할 수 있습니다", onClick: run(["마감"], "인터페이스", "인터페이스 전송") },
    { label: "오류 재처리", variant: "secondary", enabled: canRetry, hint: "오류 건만 재처리할 수 있습니다", onClick: run(["오류"], "인터페이스", "오류 재처리") },
    { label: "엑셀", variant: "ghost", enabled: true, hint: "현재 필터 기준 내보내기" },
  ]

  return (
    <div className="flex flex-col gap-4 bg-[var(--jtgs-canvas)] p-5">
      {/* 화면 제목·설명은 Shell 헤더가 담당한다 */}
      <section className="flex flex-col gap-2">
        <h2 className="text-[13px] font-extrabold text-[var(--jtgs-text)]">인터페이스 현황</h2>
        <JtgsIfHeaderGrid
          rows={headers}
          selected={headSel}
          onSelectedChange={(next) => { setHeadSel(next); setLineSel([]) }}
          activeType={ifType}
          onActiveTypeChange={(next) => { setIfType(next); setLineSel([]); setKindSel([]) }}
        />
      </section>

      <JtgsSummaryTiles
        rows={scoped}
        selected={stepSel}
        onSelect={(next) => { setStepSel(next); setLineSel([]) }}
      />

      <div className="flex flex-wrap items-center gap-2">
        {STEP_ORDER.map((step) => (
          <JtgsStepChip
            key={step}
            label={step}
            count={scoped.filter((r) => r.step === step).length}
            checked={stepSel.includes(step)}
            tone={STEP_TOKEN[STEP_META[step].kind]}
            onToggle={() => {
              setStepSel(stepSel.includes(step) ? stepSel.filter((x) => x !== step) : [...stepSel, step])
              setLineSel([])
            }}
          />
        ))}
        {source.unified && (
          <>
            <span className="mx-1 h-5 w-px bg-[var(--jtgs-line)]" />
            {KINDS.map((kind) => (
              <JtgsStepChip
                key={kind}
                label={kind}
                count={source.rows.filter((r) => r.kind === kind).length}
                checked={kindSel.includes(kind)}
                tone={KIND_TONE}
                onToggle={() => {
                  setKindSel(kindSel.includes(kind) ? kindSel.filter((x) => x !== kind) : [...kindSel, kind])
                  setLineSel([])
                }}
              />
            ))}
          </>
        )}
        {(stepSel.length > 0 || kindSel.length > 0) && (
          <button
            type="button"
            onClick={() => { setStepSel([]); setKindSel([]); setLineSel([]) }}
            className="text-[12px] font-bold text-[var(--jtgs-step-blue-fg)] underline underline-offset-2"
          >
            필터 해제
          </button>
        )}
      </div>

      <section className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[13px] font-extrabold text-[var(--jtgs-text)]">인터페이스 대상 라인</h2>
          <JtgsIfActionBar actions={actions} selectionLabel={selectionLabel} why={why} />
        </div>
        <JtgsIfLineGrid
          source={source}
          rows={shown}
          totalCount={scoped.length}
          selected={lineSel}
          onSelectedChange={setLineSel}
          filterLabel={filterLabel}
        />
      </section>

      <div className="min-h-5 text-[12px] font-semibold text-[var(--jtgs-text-muted)]">{message}</div>
    </div>
  )
}

export { JtgsIfIntegrationPage }
