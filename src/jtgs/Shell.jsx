import React, { useEffect, useRef } from "react";

export function Shell({ v }) {
  const navScrollTimer = useRef(null);
  const modalCloseRef = useRef(null);

  const onSidebarScroll = (e) => {
    const el = e.currentTarget;
    el.classList.add("is-scrolling");
    clearTimeout(navScrollTimer.current);
    navScrollTimer.current = setTimeout(() => {
      el.classList.remove("is-scrolling");
    }, 700);
  };

  const {
    navRows, segments, tabs, cols, rows, foot, hasFoot,
    headTitle, headSub, summary, expanded, collapseLabel, toggleCollapse, doSearch, doResetFilters,
    filters, metrics, gridTitle, gridCount, mergeNote, actions,
    segLabel, segNote,
    isGrid, isDash, isArch, isReq, isCheck,
    checkGroups, checkMetrics,
    dashKpis, dashStations, dashTanks, dashIf, dashLog, dashJump, dashTankAlert,
    statusLeft, statusRight,
    hasModal, modalTitle, modalSub, closeModal, submitModal,
    modalIsForm, modalIsRec, modalIsConfirm, modalFields, modalRecFields, modalLines,
    modalConfirmClass, modalConfirmLabel,
    stackHint, stackActions, stackAreas, layers,
    reqHint, reqActions, reqTables,
    loading, sidebarOpen, toggleSidebar, closeSidebar, refreshAll,
  } = v;

  useEffect(() => {
    if (!hasModal) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    modalCloseRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [hasModal, closeModal]);

  const colCount = (cols || []).length || 1;

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--fass-bg)] relative">
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="사이드바 닫기"
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
          onClick={closeSidebar}
        />
      ) : null}

      <nav
        aria-label="주 메뉴"
        className={[
          "fixed md:static z-50 md:z-auto inset-y-0 left-0 w-56 shrink-0 bg-[var(--fass-navy)] text-white flex flex-col shadow-[2px_0_8px_rgba(0,0,0,.12)]",
          "transition-transform duration-200 md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center gap-2.5 px-[18px] pt-4 pb-3.5 border-b border-white/10">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-white/15 flex items-center justify-center text-[15px] font-bold tracking-tight">JT</div>
          <div className="flex flex-col gap-px min-w-0">
            <span className="text-[15px] font-semibold tracking-tight">주유소 관리시스템</span>
            <span className="text-[12px] text-white/55">JETTE Supply Control · FASS</span>
          </div>
        </div>

        <div className="fass-scroll sidebar-scroll flex-1 overflow-y-auto py-2" onScroll={onSidebarScroll}>
          {(navRows || []).map((row, row__i) => (
            <React.Fragment key={row__i}>
              {row.isGroup ? <div className="fass-nav-group">{row.label}</div> : null}
              {row.isItem ? (
                <button
                  type="button"
                  className={["fass-nav-item", row.active ? "is-active" : ""].filter(Boolean).join(" ")}
                  aria-current={row.active ? "page" : undefined}
                  onClick={() => {
                    row.onClick();
                    closeSidebar();
                  }}
                >
                  <span className="w-4 shrink-0 text-center text-[13px] opacity-80" aria-hidden="true">{row.mark}</span>
                  <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{row.label}</span>
                </button>
              ) : null}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-2.5 px-[18px] py-3 border-t border-white/10">
          <div className="w-[30px] h-[30px] shrink-0 rounded-full bg-white/20 flex items-center justify-center text-[13px] font-semibold">한</div>
          <div className="flex flex-col gap-px min-w-0">
            <span className="text-sm font-semibold">한성민 프로</span>
            <span className="text-[12px] text-white/55">정보전략팀</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <header className="h-14 shrink-0 flex items-center gap-3 px-5 bg-[var(--fass-surface)] border-b border-[var(--fass-line)] shadow-[var(--shadow-sm)]">
          <button type="button" className="fass-btn is-secondary is-sm md:hidden" onClick={toggleSidebar}>
            메뉴
          </button>
          <h1 className="fass-title-page whitespace-nowrap shrink-0 m-0">{headTitle}</h1>
          <span className="fass-muted min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{headSub}</span>
          <div className="flex-1" />
          {loading ? <span className="fass-subtle text-[var(--fass-accent)] font-semibold">로딩…</span> : null}
          <button type="button" className="fass-btn is-secondary is-sm shrink-0" onClick={refreshAll}>새로고침</button>
        </header>

        <div className="fass-scroll flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {isGrid ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="fass-label shrink-0">{segLabel}</span>
                <div className="flex gap-1 p-1 bg-[var(--fass-surface)] border border-[var(--fass-line)] rounded-md shadow-[var(--shadow-sm)] flex-wrap">
                  {(segments || []).map((seg, seg__i) => (
                    <button
                      key={seg__i}
                      type="button"
                      className={["fass-seg", seg.active ? "is-active" : ""].filter(Boolean).join(" ")}
                      onClick={seg.onClick}
                    >
                      {seg.label}
                      <span className="fass-seg__code">{seg.code}</span>
                    </button>
                  ))}
                </div>
                <span className="ml-auto fass-subtle">{segNote}</span>
              </div>

              <section aria-label="조회 조건" className="fass-panel shrink-0">
                <div className="fass-panel__head !px-3">
                  <strong className="fass-title-section shrink-0">조회 조건</strong>
                  <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap fass-label">{summary}</span>
                  <button type="button" className="fass-btn is-secondary is-sm ml-auto shrink-0" onClick={toggleCollapse}>
                    {collapseLabel}
                  </button>
                </div>
                {expanded ? (
                  <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] items-end gap-3 p-3">
                    <div className="min-w-0 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] items-end gap-x-3 gap-y-2">
                      {(filters || []).map((f, f__i) => (
                        <div key={f__i} className="flex flex-col gap-1">
                          <label className="fass-label">{f.label}</label>
                          {f.isSelect ? (
                            <select className="fass-field" value={f.value} onChange={f.onChange}>
                              {(f.options || []).map((opt, opt__i) => (
                                <option key={opt__i} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : null}
                          {f.isInput ? (
                            <input className="fass-field" type={f.type} value={f.value} onChange={f.onChange} placeholder={f.placeholder} />
                          ) : null}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-end gap-1.5">
                      <button type="button" className="fass-btn is-ghost" onClick={doResetFilters}>초기화</button>
                      <button type="button" className="fass-btn is-primary" onClick={doSearch}>조회</button>
                    </div>
                  </div>
                ) : null}
              </section>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2.5">
                {(metrics || []).map((m, m__i) => (
                  <div key={m__i} className="fass-metric">
                    <span className="fass-label leading-none">{m.label}</span>
                    <div className="flex items-baseline gap-1">
                      <span style={m.valueStyle}>{m.value}</span>
                      <span className="text-sm font-normal text-[var(--fass-muted)] leading-none">{m.unit}</span>
                    </div>
                    <span className="fass-subtle leading-none">{m.note}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 h-[42px] px-2 bg-[var(--fass-surface)] border border-[var(--fass-line)] border-b-0 rounded-t-[var(--fass-radius-lg)]">
                  <strong className="fass-title-section px-1 shrink-0">{gridTitle}</strong>
                  <span className="fass-subtle">{gridCount}</span>
                  <div className="ml-auto flex items-center gap-1">
                    {(actions || []).map((a, a__i) => (
                      <button key={a__i} type="button" className={a.className} onClick={a.onClick}>{a.label}</button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-0 h-[38px] px-1.5 bg-[var(--fass-surface)] border-x border-b border-[var(--fass-line)]">
                  {(tabs || []).map((t, t__i) => (
                    <button
                      key={t__i}
                      type="button"
                      className={["fass-tab", t.active ? "is-active" : ""].filter(Boolean).join(" ")}
                      onClick={t.onClick}
                    >
                      {t.label}
                      <span className="fass-tab__count">{t.count}</span>
                    </button>
                  ))}
                </div>

                <div className="fass-scroll bg-[var(--fass-surface)] border border-t-0 border-[var(--fass-line)] rounded-b-[var(--fass-radius-lg)] overflow-auto max-h-[min(56vh,520px)]">
                  <table className="fass-table">
                    <thead>
                      <tr>
                        {(cols || []).map((c, c__i) => (
                          <th key={c__i} style={c.style}>{c.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(rows || []).length === 0 ? (
                        <tr>
                          <td colSpan={colCount}>
                            <div className="fass-table__empty">
                              <strong>조건에 맞는 내역이 없습니다</strong>
                              조회 조건을 바꾼 뒤 다시 조회하거나 초기화해 보세요.
                              <div className="mt-3">
                                <button type="button" className="fass-btn is-secondary is-sm" onClick={doResetFilters}>조건 초기화</button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        (rows || []).map((r, r__i) => (
                          <tr
                            key={r__i}
                            onClick={r.onClick}
                            className={["is-clickable", r.selected ? "is-selected" : ""].filter(Boolean).join(" ")}
                          >
                            {(r.cells || []).map((c, c__i) => (
                              <td key={c__i} style={c.style}>
                                {c.isBadge ? <span className="fass-badge" style={c.badgeStyle}>{c.v}</span> : null}
                                {c.isText ? c.v : null}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                    {hasFoot && (rows || []).length > 0 ? (
                      <tfoot>
                        <tr>
                          {(foot || []).map((c, c__i) => (
                            <td key={c__i} colSpan={c.span} style={c.style}>{c.v}</td>
                          ))}
                        </tr>
                      </tfoot>
                    ) : null}
                  </table>
                </div>
              </div>

              {mergeNote ? (
                <div className="fass-note">
                  <span className="fass-note__mark">통합 규칙</span>
                  <span className="fass-note__body">{mergeNote}</span>
                </div>
              ) : null}
            </div>
          ) : null}

          {isDash ? (
            <div className="flex flex-col gap-4">
              {loading ? <div className="skel h-16 w-full" /> : null}
              {dashTankAlert ? (
                <div className="fass-alert" role="status">
                  <span className="fass-alert__mark">재고 주의</span>
                  <span className="fass-alert__body">{dashTankAlert}</span>
                </div>
              ) : null}
              <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2.5">
                {(dashKpis || []).map((k, k__i) => (
                  <div key={k__i} style={k.cardStyle}>
                    <span className="fass-label leading-none">{k.label}</span>
                    <span style={k.valueStyle}>{k.value}</span>
                    <span className="fass-subtle leading-snug">{k.note}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-4 items-stretch">
                <div className="flex flex-col gap-4 min-w-0 h-full">
                  <section className="fass-panel flex flex-col flex-1 min-h-0">
                    <div className="fass-panel__head">
                      <strong className="fass-title-section">주유소별 오늘 현황</strong>
                      <span className="fass-subtle">2026-07-27 16:04 기준</span>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 p-4 flex-1 items-stretch">
                      {(dashStations || []).map((s, s__i) => (
                        <div key={s__i} style={s.cardStyle} className="h-full justify-between min-h-[148px]">
                          <div className="flex items-center justify-between gap-2">
                            <strong className="fass-title-section">{s.name}</strong>
                            <span className="fass-badge" style={s.badgeStyle}>{s.badge}</span>
                          </div>
                          <div className="flex flex-col gap-2.5 mt-3">
                            {(s.rows || []).map((row, row__i) => (
                              <div key={row__i} className="flex items-center justify-between gap-2 text-[var(--font-size-sm)]">
                                <span className="text-[var(--fass-muted)]">{row.k}</span>
                                <span className="text-[var(--fass-text)] font-semibold tabular-nums">{row.v}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="fass-panel flex flex-col flex-1 min-h-0">
                    <div className="fass-panel__head">
                      <strong className="fass-title-section">유류 재고 적재율</strong>
                      <span className="fass-subtle">안전재고 대비</span>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 p-4 flex-1 items-stretch">
                      {(dashTanks || []).map((s, s__i) => (
                        <div key={s__i} className="flex flex-col gap-3 p-4 min-h-[168px] h-full justify-between bg-[var(--fass-surface-alt)] border border-[var(--fass-line)] rounded-[var(--fass-radius-md)]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="fass-title-section">{s.station}</span>
                            <span style={s.stateStyle}>{s.state}</span>
                          </div>
                          <div className="flex flex-col gap-3.5 flex-1 justify-center">
                            {(s.fuels || []).map((f, f__i) => (
                              <div key={f__i} className="flex flex-col gap-1.5">
                                <div className="flex items-baseline justify-between gap-2">
                                  <span className="fass-label">{f.label}</span>
                                  <span style={f.pctStyle}>{f.pct}</span>
                                </div>
                                <div className="h-2.5 rounded-full bg-[var(--fass-line-soft)] overflow-hidden">
                                  <div style={f.barStyle} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="flex flex-col gap-4 min-w-0 h-full">
                  <section className="fass-panel">
                    <div className="fass-panel__head">
                      <strong className="fass-title-section">IF 처리 현황 (오늘)</strong>
                    </div>
                    <table className="fass-table">
                      <thead>
                        <tr>
                          <th className="!px-3.5">구분</th>
                          <th className="!text-right !px-2.5">전체</th>
                          <th className="!text-right !px-2.5 !text-[var(--fass-success)]">성공</th>
                          <th className="!text-right !px-3.5 !text-[var(--fass-danger)]">오류</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(dashIf || []).map((r, r__i) => (
                          <tr key={r__i}>
                            <td className="!px-3.5">{r.name}</td>
                            <td className="is-num !px-2.5">{r.total}</td>
                            <td className="is-num !px-2.5 !text-[var(--fass-success)] font-medium">{r.ok}</td>
                            <td className="is-num !px-3.5 !text-[var(--fass-danger)] font-medium">{r.err}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>

                  <section className="fass-panel flex-1 flex flex-col min-h-0">
                    <div className="fass-panel__head">
                      <strong className="fass-title-section">최근 활동</strong>
                    </div>
                    <div className="flex flex-col gap-3 p-4 flex-1">
                      {(dashLog || []).map((l, l__i) => (
                        <div key={l__i} className="flex gap-2.5">
                          <div style={l.dotStyle} />
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-sm text-[var(--fass-text)] leading-snug">{l.text}</span>
                            <span className="fass-subtle">{l.meta}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="fass-panel">
                    <div className="fass-panel__head">
                      <strong className="fass-title-section">바로 가기</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-3.5">
                      {(dashJump || []).map((j, j__i) => (
                        <button key={j__i} type="button" className="fass-jump" onClick={j.onClick}>
                          <span className="text-sm font-semibold text-[var(--fass-text)]">{j.label}</span>
                          <span className="text-[12px] text-[var(--fass-muted)]">{j.note}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          ) : null}

          {isArch ? (
            <>
              <div className="fass-panel flex items-center gap-2.5 px-3.5 py-2.5 !overflow-visible">
                <strong className="fass-title-section">기술 스택 항목</strong>
                <span className="fass-subtle">{stackHint}</span>
                <div className="ml-auto flex gap-1.5">
                  {(stackActions || []).map((a, a__i) => (
                    <button key={a__i} type="button" className={a.className} onClick={a.onClick}>{a.label}</button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start min-w-0">
                  <div className="flex flex-col gap-4">
                    {(stackAreas || []).map((a, a__i) => (
                      <section key={a__i} className="fass-panel">
                        <div style={a.headStyle}>
                          <strong style={a.titleStyle}>{a.area}</strong>
                          <span className="ml-auto fass-subtle font-semibold">{a.count}</span>
                        </div>
                        <div className="flex flex-col">
                          {(a.rows || []).map((r, r__i) => (
                            <div
                              key={r__i}
                              role="button"
                              tabIndex={0}
                              onClick={r.onClick}
                              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); r.onClick(); } }}
                              style={r.rowStyle}
                            >
                              <span className="text-sm font-semibold text-[var(--fass-text)] leading-snug">{r.cat}</span>
                              <div className="flex flex-col gap-1.5 min-w-0">
                                <div className="flex flex-wrap gap-1.5">
                                  {(r.chips || []).map((c, c__i) => (
                                    <span key={c__i} style={c.style}>{c.name}</span>
                                  ))}
                                </div>
                                <span className="text-sm text-[var(--fass-muted)] leading-relaxed text-pretty">{r.why}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>

                  <section className="fass-panel">
                    <div className="fass-panel__head">
                      <strong className="fass-title-section">레이어 구성</strong>
                      <span className="fass-subtle">외부망 → 데이터</span>
                    </div>
                    <div className="flex flex-col gap-2.5 p-3.5">
                      {(layers || []).map((l, l__i) => (
                        <div key={l__i} className="flex gap-2.5 items-stretch">
                          <div style={l.barStyle} />
                          <div className="flex flex-col gap-1 min-w-0 flex-1">
                            <div className="flex items-baseline gap-1.5">
                              <span className="fass-title-section">{l.name}</span>
                              <span className="fass-subtle font-semibold">{l.note}</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              {(l.nodes || []).map((n, n__i) => (
                                <span key={n__i} className="fass-subtle font-mono leading-normal">{n.name}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </>
          ) : null}

          {isReq ? (
            <div className="flex flex-col gap-4">
              <div className="fass-panel flex items-center gap-2.5 px-3.5 py-2.5 !overflow-visible">
                <strong className="fass-title-section">요구사항 항목</strong>
                <span className="fass-subtle">{reqHint}</span>
                <div className="ml-auto flex gap-1.5">
                  {(reqActions || []).map((a, a__i) => (
                    <button key={a__i} type="button" className={a.className} onClick={a.onClick}>{a.label}</button>
                  ))}
                </div>
              </div>
              {(reqTables || []).map((t, t__i) => (
                <section key={t__i} className="fass-panel">
                  <div className="fass-panel__head">
                    <strong className="fass-title-section">{t.title}</strong>
                    <span className="fass-subtle">{t.note}</span>
                  </div>
                  <div className="fass-scroll overflow-x-auto">
                    <table className="fass-table min-w-[1040px]">
                      <thead>
                        <tr>
                          <th className="!px-3.5 w-[180px]">분류</th>
                          <th className="!px-2.5 w-24">ID</th>
                          <th className="!px-2.5 w-[200px]">요구사항명</th>
                          <th className="!px-2.5">상세 내용</th>
                          <th className="!px-3.5 w-[92px]">우선순위</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(t.rows || []).map((r, r__i) => (
                          <tr
                            key={r__i}
                            onClick={r.onClick}
                            className={["is-clickable", r.selected ? "is-selected" : ""].filter(Boolean).join(" ")}
                          >
                            <td className="!px-3.5 text-[var(--fass-muted)]">{r.cat}</td>
                            <td className="!px-2.5 font-mono text-[var(--font-size-xs)] font-semibold text-[var(--fass-accent-strong)]">{r.id}</td>
                            <td className="!px-2.5 font-semibold">{r.name}</td>
                            <td className="!px-2.5 text-[var(--fass-muted)] leading-snug">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-pretty">{r.detail}</span>
                                {r.hasMemo ? (
                                  <span className="text-[var(--font-size-xs)] text-[var(--fass-warning)] font-semibold">※ {r.memo}</span>
                                ) : null}
                              </div>
                            </td>
                            <td className="!px-3.5">
                              {r.hasPri ? <span className="fass-badge" style={r.priStyle}>{r.pri}</span> : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          ) : null}

          {isCheck ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2.5">
                {(checkMetrics || []).map((m, m__i) => (
                  <div key={m__i} className="fass-metric">
                    <span className="fass-label leading-none">{m.label}</span>
                    <span style={m.valueStyle}>{m.value}</span>
                    <span className="fass-subtle leading-none">{m.note}</span>
                  </div>
                ))}
              </div>

              {(checkGroups || []).map((g, g__i) => (
                <section key={g__i} className="fass-panel">
                  <div className="fass-panel__head">
                    <strong className="fass-title-section">{g.title}</strong>
                    <span className="fass-subtle">{g.note}</span>
                  </div>
                  <table className="fass-table">
                    <thead>
                      <tr>
                        <th className="!px-3.5 w-[200px]">소스 컴포넌트</th>
                        <th className="!px-2.5 w-[110px]">반영 상태</th>
                        <th className="!px-2.5">확인 내용</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(g.items || []).map((it, it__i) => (
                        <tr key={it__i}>
                          <td className="!px-3.5 font-semibold font-mono text-[var(--font-size-xs)]">{it.name}</td>
                          <td className="!px-2.5"><span className="fass-badge" style={it.badgeStyle}>{it.status}</span></td>
                          <td className="!px-2.5 text-[var(--fass-muted)] leading-snug">{it.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              ))}
            </div>
          ) : null}
        </div>

        <footer className="h-8 shrink-0 flex items-center justify-between px-5 bg-[var(--fass-surface)] border-t border-[var(--fass-line)] text-[var(--font-size-xs)] text-[var(--fass-muted)]">
          <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{statusLeft}</span>
          <span className="shrink-0 ml-3">{statusRight}</span>
        </footer>
      </div>

      {hasModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/45"
          onClick={closeModal}
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="fass-modal-title"
            className="w-full max-w-[560px] max-h-[80vh] flex flex-col overflow-hidden bg-[var(--fass-surface)] border border-[var(--fass-line)] rounded-[var(--fass-radius-lg)] shadow-[var(--shadow-md)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 h-12 px-4 border-b border-[var(--fass-line)] shrink-0">
              <strong id="fass-modal-title" className="fass-title-section text-[var(--font-size-md)]">{modalTitle}</strong>
              <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap fass-subtle">{modalSub}</span>
              <button
                ref={modalCloseRef}
                type="button"
                className="fass-btn is-icon ml-auto shrink-0"
                aria-label="닫기"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <div className="fass-scroll flex-1 overflow-y-auto p-4">
              {modalIsForm ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-3 gap-y-2.5">
                  {(modalFields || []).map((f, f__i) => (
                    <div key={f__i} className="flex flex-col gap-1">
                      <label className="fass-label">{f.label}</label>
                      <input className="fass-field" value={f.value ?? ""} onChange={f.onChange} placeholder={f.placeholder} />
                    </div>
                  ))}
                </div>
              ) : null}
              {modalIsRec ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-3 gap-y-2.5">
                  {(modalRecFields || []).map((f, f__i) => (
                    <div key={f__i} style={f.cellStyle}>
                      <label className="fass-label">{f.label}</label>
                      {f.isSelect ? (
                        <select className="fass-field" value={f.value} onChange={f.onChange}>
                          {(f.options || []).map((o, o__i) => (
                            <option key={o__i} value={o}>{o}</option>
                          ))}
                        </select>
                      ) : null}
                      {f.isText ? (
                        <input className="fass-field" value={f.value} onChange={f.onChange} placeholder={f.placeholder} />
                      ) : null}
                      {f.isArea ? (
                        <textarea className="fass-field" value={f.value} onChange={f.onChange} placeholder={f.placeholder} rows={3} />
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
              {modalIsConfirm ? (
                <div className="flex flex-col gap-2">
                  {(modalLines || []).map((line, line__i) => (
                    <span key={line__i} className="text-[var(--font-size-md)] text-[var(--fass-text)] leading-relaxed">{line}</span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-1.5 px-4 py-3 border-t border-[var(--fass-line)] shrink-0">
              <button type="button" className="fass-btn is-ghost" onClick={closeModal}>취소</button>
              <button type="button" className={modalConfirmClass} onClick={submitModal}>{modalConfirmLabel}</button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
