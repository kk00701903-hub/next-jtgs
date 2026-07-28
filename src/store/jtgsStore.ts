import { create } from 'zustand'
import {
  SEED_CODES,
  SEED_STACK,
  SEED_REQS,
} from '../jtgs/data.js'

export type CodeRow = {
  group: string
  code: string
  name: string
  en: string
  sort: string
  use: string
  updated?: string
  editor?: string
}

export type StackRow = { area: string; cat: string; items: string; why: string }
export type ReqRow = {
  kind: string
  cat: string
  id: string
  name: string
  detail: string
  pri: string
  memo: string
}

type ModalState = Record<string, unknown> | null

type JtgsState = {
  view: string
  seg: Record<string, string>
  tab: string | null
  collapsed: boolean
  sel: number | null
  msg: string
  modal: ModalState
  codes: CodeRow[]
  stack: StackRow[]
  reqs: ReqRow[]
  selRec: { stack: number | null; req: number | null }
  draft: Record<string, unknown> | null
  filterDraft: Record<string, string>
  filterApplied: Record<string, string>
  sidebarOpen: boolean
  navCollapsed: boolean
  favorites: Record<string, boolean>
  modalError: string
  /** 요구 2: 일마감 캘린더에서 일자별로 직접 바꾼 open/close 상태 */
  closeStates: Record<string, string>
  ifRowOverrides: Record<string, string[][]>
  setView: (view: string) => void
  select: (gk: string, k: string) => void
  setTab: (tab: string | null) => void
  setCollapsed: (v: boolean) => void
  toggleCollapse: () => void
  setSel: (sel: number | null) => void
  setMsg: (msg: string) => void
  setModal: (modal: ModalState) => void
  setDraft: (draft: Record<string, unknown> | null | ((d: Record<string, unknown> | null) => Record<string, unknown> | null)) => void
  patchDraft: (k: string, v: unknown) => void
  setCodes: (codes: CodeRow[]) => void
  setStack: (stack: StackRow[]) => void
  setReqs: (reqs: ReqRow[]) => void
  setSelRec: (selRec: { stack: number | null; req: number | null }) => void
  setFilterDraft: (label: string, value: string) => void
  resetFilters: (defaults: Record<string, string>) => void
  applyFilters: () => void
  setSidebarOpen: (v: boolean) => void
  toggleSidebar: () => void
  toggleNavCollapsed: () => void
  toggleFavorite: (key: string) => void
  setModalError: (modalError: string) => void
  setCloseState: (date: string, state: string) => void
  setIfRowOverrides: (key: string, rows: string[][]) => void
}

export const useJtgsStore = create<JtgsState>((set) => ({
  view: 'dash',
  seg: {},
  tab: null,
  collapsed: true,
  sel: null,
  msg: '',
  modal: null,
  codes: SEED_CODES.map((c) => ({ ...c })),
  stack: SEED_STACK.map((c) => ({ ...c })),
  reqs: SEED_REQS.map((c) => ({ ...c })),
  selRec: { stack: null, req: null },
  draft: null,
  filterDraft: {},
  filterApplied: {},
  sidebarOpen: false,
  navCollapsed: false,
  favorites: {},
  modalError: '',
  closeStates: {},
  ifRowOverrides: {},
  setView: (view) => set({ view, tab: null, sel: null, msg: '', sidebarOpen: false, collapsed: true }),
  select: (gk, k) =>
    set((s) => ({
      view: gk,
      seg: { ...s.seg, [gk]: k },
      tab: null,
      sel: null,
      msg: '',
      sidebarOpen: false,
      collapsed: true,
    })),
  setTab: (tab) => set({ tab, sel: null }),
  setCollapsed: (collapsed) => set({ collapsed }),
  toggleCollapse: () => set((s) => ({ collapsed: !s.collapsed })),
  setSel: (sel) => set({ sel }),
  setMsg: (msg) => set({ msg }),
  setModal: (modal) => set({ modal }),
  setDraft: (draft) =>
    set((s) => ({
      draft: typeof draft === 'function' ? draft(s.draft) : draft,
    })),
  patchDraft: (k, v) =>
    set((s) => ({ draft: { ...(s.draft || {}), [k]: v } })),
  setCodes: (codes) => set({ codes }),
  setStack: (stack) => set({ stack }),
  setReqs: (reqs) => set({ reqs }),
  setSelRec: (selRec) => set({ selRec }),
  setFilterDraft: (label, value) =>
    set((s) => ({ filterDraft: { ...s.filterDraft, [label]: value } })),
  resetFilters: (defaults) =>
    set({ filterDraft: { ...defaults }, filterApplied: { ...defaults } }),
  applyFilters: () => set((s) => ({ filterApplied: { ...s.filterDraft } })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleNavCollapsed: () => set((s) => ({ navCollapsed: !s.navCollapsed })),
  toggleFavorite: (key) =>
    set((s) => ({ favorites: { ...s.favorites, [key]: !s.favorites[key] } })),
  setModalError: (modalError) => set({ modalError }),
  setCloseState: (date, state) =>
    set((s) => ({ closeStates: { ...s.closeStates, [date]: state } })),
  setIfRowOverrides: (key, rows) =>
    set((s) => ({ ifRowOverrides: { ...s.ifRowOverrides, [key]: rows } })),
}))
