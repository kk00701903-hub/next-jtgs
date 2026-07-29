// IF 연계 통합 현황 도메인 타입

/** 통합 대상 인터페이스 4종 */
export type IfKey = "credit" | "cash" | "card" | "result"

/** 전송결과를 업무 관점으로 접은 진행 단계 */
export type IfStep = "미마감" | "마감" | "인터페이스" | "오류"

export type StepKind = "gray" | "blue" | "green" | "red"

/** "라벨|정렬|폭" 형식의 컬럼 정의 */
export type ColSpec = string

export interface ColDef {
  label: string
  align: "l" | "c" | "r"
  width?: number
}

/** 화면별 원본 그리드 (API 응답 형태) */
export interface IfRawTable {
  cols: ColSpec[]
  /** 금액 합계 대상 컬럼 인덱스 */
  amountIdx: number
  rows: string[][]
}

export interface IfMeta {
  key: IfKey
  label: string
  /** 마감 주기 */
  cycle: "일마감" | "월마감"
  /** 원 화면 코드 */
  code: string
  /** 인터페이스 대상 설명 */
  target: string
}

/** 헤더 그리드 한 줄 = 인터페이스 1종의 집계 */
export interface IfHeaderRow extends IfMeta {
  count: number
  unclosed: number
  closed: number
  done: number
  err: number
  amount: number
  /** 마지막 처리시각 */
  last: string
  step: IfStep
}

/** 정규화된 라인 그리드 한 줄 */
export interface IfLineRow {
  /** `${IfKey}:${rowIndex}` */
  id: string
  ifKey: IfKey
  kind: string
  cells: string[]
  step: IfStep
  amount: number
}

export interface IfLineSource {
  cols: ColSpec[]
  rows: IfLineRow[]
  /** 통합 모드에서 인터페이스별 금액 컬럼 인덱스 */
  amountCols: number[]
  statusIdx: number
  unified: boolean
}

/** 화면에서 실행한 상태 전이 (`${IfKey}:${rowIndex}` → 단계) */
export type IfOverride = Record<string, IfStep>
