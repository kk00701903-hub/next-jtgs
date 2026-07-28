import { DASH } from '../jtgs/data.js'

const delay = (ms = 220) => new Promise((r) => setTimeout(r, ms))

/** FR-03-01: CSR mock fetch with slight latency for Query cache demo */
export async function fetchDashboard() {
  await delay(280)
  return DASH
}

export async function fetchGridTick(key: string) {
  await delay(180)
  return { key, fetchedAt: Date.now() }
}
