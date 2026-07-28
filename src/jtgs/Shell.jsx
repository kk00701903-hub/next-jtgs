import React from "react";

function sx(css) {
  if (!css || typeof css !== "string") return css || undefined;
  const out = {};
  for (const part of css.split(";")) {
    const i = part.indexOf(":");
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (!k) continue;
    const camel = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[camel] = v;
  }
  return out;
}

export function Shell({ v }) {
  const {
    navRows, segments, tabs, cols, rows, foot, hasFoot,
    headTitle, headSub, summary, expanded, collapseLabel, toggleCollapse, doSearch,
    filters, metrics, gridTitle, gridCount, mergeNote, actions,
    segLabel, segNote,
    isGrid, isDash, isArch, isReq, isCheck,
    checkGroups, checkMetrics,
    dashKpis, dashStations, dashTanks, dashIf, dashLog, dashJump,
    statusLeft, statusRight,
    hasModal, modalTitle, modalSub, closeModal, submitModal,
    modalIsForm, modalIsRec, modalIsConfirm, modalFields, modalRecFields, modalLines,
    modalConfirmStyle, modalConfirmLabel,
    stackHint, stackActions, stackAreas, layers,
    reqHint, reqActions, reqTables,
  } = v;

  return (
    <div style={sx(`display:flex;height:100vh;overflow:hidden;background:var(--fass-bg)`)}>
    
      <nav style={sx(`width:224px;flex-shrink:0;background:var(--fass-navy);color:#fff;display:flex;flex-direction:column;box-shadow:2px 0 8px rgba(0,0,0,.15)`)}>
        <div style={sx(`display:flex;align-items:center;gap:10px;padding:16px 18px 14px;border-bottom:1px solid rgba(255,255,255,.1)`)}>
          <div style={sx(`width:32px;height:32px;flex-shrink:0;border-radius:8px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;letter-spacing:-.02em`)}>JT</div>
          <div style={sx(`display:flex;flex-direction:column;gap:1px`)}>
            <span style={sx(`font-size:13px;font-weight:800;letter-spacing:-.01em`)}>주유소 관리시스템</span>
            <span style={sx(`font-size:10px;opacity:.55`)}>JETTE Supply Control · FASS</span>
          </div>
        </div>
    
        <div className="fass-scroll" style={sx(`flex:1;overflow-y:auto;padding:8px 0`)}>
          {(navRows || []).map((row, row__i) => (
    <React.Fragment key={row__i}>
    {row.isGroup ? (
    <><div style={sx(`padding:12px 16px 4px;font-size:10px;font-weight:800;letter-spacing:.08em;opacity:.45;text-transform:uppercase`)}>{row.label}</div></>
    ) : null}
            {row.isItem ? (
    <><div onClick={row.onClick} style={row.style}>
                <span style={sx(`width:16px;flex-shrink:0;text-align:center;font-size:11px;opacity:.8`)}>{row.mark}</span>
                <span style={sx(`min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap`)}>{row.label}</span>
              </div></>
    ) : null}
    </React.Fragment>
    ))}
        </div>
    
        <div style={sx(`display:flex;align-items:center;gap:10px;padding:12px 18px;border-top:1px solid rgba(255,255,255,.1)`)}>
          <div style={sx(`width:30px;height:30px;flex-shrink:0;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800`)}>한</div>
          <div style={sx(`display:flex;flex-direction:column;gap:1px;min-width:0`)}>
            <span style={sx(`font-size:12px;font-weight:700`)}>한성민 프로</span>
            <span style={sx(`font-size:10px;opacity:.55`)}>정보전략팀</span>
          </div>
        </div>
      </nav>
    
      <div style={sx(`flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden`)}>
    
        <div style={sx(`height:52px;flex-shrink:0;display:flex;align-items:center;gap:12px;padding:0 20px;background:var(--fass-surface);border-bottom:1px solid var(--fass-line);box-shadow:var(--shadow-sm)`)}>
          <strong style={sx(`font-size:15px;font-weight:900;letter-spacing:-.01em;white-space:nowrap;flex-shrink:0`)}>{headTitle}</strong>
          <span style={sx(`font-size:var(--font-size-sm);color:var(--fass-muted);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap`)}>{headSub}</span>
          <div style={sx(`flex:1`)}></div>
          <span style={sx(`font-size:var(--font-size-xs);font-weight:700;color:var(--fass-muted);background:var(--fass-bg);border:1px solid var(--fass-line);border-radius:var(--fass-radius-md);padding:5px 10px;white-space:nowrap;flex-shrink:0`)}>2026-07-27 (월) 16:04 기준</span>
          <button style={sx(`height:var(--fass-button-height-sm);padding:0 var(--fass-button-padding-x-sm);font-size:var(--fass-button-font-size);font-weight:850;border-radius:var(--fass-button-radius);border:1px solid var(--fass-line-strong);background:var(--fass-surface);color:var(--fass-text);cursor:pointer;white-space:nowrap;flex-shrink:0`)}>새로고침</button>
        </div>
    
        <div className="fass-scroll" style={sx(`flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:12px`)}>
    
          {isGrid ? (
    <><div style={sx(`display:flex;flex-direction:column;gap:12px`)}>
    
              <div style={sx(`display:flex;align-items:center;gap:10px;flex-wrap:wrap`)}>
                <span style={sx(`font-size:var(--font-size-xs);font-weight:800;color:var(--fass-muted);flex-shrink:0`)}>{segLabel}</span>
                <div style={sx(`display:flex;gap:4px;padding:3px;background:var(--fass-surface);border:1px solid var(--fass-line);border-radius:999px;box-shadow:var(--shadow-sm);flex-wrap:wrap`)}>
                  {(segments || []).map((seg, seg__i) => (
    <button key={seg__i} onClick={seg.onClick} style={seg.style}>{seg.label}<span style={seg.codeStyle}>{seg.code}</span></button>
    ))}
                </div>
                <span style={sx(`margin-left:auto;font-size:var(--font-size-xs);color:var(--fass-subtle)`)}>{segNote}</span>
              </div>
    
              <section aria-label="조회 조건" style={sx(`flex:none;overflow:hidden;background:var(--fass-surface);border:1px solid var(--fass-line);border-radius:var(--fass-radius-lg);box-shadow:var(--shadow-sm)`)}>
                <div style={sx(`display:flex;align-items:center;gap:10px;height:42px;padding:0 12px;border-bottom:1px solid var(--fass-line)`)}>
                  <strong style={sx(`font-size:var(--font-size-sm);font-weight:900;flex-shrink:0`)}>조회 조건</strong>
                  <span style={sx(`min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:var(--font-size-xs);font-weight:750;color:var(--fass-muted)`)}>{summary}</span>
                  <button onClick={toggleCollapse} style={sx(`margin-left:auto;flex-shrink:0;height:28px;padding:0 14px;border-radius:999px;font-size:var(--font-size-xs);font-weight:900;cursor:pointer;border:1px solid var(--fass-accent-line);background:var(--fass-accent-soft);color:var(--fass-accent-strong);transition:background .15s,color .15s`)}>{collapseLabel}</button>
                </div>
                {expanded ? (
    <><div style={sx(`display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:12px;padding:12px`)}>
                    <div style={sx(`min-width:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));align-items:end;gap:8px 12px`)}>
                      {(filters || []).map((f, f__i) => (
    <div key={f__i} style={sx(`display:flex;flex-direction:column;gap:4px`)}>
                          <label style={sx(`font-size:var(--font-size-xs);font-weight:800;color:var(--fass-muted)`)}>{f.label}</label>
                          {f.isSelect ? (
    <><select style={sx(`height:var(--fass-button-height-md);padding:0 8px;font-size:var(--font-size-sm);font-weight:600;color:var(--fass-text);background:var(--fass-surface);border:1px solid var(--fass-line-strong);border-radius:var(--fass-radius-md);cursor:pointer`)}>
                              {(f.options || []).map((opt, opt__i) => (
    <option key={opt__i}>{opt}</option>
    ))}
                            </select></>
    ) : null}
                          {f.isInput ? (
    <><input type={f.type} defaultValue={f.value} placeholder={f.placeholder} style={sx(`height:var(--fass-button-height-md);padding:0 8px;font-size:var(--font-size-sm);font-weight:600;color:var(--fass-text);background:var(--fass-surface);border:1px solid var(--fass-line-strong);border-radius:var(--fass-radius-md)`)} /></>
    ) : null}
                        </div>
    ))}
                    </div>
                    <div style={sx(`display:flex;align-items:center;justify-content:flex-end;gap:6px`)}>
                      <button style={sx(`height:var(--fass-button-height-md);padding:0 var(--fass-button-padding-x-md);font-size:var(--fass-button-font-size);font-weight:850;border-radius:var(--fass-button-radius);border:1px solid transparent;background:transparent;color:var(--fass-muted);cursor:pointer`)}>초기화</button>
                      <button onClick={doSearch} style={sx(`height:var(--fass-button-height-md);padding:0 var(--fass-button-padding-x-md);font-size:var(--fass-button-font-size);font-weight:850;border-radius:var(--fass-button-radius);border:1px solid var(--fass-accent);background:var(--fass-accent);color:#fff;cursor:pointer;box-shadow:0 8px 18px color-mix(in srgb,var(--fass-accent) 22%,transparent)`)}>조회</button>
                    </div>
                  </div></>
    ) : null}
              </section>
    
              <div style={sx(`display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px`)}>
                {(metrics || []).map((m, m__i) => (
    <div key={m__i} style={sx(`display:flex;flex-direction:column;gap:6px;padding:12px 16px;background:var(--fass-surface);border:1px solid var(--fass-line);border-radius:var(--fass-radius-lg);box-shadow:var(--shadow-sm)`)}>
                    <span style={sx(`font-size:var(--font-size-xs);color:var(--fass-muted);line-height:1`)}>{m.label}</span>
                    <div style={sx(`display:flex;align-items:baseline;gap:4px`)}>
                      <span style={m.valueStyle}>{m.value}</span>
                      <span style={sx(`font-size:var(--font-size-sm);font-weight:400;color:var(--fass-muted);line-height:1`)}>{m.unit}</span>
                    </div>
                    <span style={sx(`font-size:var(--font-size-xs);color:var(--fass-subtle);line-height:1`)}>{m.note}</span>
                  </div>
    ))}
              </div>
    
              <div style={sx(`display:flex;flex-direction:column`)}>
                <div style={sx(`display:flex;align-items:center;gap:8px;height:42px;padding:0 8px;background:var(--fass-surface);border:1px solid var(--fass-line);border-bottom:none;border-radius:var(--fass-radius-lg) var(--fass-radius-lg) 0 0`)}>
                  <strong style={sx(`font-size:var(--font-size-sm);font-weight:900;padding:0 4px;flex-shrink:0`)}>{gridTitle}</strong>
                  <span style={sx(`font-size:var(--font-size-xs);color:var(--fass-subtle)`)}>{gridCount}</span>
                  <div style={sx(`margin-left:auto;display:flex;align-items:center;gap:4px`)}>
                    {(actions || []).map((a, a__i) => (
    <button key={a__i} onClick={a.onClick} style={a.style}>{a.label}</button>
    ))}
                  </div>
                </div>
    
                <div style={sx(`display:flex;align-items:center;gap:0;height:38px;padding:0 6px;background:var(--fass-surface);border-left:1px solid var(--fass-line);border-right:1px solid var(--fass-line);border-bottom:1px solid var(--fass-line)`)}>
                  {(tabs || []).map((t, t__i) => (
    <button key={t__i} onClick={t.onClick} style={t.style}>{t.label}<span style={t.countStyle}>{t.count}</span></button>
    ))}
                </div>
    
                <div className="fass-scroll" style={sx(`background:var(--fass-surface);border:1px solid var(--fass-line);border-top:none;border-radius:0 0 var(--fass-radius-lg) var(--fass-radius-lg);overflow:auto;max-height:46vh`)}>
                  <table style={sx(`width:100%;border-collapse:collapse;font-size:var(--font-size-sm)`)}>
                    <thead>
                      <tr>
                        {(cols || []).map((c, c__i) => (
    <th key={c__i} style={c.style}>{c.label}</th>
    ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(rows || []).map((r, r__i) => (
    <tr key={r__i} onClick={r.onClick} style={r.style}>
                          {(r.cells || []).map((c, c__i) => (
    <td key={c__i} style={c.style}>
                              {c.isBadge ? (
    <><span style={c.badgeStyle}>{c.v}</span></>
    ) : null}
                              {c.isText ? (
    <>{c.v}</>
    ) : null}
                            </td>
    ))}
                        </tr>
    ))}
                    </tbody>
                    {hasFoot ? (
    <><tfoot>
                        <tr>
                          {(foot || []).map((c, c__i) => (
    <td key={c__i} colSpan={c.span} style={c.style}>{c.v}</td>
    ))}
                        </tr>
                      </tfoot></>
    ) : null}
                  </table>
                </div>
              </div>
    
              <div style={sx(`display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:var(--fass-accent-soft);border:1px solid var(--fass-accent-line);border-radius:var(--fass-radius-lg)`)}>
                <span style={sx(`font-size:var(--font-size-xs);font-weight:900;color:var(--fass-accent-strong);flex-shrink:0;padding:1px 8px;border-radius:999px;background:#fff`)}>통합 규칙</span>
                <span style={sx(`font-size:var(--font-size-xs);color:var(--fass-accent-strong);line-height:1.6`)}>{mergeNote}</span>
              </div>
            </div></>
    ) : null}
    
          {isDash ? (
    <><div style={sx(`display:flex;flex-direction:column;gap:12px`)}>
              <div style={sx(`display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px`)}>
                {(dashKpis || []).map((k, k__i) => (
    <div key={k__i} style={k.cardStyle}>
                    <span style={sx(`font-size:var(--font-size-xs);color:var(--fass-muted);line-height:1`)}>{k.label}</span>
                    <span style={k.valueStyle}>{k.value}</span>
                    <span style={sx(`font-size:var(--font-size-xs);color:var(--fass-subtle);line-height:1.4`)}>{k.note}</span>
                  </div>
    ))}
              </div>
    
              <div style={sx(`display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:12px;align-items:start`)}>
                <div style={sx(`display:flex;flex-direction:column;gap:12px;min-width:0`)}>
                  <section style={sx(`overflow:hidden;background:var(--fass-surface);border:1px solid var(--fass-line);border-radius:var(--fass-radius-lg);box-shadow:var(--shadow-sm)`)}>
                    <div style={sx(`display:flex;align-items:center;gap:10px;height:42px;padding:0 14px;border-bottom:1px solid var(--fass-line)`)}>
                      <strong style={sx(`font-size:var(--font-size-sm);font-weight:900`)}>주유소별 오늘 현황</strong>
                      <span style={sx(`font-size:var(--font-size-xs);color:var(--fass-muted)`)}>2026-07-27 16:04 기준</span>
                    </div>
                    <div style={sx(`display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;padding:14px`)}>
                      {(dashStations || []).map((s, s__i) => (
    <div key={s__i} style={s.cardStyle}>
                          <div style={sx(`display:flex;align-items:center;justify-content:space-between;gap:8px`)}>
                            <strong style={sx(`font-size:var(--font-size-sm);font-weight:900`)}>{s.name}</strong>
                            <span style={s.badgeStyle}>{s.badge}</span>
                          </div>
                          <div style={sx(`display:flex;flex-direction:column;gap:5px`)}>
                            {(s.rows || []).map((row, row__i) => (
    <div key={row__i} style={sx(`display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:var(--font-size-xs)`)}>
                                <span style={sx(`color:var(--fass-muted)`)}>{row.k}</span>
                                <span style={sx(`color:var(--fass-text);font-weight:700;font-variant-numeric:tabular-nums`)}>{row.v}</span>
                              </div>
    ))}
                          </div>
                        </div>
    ))}
                    </div>
                  </section>
    
                  <section style={sx(`overflow:hidden;background:var(--fass-surface);border:1px solid var(--fass-line);border-radius:var(--fass-radius-lg);box-shadow:var(--shadow-sm)`)}>
                    <div style={sx(`display:flex;align-items:center;gap:10px;height:42px;padding:0 14px;border-bottom:1px solid var(--fass-line)`)}>
                      <strong style={sx(`font-size:var(--font-size-sm);font-weight:900`)}>유류 재고 적재율</strong>
                      <span style={sx(`font-size:var(--font-size-xs);color:var(--fass-muted)`)}>안전재고 대비</span>
                    </div>
                    <div style={sx(`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;padding:14px`)}>
                      {(dashTanks || []).map((s, s__i) => (
    <div key={s__i} style={sx(`display:flex;flex-direction:column;gap:10px;padding:12px;background:var(--fass-surface-alt);border:1px solid var(--fass-line);border-radius:var(--fass-radius-md)`)}>
                          <div style={sx(`display:flex;align-items:center;gap:8px`)}>
                            <span style={sx(`font-size:var(--font-size-sm);font-weight:900;color:var(--fass-text)`)}>{s.station}</span>
                            <span style={s.stateStyle}>{s.state}</span>
                          </div>
                          <div style={sx(`display:flex;flex-direction:column;gap:8px`)}>
                            {(s.fuels || []).map((f, f__i) => (
    <div key={f__i} style={sx(`display:flex;flex-direction:column;gap:4px`)}>
                                <div style={sx(`display:flex;align-items:baseline;justify-content:space-between;gap:8px`)}>
                                  <span style={sx(`font-size:var(--font-size-xs);font-weight:700;color:var(--fass-muted)`)}>{f.label}</span>
                                  <span style={f.pctStyle}>{f.pct}</span>
                                </div>
                                <div style={sx(`height:8px;border-radius:999px;background:var(--fass-line-soft);overflow:hidden`)}>
                                  <div style={f.barStyle}></div>
                                </div>
                              </div>
    ))}
                          </div>
                        </div>
    ))}
                    </div>
                  </section>
                </div>
    
                <div style={sx(`display:flex;flex-direction:column;gap:12px;min-width:0`)}>
                  <section style={sx(`overflow:hidden;background:var(--fass-surface);border:1px solid var(--fass-line);border-radius:var(--fass-radius-lg);box-shadow:var(--shadow-sm)`)}>
                    <div style={sx(`display:flex;align-items:center;height:42px;padding:0 14px;border-bottom:1px solid var(--fass-line)`)}>
                      <strong style={sx(`font-size:var(--font-size-sm);font-weight:900`)}>IF 처리 현황 (오늘)</strong>
                    </div>
                    <table style={sx(`width:100%;border-collapse:collapse;font-size:var(--font-size-sm)`)}>
                      <thead>
                        <tr>
                          <th style={sx(`text-align:left;padding:7px 14px;font-size:var(--font-size-xs);font-weight:800;color:var(--fass-muted);background:var(--fass-surface-alt);border-bottom:1px solid var(--fass-line)`)}>구분</th>
                          <th style={sx(`text-align:right;padding:7px 10px;font-size:var(--font-size-xs);font-weight:800;color:var(--fass-muted);background:var(--fass-surface-alt);border-bottom:1px solid var(--fass-line)`)}>전체</th>
                          <th style={sx(`text-align:right;padding:7px 10px;font-size:var(--font-size-xs);font-weight:800;color:var(--fass-success);background:var(--fass-surface-alt);border-bottom:1px solid var(--fass-line)`)}>성공</th>
                          <th style={sx(`text-align:right;padding:7px 14px;font-size:var(--font-size-xs);font-weight:800;color:var(--fass-danger);background:var(--fass-surface-alt);border-bottom:1px solid var(--fass-line)`)}>오류</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(dashIf || []).map((r, r__i) => (
    <tr key={r__i}>
                            <td style={sx(`padding:8px 14px;border-bottom:1px solid var(--fass-line-soft)`)}>{r.name}</td>
                            <td style={sx(`padding:8px 10px;border-bottom:1px solid var(--fass-line-soft);text-align:right;font-variant-numeric:tabular-nums`)}>{r.total}</td>
                            <td style={sx(`padding:8px 10px;border-bottom:1px solid var(--fass-line-soft);text-align:right;color:var(--fass-success);font-weight:600;font-variant-numeric:tabular-nums`)}>{r.ok}</td>
                            <td style={sx(`padding:8px 14px;border-bottom:1px solid var(--fass-line-soft);text-align:right;color:var(--fass-danger);font-weight:600;font-variant-numeric:tabular-nums`)}>{r.err}</td>
                          </tr>
    ))}
                      </tbody>
                    </table>
                  </section>
    
                  <section style={sx(`overflow:hidden;background:var(--fass-surface);border:1px solid var(--fass-line);border-radius:var(--fass-radius-lg);box-shadow:var(--shadow-sm)`)}>
                    <div style={sx(`display:flex;align-items:center;height:42px;padding:0 14px;border-bottom:1px solid var(--fass-line)`)}>
                      <strong style={sx(`font-size:var(--font-size-sm);font-weight:900`)}>최근 활동</strong>
                    </div>
                    <div style={sx(`display:flex;flex-direction:column;gap:10px;padding:14px`)}>
                      {(dashLog || []).map((l, l__i) => (
    <div key={l__i} style={sx(`display:flex;gap:10px`)}>
                          <div style={l.dotStyle}></div>
                          <div style={sx(`display:flex;flex-direction:column;gap:2px;min-width:0`)}>
                            <span style={sx(`font-size:var(--font-size-sm);color:var(--fass-text);line-height:1.4`)}>{l.text}</span>
                            <span style={sx(`font-size:10px;color:var(--fass-subtle)`)}>{l.meta}</span>
                          </div>
                        </div>
    ))}
                    </div>
                  </section>
    
                  <section style={sx(`overflow:hidden;background:var(--fass-surface);border:1px solid var(--fass-line);border-radius:var(--fass-radius-lg);box-shadow:var(--shadow-sm)`)}>
                    <div style={sx(`display:flex;align-items:center;height:42px;padding:0 14px;border-bottom:1px solid var(--fass-line)`)}>
                      <strong style={sx(`font-size:var(--font-size-sm);font-weight:900`)}>바로 가기</strong>
                    </div>
                    <div style={sx(`display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:14px`)}>
                      {(dashJump || []).map((j, j__i) => (
    <button key={j__i} onClick={j.onClick} style={sx(`display:flex;flex-direction:column;gap:3px;align-items:flex-start;padding:10px 12px;background:var(--fass-surface-alt);border:1px solid var(--fass-line);border-radius:var(--fass-radius-md);cursor:pointer;text-align:left`)}>
                          <span style={sx(`font-size:var(--font-size-sm);font-weight:800;color:var(--fass-text)`)}>{j.label}</span>
                          <span style={sx(`font-size:10px;color:var(--fass-muted)`)}>{j.note}</span>
                        </button>
    ))}
                    </div>
                  </section>
                </div>
              </div>
            </div></>
    ) : null}
    
          {isArch ? (
    <><div style={sx(`display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--fass-surface);border:1px solid var(--fass-line);border-radius:var(--fass-radius-lg);box-shadow:var(--shadow-sm)`)}>
              <strong style={sx(`font-size:var(--font-size-sm);font-weight:900`)}>기술 스택 항목</strong>
              <span style={sx(`font-size:var(--font-size-xs);color:var(--fass-muted)`)}>{stackHint}</span>
              <div style={sx(`margin-left:auto;display:flex;gap:6px`)}>
                {(stackActions || []).map((a, a__i) => (
    <button key={a__i} onClick={a.onClick} style={a.style}>{a.label}</button>
    ))}
              </div>
            </div>
            <div style={sx(`display:grid;grid-template-columns:repeat(auto-fit,minmax(420px,1fr));gap:12px;align-items:start;min-width:640px`)}>
              <div style={sx(`display:flex;flex-direction:column;gap:12px`)}>
                {(stackAreas || []).map((a, a__i) => (
    <section key={a__i} style={sx(`overflow:hidden;background:var(--fass-surface);border:1px solid var(--fass-line);border-radius:var(--fass-radius-lg);box-shadow:var(--shadow-sm)`)}>
                    <div style={a.headStyle}>
                      <strong style={a.titleStyle}>{a.area}</strong>
                      <span style={sx(`margin-left:auto;font-size:var(--font-size-xs);color:var(--fass-muted);font-weight:700`)}>{a.count}</span>
                    </div>
                    <div style={sx(`display:flex;flex-direction:column`)}>
                      {(a.rows || []).map((r, r__i) => (
    <div key={r__i} onClick={r.onClick} style={r.rowStyle}>
                          <span style={sx(`font-size:var(--font-size-sm);font-weight:800;color:var(--fass-text);line-height:1.4`)}>{r.cat}</span>
                          <div style={sx(`display:flex;flex-direction:column;gap:7px;min-width:0`)}>
                            <div style={sx(`display:flex;flex-wrap:wrap;gap:6px`)}>
                              {(r.chips || []).map((c, c__i) => (
    <span key={c__i} style={c.style}>{c.name}</span>
    ))}
                            </div>
                            <span style={sx(`font-size:var(--font-size-sm);color:var(--fass-muted);line-height:1.6;text-wrap:pretty`)}>{r.why}</span>
                          </div>
                        </div>
    ))}
                    </div>
                  </section>
    ))}
              </div>
    
              <section style={sx(`overflow:hidden;background:var(--fass-surface);border:1px solid var(--fass-line);border-radius:var(--fass-radius-lg);box-shadow:var(--shadow-sm)`)}>
                <div style={sx(`display:flex;align-items:center;gap:8px;height:42px;padding:0 14px;border-bottom:1px solid var(--fass-line)`)}>
                  <strong style={sx(`font-size:var(--font-size-sm);font-weight:900`)}>레이어 구성</strong>
                  <span style={sx(`font-size:var(--font-size-xs);color:var(--fass-muted)`)}>외부망 → 데이터</span>
                </div>
                <div style={sx(`display:flex;flex-direction:column;gap:10px;padding:14px`)}>
                  {(layers || []).map((l, l__i) => (
    <div key={l__i} style={sx(`display:flex;gap:10px;align-items:stretch`)}>
                      <div style={l.barStyle}></div>
                      <div style={sx(`display:flex;flex-direction:column;gap:5px;min-width:0;flex:1`)}>
                        <div style={sx(`display:flex;align-items:baseline;gap:6px`)}>
                          <span style={sx(`font-size:var(--font-size-sm);font-weight:900;color:var(--fass-text)`)}>{l.name}</span>
                          <span style={sx(`font-size:10px;color:var(--fass-subtle);font-weight:700`)}>{l.note}</span>
                        </div>
                        <div style={sx(`display:flex;flex-direction:column;gap:3px`)}>
                          {(l.nodes || []).map((n, n__i) => (
    <span key={n__i} style={sx(`font-size:var(--font-size-xs);color:var(--fass-muted);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;line-height:1.5`)}>{n.name}</span>
    ))}
                        </div>
                      </div>
                    </div>
    ))}
                </div>
              </section>
            </div></>
    ) : null}
    
          {isReq ? (
    <><div style={sx(`display:flex;flex-direction:column;gap:12px`)}>
              <div style={sx(`display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--fass-surface);border:1px solid var(--fass-line);border-radius:var(--fass-radius-lg);box-shadow:var(--shadow-sm)`)}>
                <strong style={sx(`font-size:var(--font-size-sm);font-weight:900`)}>요구사항 항목</strong>
                <span style={sx(`font-size:var(--font-size-xs);color:var(--fass-muted)`)}>{reqHint}</span>
                <div style={sx(`margin-left:auto;display:flex;gap:6px`)}>
                  {(reqActions || []).map((a, a__i) => (
    <button key={a__i} onClick={a.onClick} style={a.style}>{a.label}</button>
    ))}
                </div>
              </div>
              {(reqTables || []).map((t, t__i) => (
    <section key={t__i} style={sx(`overflow:hidden;background:var(--fass-surface);border:1px solid var(--fass-line);border-radius:var(--fass-radius-lg);box-shadow:var(--shadow-sm)`)}>
                  <div style={sx(`display:flex;align-items:center;gap:10px;height:42px;padding:0 14px;border-bottom:1px solid var(--fass-line)`)}>
                    <strong style={sx(`font-size:var(--font-size-sm);font-weight:900`)}>{t.title}</strong>
                    <span style={sx(`font-size:var(--font-size-xs);color:var(--fass-muted)`)}>{t.note}</span>
                  </div>
                  <div className="fass-scroll" style={sx(`overflow-x:auto`)}>
                  <table style={sx(`width:100%;min-width:1040px;border-collapse:collapse;font-size:var(--font-size-sm)`)}>
                    <thead>
                      <tr>
                        <th style={sx(`text-align:left;padding:7px 14px;font-size:var(--font-size-xs);font-weight:800;color:var(--fass-muted);background:var(--fass-surface-alt);border-bottom:1px solid var(--fass-line);width:180px`)}>분류</th>
                        <th style={sx(`text-align:left;padding:7px 10px;font-size:var(--font-size-xs);font-weight:800;color:var(--fass-muted);background:var(--fass-surface-alt);border-bottom:1px solid var(--fass-line);width:96px`)}>ID</th>
                        <th style={sx(`text-align:left;padding:7px 10px;font-size:var(--font-size-xs);font-weight:800;color:var(--fass-muted);background:var(--fass-surface-alt);border-bottom:1px solid var(--fass-line);width:200px`)}>요구사항명</th>
                        <th style={sx(`text-align:left;padding:7px 10px;font-size:var(--font-size-xs);font-weight:800;color:var(--fass-muted);background:var(--fass-surface-alt);border-bottom:1px solid var(--fass-line)`)}>상세 내용</th>
                        <th style={sx(`text-align:left;padding:7px 14px;font-size:var(--font-size-xs);font-weight:800;color:var(--fass-muted);background:var(--fass-surface-alt);border-bottom:1px solid var(--fass-line);width:92px`)}>우선순위</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(t.rows || []).map((r, r__i) => (
    <tr key={r__i} onClick={r.onClick} style={r.rowStyle}>
                          <td style={sx(`padding:8px 14px;border-bottom:1px solid var(--fass-line-soft);color:var(--fass-muted)`)}>{r.cat}</td>
                          <td style={sx(`padding:8px 10px;border-bottom:1px solid var(--fass-line-soft);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:var(--font-size-xs);font-weight:800;color:var(--fass-accent-strong)`)}>{r.id}</td>
                          <td style={sx(`padding:8px 10px;border-bottom:1px solid var(--fass-line-soft);font-weight:800`)}>{r.name}</td>
                          <td style={sx(`padding:8px 10px;border-bottom:1px solid var(--fass-line-soft);color:var(--fass-muted);line-height:1.55`)}>
                            <div style={sx(`display:flex;flex-direction:column;gap:3px`)}>
                              <span style={sx(`text-wrap:pretty`)}>{r.detail}</span>
                              {r.hasMemo ? (
    <><span style={sx(`font-size:var(--font-size-xs);color:var(--fass-warning);font-weight:800`)}>※ {r.memo}</span></>
    ) : null}
                            </div>
                          </td>
                          <td style={sx(`padding:8px 14px;border-bottom:1px solid var(--fass-line-soft)`)}>
                            {r.hasPri ? (
    <><span style={r.priStyle}>{r.pri}</span></>
    ) : null}
                          </td>
                        </tr>
    ))}
                    </tbody>
                  </table>
                  </div>
                </section>
    ))}
            </div></>
    ) : null}
    
          {isCheck ? (
    <><div style={sx(`display:flex;flex-direction:column;gap:12px`)}>
              <div style={sx(`display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px`)}>
                {(checkMetrics || []).map((m, m__i) => (
    <div key={m__i} style={sx(`display:flex;flex-direction:column;gap:6px;padding:12px 16px;background:var(--fass-surface);border:1px solid var(--fass-line);border-radius:var(--fass-radius-lg);box-shadow:var(--shadow-sm)`)}>
                    <span style={sx(`font-size:var(--font-size-xs);color:var(--fass-muted);line-height:1`)}>{m.label}</span>
                    <span style={m.valueStyle}>{m.value}</span>
                    <span style={sx(`font-size:var(--font-size-xs);color:var(--fass-subtle);line-height:1`)}>{m.note}</span>
                  </div>
    ))}
              </div>
    
              {(checkGroups || []).map((g, g__i) => (
    <section key={g__i} style={sx(`overflow:hidden;background:var(--fass-surface);border:1px solid var(--fass-line);border-radius:var(--fass-radius-lg);box-shadow:var(--shadow-sm)`)}>
                  <div style={sx(`display:flex;align-items:center;gap:10px;height:42px;padding:0 14px;border-bottom:1px solid var(--fass-line)`)}>
                    <strong style={sx(`font-size:var(--font-size-sm);font-weight:900`)}>{g.title}</strong>
                    <span style={sx(`font-size:var(--font-size-xs);color:var(--fass-muted)`)}>{g.note}</span>
                  </div>
                  <table style={sx(`width:100%;border-collapse:collapse;font-size:var(--font-size-sm)`)}>
                    <thead>
                      <tr>
                        <th style={sx(`text-align:left;padding:7px 14px;font-size:var(--font-size-xs);font-weight:800;color:var(--fass-muted);background:var(--fass-surface-alt);border-bottom:1px solid var(--fass-line);width:200px`)}>소스 컴포넌트</th>
                        <th style={sx(`text-align:left;padding:7px 10px;font-size:var(--font-size-xs);font-weight:800;color:var(--fass-muted);background:var(--fass-surface-alt);border-bottom:1px solid var(--fass-line);width:110px`)}>반영 상태</th>
                        <th style={sx(`text-align:left;padding:7px 10px;font-size:var(--font-size-xs);font-weight:800;color:var(--fass-muted);background:var(--fass-surface-alt);border-bottom:1px solid var(--fass-line)`)}>확인 내용</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(g.items || []).map((it, it__i) => (
    <tr key={it__i}>
                          <td style={sx(`padding:8px 14px;border-bottom:1px solid var(--fass-line-soft);font-weight:700;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:var(--font-size-xs)`)}>{it.name}</td>
                          <td style={sx(`padding:8px 10px;border-bottom:1px solid var(--fass-line-soft)`)}><span style={it.badgeStyle}>{it.status}</span></td>
                          <td style={sx(`padding:8px 10px;border-bottom:1px solid var(--fass-line-soft);color:var(--fass-muted);line-height:1.55`)}>{it.note}</td>
                        </tr>
    ))}
                    </tbody>
                  </table>
                </section>
    ))}
            </div></>
    ) : null}
    
        </div>
    
        <div style={sx(`height:28px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 20px;background:var(--fass-surface);border-top:1px solid var(--fass-line);font-size:var(--font-size-xs);color:var(--fass-muted)`)}>
          <span>{statusLeft}</span>
          <span>{statusRight}</span>
        </div>
      </div>
    
      {hasModal ? (
    <><div style={sx(`position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(15,23,42,.45)`)}>
          <section style={sx(`width:100%;max-width:560px;max-height:80vh;display:flex;flex-direction:column;overflow:hidden;background:var(--fass-surface);border:1px solid var(--fass-line);border-radius:var(--fass-radius-lg);box-shadow:var(--shadow-md)`)}>
            <div style={sx(`display:flex;align-items:center;gap:10px;height:48px;padding:0 16px;border-bottom:1px solid var(--fass-line);flex-shrink:0`)}>
              <strong style={sx(`font-size:var(--font-size-md);font-weight:900`)}>{modalTitle}</strong>
              <span style={sx(`min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:var(--font-size-xs);color:var(--fass-muted)`)}>{modalSub}</span>
              <button onClick={closeModal} style={sx(`margin-left:auto;flex-shrink:0;width:28px;height:28px;border-radius:var(--fass-radius-md);border:1px solid var(--fass-line);background:var(--fass-surface);color:var(--fass-muted);font-size:14px;font-weight:800;cursor:pointer`)}>×</button>
            </div>
    
            <div className="fass-scroll" style={sx(`flex:1;overflow-y:auto;padding:16px`)}>
              {modalIsForm ? (
    <><div style={sx(`display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px 12px`)}>
                  {(modalFields || []).map((f, f__i) => (
    <div key={f__i} style={sx(`display:flex;flex-direction:column;gap:4px`)}>
                      <label style={sx(`font-size:var(--font-size-xs);font-weight:800;color:var(--fass-muted)`)}>{f.label}</label>
                      <input placeholder={f.placeholder} style={sx(`height:var(--fass-button-height-md);padding:0 8px;font-size:var(--font-size-sm);font-weight:600;color:var(--fass-text);background:var(--fass-surface);border:1px solid var(--fass-line-strong);border-radius:var(--fass-radius-md)`)} />
                    </div>
    ))}
                </div></>
    ) : null}
              {modalIsRec ? (
    <><div style={sx(`display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px 12px`)}>
                  {(modalRecFields || []).map((f, f__i) => (
    <div key={f__i} style={f.cellStyle}>
                      <label style={sx(`font-size:var(--font-size-xs);font-weight:800;color:var(--fass-muted)`)}>{f.label}</label>
                      {f.isSelect ? (
    <><select value={f.value} onChange={f.onChange} style={sx(`height:var(--fass-button-height-md);padding:0 8px;font-size:var(--font-size-sm);font-weight:600;color:var(--fass-text);background:var(--fass-surface);border:1px solid var(--fass-line-strong);border-radius:var(--fass-radius-md)`)}>
                          {(f.options || []).map((o, o__i) => (
    <option key={o__i} value={o}>{o}</option>
    ))}
                        </select></>
    ) : null}
                      {f.isText ? (
    <><input value={f.value} onChange={f.onChange} placeholder={f.placeholder} style={sx(`height:var(--fass-button-height-md);padding:0 8px;font-size:var(--font-size-sm);font-weight:600;color:var(--fass-text);background:var(--fass-surface);border:1px solid var(--fass-line-strong);border-radius:var(--fass-radius-md)`)} /></>
    ) : null}
                      {f.isArea ? (
    <><textarea value={f.value} onChange={f.onChange} placeholder={f.placeholder} rows={3} style={sx(`padding:8px;font-size:var(--font-size-sm);font-weight:600;line-height:1.6;color:var(--fass-text);background:var(--fass-surface);border:1px solid var(--fass-line-strong);border-radius:var(--fass-radius-md);resize:vertical`)}></textarea></>
    ) : null}
                    </div>
    ))}
                </div></>
    ) : null}
              {modalIsConfirm ? (
    <><div style={sx(`display:flex;flex-direction:column;gap:8px`)}>
                  {(modalLines || []).map((line, line__i) => (
    <span key={line__i} style={sx(`font-size:var(--font-size-md);color:var(--fass-text);line-height:1.6`)}>{line}</span>
    ))}
                </div></>
    ) : null}
            </div>
    
            <div style={sx(`display:flex;align-items:center;justify-content:flex-end;gap:6px;padding:12px 16px;border-top:1px solid var(--fass-line);flex-shrink:0`)}>
              <button onClick={closeModal} style={sx(`height:var(--fass-button-height-md);padding:0 var(--fass-button-padding-x-md);font-size:var(--fass-button-font-size);font-weight:850;border-radius:var(--fass-button-radius);border:1px solid transparent;background:transparent;color:var(--fass-muted);cursor:pointer`)}>취소</button>
              <button onClick={submitModal} style={modalConfirmStyle}>{modalConfirmLabel}</button>
            </div>
          </section>
        </div></>
    ) : null}
    </div>
  );
}
