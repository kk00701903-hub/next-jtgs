/** NFR-02-03 card masking */
export function maskCard(raw: string): string {
  const s = String(raw || '')
  if (!s || s === '-') return s
  if (s.includes('*')) return s
  const digits = s.replace(/\D/g, '')
  if (digits.length < 8) return s
  const first = digits.slice(0, 4)
  const last = digits.slice(-4)
  return `${first}-****-****-${last}`
}

/** 요구 3: 신규 등록 기본일자를 당일로 */
export function todayStr(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function todayMonthStr(): string {
  return todayStr().slice(0, 7)
}

export function parseNumberLoose(v: unknown): number | null {
  if (v === '' || v === null || v === undefined) return null
  const n = Number(String(v).replace(/,/g, '').trim())
  return Number.isFinite(n) ? n : null
}

/** FR-02-03 modal field validation */
export function validateRecDraft(
  fields: { k: string; label: string; required?: boolean; kind?: string }[],
  draft: Record<string, unknown> | null,
): string | null {
  if (!draft) return '입력값이 없습니다.'
  const missing = fields.filter((f) => f.required && !String(draft[f.k] ?? '').trim())
  if (missing.length) {
    return missing.map((f) => f.label).join(' · ') + ' 은(는) 필수 입력입니다.'
  }
  for (const f of fields) {
    const label = f.label
    const raw = draft[f.k]
    if (/수량|단가|금액|한도|미수/.test(label) && raw !== undefined && String(raw).trim() !== '') {
      const n = parseNumberLoose(raw)
      if (n === null) return `${label} 은(는) 숫자로 입력하세요.`
      if (n < 0) return `${label} 에 음수는 입력할 수 없습니다.`
      if (/단가/.test(label) && n > 100000) return `${label} 이상치 감지(100,000 초과). 확인 후 다시 입력하세요.`
      if (/수량/.test(label) && n > 1000000) return `${label} 이상치 감지. 확인 후 다시 입력하세요.`
      // 요구 5: 수량은 소수점 4자리까지, 단가는 정수만
      const decimals = (String(raw).split('.')[1] || '').replace(/[^0-9]/g, '').length
      if (/수량/.test(label) && decimals > 4) {
        return `${label} 은(는) 소수점 4자리까지 입력할 수 있습니다.`
      }
      if (/단가/.test(label) && !Number.isInteger(n)) {
        return `${label} 은(는) 소수점 없이 정수로 입력하세요.`
      }
    }
  }
  return null
}

/** Client-side row filter using applied filter map + column labels */
export function filterRows(
  rows: string[][],
  cols: { label: string }[],
  applied: Record<string, string>,
): string[][] {
  const entries = Object.entries(applied || {}).filter(([, v]) => v && v !== '전체' && String(v).trim() !== '')
  if (!entries.length) return rows

  return rows.filter((cells) =>
    entries.every(([label, value]) => {
      const idx = cols.findIndex((c) => c.label === label || c.label.startsWith(label))
      // text search filters (거래처명, 고객명, 코드명)
      if (idx < 0) {
        if (/명|검색|코드명/.test(label)) {
          return cells.some((c) => String(c).includes(String(value)))
        }
        // date/month filters often not in row as-is — skip match (keep row)
        if (/일|월|일자|처리/.test(label)) return true
        return true
      }
      const cell = String(cells[idx] ?? '')
      const cellPlain = cell.split(':')[0]
      return cellPlain.includes(String(value)) || cell.includes(String(value))
    }),
  )
}
