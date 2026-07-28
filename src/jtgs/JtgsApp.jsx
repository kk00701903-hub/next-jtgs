import { Component as ReactComponent } from "react";
import {
  B, HISTORY_COLS, HISTORY_ROWS, CHECK_GROUPS, CHECK_METRICS,
  FUEL_FILTERS, ACTIONS,
  GROUPS, CONFIRM_TEXT, MERGE_NOTE, DASH, LAYERS,
  SEED_CODES, SEED_STACK, AREA_LIST, AREA_TONE, SEED_REQS, REC_SPEC,
} from "./data.js";
import { Shell } from "./Shell.jsx";

export class JtgsApp extends ReactComponent {

  state = {
    view: "dash", seg: {}, tab: null, collapsed: false, sel: null, msg: "", modal: null,
    codes: SEED_CODES.map((c) => Object.assign({}, c)),
    stack: SEED_STACK.map((c) => Object.assign({}, c)),
    reqs: SEED_REQS.map((c) => Object.assign({}, c)),
    selRec: { stack: null, req: null },
    draft: null,
  };

  storeOf(target) { return target === "code" ? this.state.codes : target === "stack" ? this.state.stack : this.state.reqs; }
  indexOf(target) { return target === "code" ? this.state.sel : this.state.selRec[target]; }

  codeOpts(group, fallback) {
    const list = this.state.codes.filter((c) => c.group === group && c.use === "사용").map((c) => c.name);
    return ["전체"].concat(list.length ? list : fallback);
  }

  selectRec(target, i) {
    const cur = this.state.selRec[target];
    this.setState({ selRec: Object.assign({}, this.state.selRec, { [target]: cur === i ? null : i }) });
  }

  setDraft(k, v) { this.setState({ draft: Object.assign({}, this.state.draft, { [k]: v }) }); }

  codeRows() {
    return this.state.codes.map((c, i) => [
      String(i + 1), c.group, c.code, c.name, c.en, c.sort,
      c.use + (c.use === "사용" ? ":green" : ":gray"), c.updated, c.editor,
    ]);
  }

  codeMetrics() {
    const cs = this.state.codes;
    const on = cs.filter((c) => c.use === "사용").length;
    const groups = new Set(cs.map((c) => c.group)).size;
    return [
      { label: "코드그룹", value: String(groups), unit: "개", note: "운영 중" },
      { label: "상세코드", value: String(cs.length), unit: "건", note: "전체 등록" },
      { label: "사용", value: String(on), unit: "건", tone: "success", note: cs.length ? Math.round(on / cs.length * 1000) / 10 + "%" : "0%" },
      { label: "미사용", value: String(cs.length - on), unit: "건", tone: "warning", note: "정리 대상" },
    ];
  }

  dynOptions(f) {
    if (f.kind !== "select") return f.options || [];
    const map = { "유종": "FUEL_TYPE", "제품": "FUEL_TYPE", "결제구분": "PAY_TYPE", "판매구분": "PAY_TYPE", "결제방법": "PAY_TYPE", "카드구분": "CARD_TYPE", "주유소": "STATION", "과세구분": "TAX_TYPE" };
    if (f.label === "코드그룹") return ["전체"].concat(Array.from(new Set(this.state.codes.map((c) => c.group))));
    const g = map[f.label];
    return g ? this.codeOpts(g, (f.options || []).slice(1)) : (f.options || []);
  }

  openRec(target, mode) {
    const spec = REC_SPEC[target];
    const i = this.indexOf(target);
    const cur = (i === null || i === undefined) ? null : this.storeOf(target)[i];
    if (mode === "add") {
      this.setState({
        modal: { kind: "rec", target, title: spec.noun + " 등록", sub: spec.sub, confirmLabel: "저장" },
        draft: Object.assign({ idx: null }, spec.blank),
      });
      return;
    }
    if (!cur) { this.setState({ msg: spec.noun + "을(를) 목록에서 먼저 선택하세요." }); return; }
    if (mode === "edit") {
      this.setState({
        modal: { kind: "rec", target, title: spec.noun + " 수정", sub: spec.label(cur), confirmLabel: "저장" },
        draft: Object.assign({}, cur, { idx: i }),
      });
      return;
    }
    this.setState({
      modal: {
        kind: "recDelete", target, title: spec.noun + " 삭제", sub: spec.label(cur),
        lines: ["선택한 " + spec.noun + "을(를) 삭제합니다.", spec.deleteNote],
        confirmLabel: "삭제 실행", danger: true,
      },
    });
  }

  saveRec(target) {
    const spec = REC_SPEC[target];
    const d = this.state.draft;
    if (!d) return;
    const missing = spec.fields.filter((f) => f.required && !String(d[f.k] || "").trim());
    if (missing.length) { this.setState({ msg: missing.map((f) => f.label).join(" · ") + " 은(는) 필수 입력입니다." }); return; }
    const list = this.storeOf(target).slice();
    const rec = spec.normalize(d, list);
    const isNew = d.idx === null || d.idx === undefined;
    if (isNew) list.push(rec); else list[d.idx] = rec;
    const next = { modal: null, draft: null, msg: spec.noun + (isNew ? " 등록 완료 · " : " 수정 완료 · ") + spec.label(rec) + spec.savedNote };
    next[spec.store] = list;
    if (target === "code") next.sel = null;
    this.setState(next);
  }

  deleteRec(target) {
    const spec = REC_SPEC[target];
    const i = this.indexOf(target);
    const list = this.storeOf(target).slice();
    const gone = list[i];
    list.splice(i, 1);
    const next = { modal: null, msg: spec.noun + " 삭제 완료 · " + (gone ? spec.label(gone) : "") };
    next[spec.store] = list;
    if (target === "code") next.sel = null;
    else next.selRec = Object.assign({}, this.state.selRec, { [target]: null });
    this.setState(next);
  }

  openModal(label, t, cols, view, segKey) {
    if (view === "master" && segKey === "code" && (label === "등록" || label === "수정" || label === "삭제")) {
      this.openRec("code", label === "등록" ? "add" : label === "수정" ? "edit" : "delete");
      return;
    }
    if (label === "엑셀" || label === "인쇄" || label === "상세 보기") {
      this.setState({ msg: label + " 요청 처리됨 · " + t.label });
      return;
    }
    if (label === "등록" || label === "수정") {
      const fields = cols.filter((c) => c.label !== "No.").slice(0, 8).map((c) => ({
        label: c.label, placeholder: c.label + " 입력",
      }));
      this.setState({
        modal: {
          title: t.label + " " + label, sub: "JTGS" + t.code + " · 소스 ModalForm 규격",
          fields, confirmLabel: "저장",
        },
      });
      return;
    }
    const lines = CONFIRM_TEXT[label] || ["선택한 작업을 실행합니다."];
    this.setState({
      modal: {
        title: label, sub: t.label + " · JTGS" + t.code,
        lines, confirmLabel: label + " 실행",
        danger: label === "삭제" || label === "마감 취소",
      },
    });
  }

  actionStyle(variant) {
    const base = {
      height: "var(--fass-button-height-sm)", padding: "0 var(--fass-button-padding-x-sm)",
      fontSize: "var(--fass-button-font-size)", fontWeight: 850,
      borderRadius: "var(--fass-button-radius)", cursor: "pointer", whiteSpace: "nowrap",
    };
    if (variant === "primary") return Object.assign(base, {
      border: "1px solid var(--fass-accent)", background: "var(--fass-accent)", color: "#fff",
      boxShadow: "0 8px 18px color-mix(in srgb,var(--fass-accent) 22%,transparent)",
    });
    if (variant === "danger") return Object.assign(base, {
      border: "1px solid var(--fass-danger)", background: "var(--fass-danger)", color: "#fff",
    });
    if (variant === "ghost") return Object.assign(base, {
      border: "1px solid transparent", background: "transparent", color: "var(--fass-muted)",
    });
    return Object.assign(base, {
      border: "1px solid var(--fass-line)", background: "var(--fass-surface-alt)", color: "var(--fass-text)",
    });
  }

  tone(t) {
    if (t === "success") return "var(--fass-success)";
    if (t === "danger") return "var(--fass-danger)";
    if (t === "warning") return "var(--fass-warning)";
    if (t === "accent") return "var(--fass-accent)";
    return "var(--fass-text)";
  }

  cellStyle(align, extra) {
    const pad = (this.props.density ?? "normal") === "compact" ? "5px 10px" : "8px 10px";
    return Object.assign({
      padding: pad,
      borderBottom: "1px solid var(--fass-line-soft)",
      whiteSpace: "nowrap",
      textAlign: align === "r" ? "right" : align === "c" ? "center" : "left",
      fontVariantNumeric: align === "r" ? "tabular-nums" : "normal",
      color: "var(--fass-text)",
    }, extra || {});
  }

  badgeStyle(kind) {
    const c = B[kind] || B.gray;
    return {
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      height: "var(--fass-badge-height-md)", padding: "0 8px",
      fontSize: "var(--fass-badge-font-size)", fontWeight: 700,
      borderRadius: "var(--fass-badge-radius)",
      background: c.bg, color: c.fg, whiteSpace: "nowrap",
    };
  }

  parseCols(defs) {
    return defs.map((d) => {
      const [label, align, w] = d.split("|");
      return {
        label,
        isErrCol: label === "오류내용",
        style: {
          padding: "8px 10px",
          textAlign: align === "r" ? "right" : align === "c" ? "center" : "left",
          fontSize: "var(--font-size-xs)", fontWeight: 800, color: "var(--fass-muted)",
          background: "var(--fass-surface-alt)",
          borderBottom: "1px solid var(--fass-line)",
          position: "sticky", top: 0, zIndex: 1, whiteSpace: "nowrap",
          width: w ? w + "px" : undefined,
        },
      };
    });
  }

  buildRows(raw, cols) {
    return raw.map((cells, i) => {
      const selected = this.state.sel === i;
      return {
        style: {
          cursor: "pointer",
          background: selected ? "var(--fass-accent-soft)" : "transparent",
        },
        onClick: () => this.setState({ sel: selected ? null : i }),
        cells: cells.map((raw, ci) => {
          const align = (cols[ci].style.textAlign === "right") ? "r" : (cols[ci].style.textAlign === "center" ? "c" : "l");
          const parts = String(raw).split(":");
          if (parts.length === 2 && B[parts[1]]) {
            return { v: parts[0], isBadge: true, isText: false, badgeStyle: this.badgeStyle(parts[1]), style: this.cellStyle(align) };
          }
          const isErr = cols[ci].label === "오류내용" && raw !== "-";
          const neg = align === "r" && String(raw).startsWith("-");
          return {
            v: raw, isBadge: false, isText: true, badgeStyle: null,
            style: this.cellStyle(align, {
              color: isErr ? "var(--fass-danger)" : neg ? "var(--fass-danger)" : undefined,
              fontWeight: align === "r" ? 600 : 400,
              whiteSpace: cols[ci].isErrCol || cols[ci].label === "비고" ? "normal" : "nowrap",
            }),
          };
        }),
      };
    });
  }

  select(gk, k) {
    this.setState({ view: gk, seg: Object.assign({}, this.state.seg, { [gk]: k }), tab: null, sel: null, msg: "" });
  }

  groupTabs(view, t) {
    if (view !== "if") return t.tabs;
    const errRaw = t.rows.filter((r) => r.some((c) => /:(red|warn)$/.test(String(c))));
    return [
      { key: "all", label: "전체 내역", title: "IF 전송 대상 내역", cols: t.cols, rows: t.rows, foot: t.foot },
      { key: "err", label: "오류·차이 목록", title: "오류·차이 발생 목록", cols: t.cols, rows: errRaw, foot: null },
      { key: "hist", label: "전송 이력", title: "IF 전송 이력", cols: HISTORY_COLS, rows: HISTORY_ROWS, foot: null },
    ];
  }

  renderVals() {
    const view = this.state.view;
    const G = GROUPS[view];
    const isGrid = !!G;
    const isDash = view === "dash";
    const keys = isGrid ? Object.keys(G.items) : [];
    const segKey = isGrid ? (G.items[this.state.seg[view]] ? this.state.seg[view] : keys[0]) : null;
    const t = isGrid ? G.items[segKey] : null;
    const showCheck = this.props.showSourceCheck ?? true;

    const navRows = [
      { isGroup: true, label: "메인" },
      { isItem: true, key: "dash", label: "대시보드", mark: "▸", onClick: () => this.setState({ view: "dash" }) },
    ];
    Object.keys(GROUPS).forEach((gk) => {
      navRows.push({ isGroup: true, label: GROUPS[gk].navLabel });
      Object.keys(GROUPS[gk].items).forEach((k) => {
        navRows.push({
          isItem: true, key: gk + ":" + k, label: GROUPS[gk].items[k].label, mark: "▹", merged: true,
          onClick: () => this.select(gk, k),
        });
      });
    });
    navRows.push({ isGroup: true, label: "시스템 아키텍처" });
    navRows.push({ isItem: true, key: "arch", label: "기술 스택", mark: "▸", onClick: () => this.setState({ view: "arch" }) });
    navRows.push({ isItem: true, key: "req", label: "요구사항 정의", mark: "▸", onClick: () => this.setState({ view: "req" }) });
    if (showCheck) {
      navRows.push({ isGroup: true, label: "점검" });
      navRows.push({ isItem: true, key: "check", label: "소스 반영 점검", mark: "▸", onClick: () => this.setState({ view: "check" }) });
    }
    navRows.forEach((r) => {
      if (!r.isItem) return;
      const active = (isGrid && r.key === view + ":" + segKey) ||
        (!isGrid && r.key === view);
      r.style = {
        display: "flex", alignItems: "center", gap: "8px",
        padding: "8px 16px", fontSize: "14px", cursor: "pointer",
        borderLeft: active ? "3px solid #60A5FA" : "3px solid transparent",
        background: active ? "rgba(255,255,255,.12)" : "transparent",
        color: active ? "#fff" : "rgba(255,255,255,.75)",
        fontWeight: active ? 700 : 400,
      };
    });

    const segments = keys.map((k) => {
      const on = k === segKey;
      return {
        label: G.items[k].short, code: G.items[k].code,
        style: {
          display: "inline-flex", alignItems: "center", gap: "6px",
          height: "32px", padding: "0 14px", borderRadius: "999px", cursor: "pointer",
          fontSize: "var(--font-size-xs)", fontWeight: 900,
          border: on ? "1px solid var(--fass-accent)" : "1px solid transparent",
          background: on ? "var(--fass-accent)" : "transparent",
          color: on ? "#fff" : "var(--fass-muted)",
          transition: "background .15s,color .15s",
        },
        codeStyle: {
          fontSize: "11px", fontWeight: 800, letterSpacing: ".02em",
          padding: "1px 5px", borderRadius: "999px",
          background: on ? "rgba(255,255,255,.22)" : "var(--fass-line-soft)",
          color: on ? "#fff" : "var(--fass-subtle)",
        },
        onClick: () => this.select(view, k),
      };
    });

    const tabList = isGrid ? this.groupTabs(view, t) : [];
    const curTab = isGrid ? (tabList.find((x) => x.key === this.state.tab) || tabList[0]) : null;
    const activeTab = curTab ? curTab.key : null;
    const tabDefs = tabList.map((x) => ({ key: x.key, label: x.label, count: x.rows.length }));
    const tabs = tabDefs.map((d) => {
      const on = d.key === activeTab;
      return {
        label: d.label, count: d.count,
        style: {
          display: "inline-flex", alignItems: "center", gap: "6px",
          height: "100%", padding: "0 14px", border: "none", background: "transparent",
          cursor: "pointer", fontSize: "var(--font-size-xs)", fontWeight: 900,
          color: on ? "var(--fass-accent)" : "var(--fass-muted)",
          boxShadow: on ? "inset 0 -2px 0 var(--fass-accent)" : "none",
        },
        countStyle: {
          fontSize: "12px", fontWeight: 800, padding: "1px 6px", borderRadius: "999px",
          background: on ? "var(--fass-accent-soft)" : "var(--fass-line-soft)",
          color: on ? "var(--fass-accent-strong)" : "var(--fass-subtle)",
        },
        onClick: () => this.setState({ tab: d.key, sel: null }),
      };
    });

    const cols = isGrid ? this.parseCols(curTab.cols) : [];
    const isCodeMaster = view === "master" && segKey === "code";
    const rawRows = isGrid ? (isCodeMaster ? this.codeRows() : curTab.rows) : [];
    const rows = isGrid ? this.buildRows(rawRows, cols) : [];
    const footSrc = isGrid ? curTab.foot : null;
    const hasFoot = !!footSrc;
    const foot = hasFoot ? footSrc.map(([v, span, align]) => ({
      v, span,
      style: {
        padding: "9px 10px", background: "var(--fass-surface-alt)",
        borderTop: "1px solid var(--fass-line)",
        fontWeight: 800, fontSize: "var(--font-size-sm)",
        textAlign: align === "r" ? "right" : align === "c" ? "center" : "left",
        fontVariantNumeric: "tabular-nums",
        position: "sticky", bottom: 0,
      },
    })) : [];

    const gridTitle = isGrid ? curTab.title : "";
    const actions = isGrid ? ACTIONS[G.actions].map(([label, variant]) => ({
      label, style: this.actionStyle(variant),
      onClick: () => this.openModal(label, t, cols, view, segKey),
    })) : [];
    const m = this.state.modal;

    return {
      isGrid, isCheck: view === "check", isDash, actions,
      isArch: view === "arch", isReq: view === "req",
      stackAreas: AREA_LIST.map((area) => {
        const tone = AREA_TONE[area];
        const rows = this.state.stack.map((r, i) => ({ r, i })).filter((x) => x.r.area === area);
        return {
          area,
          headStyle: {
            display: "flex", alignItems: "center", gap: "10px", height: "42px", padding: "0 14px",
            borderBottom: "1px solid var(--fass-line)",
            background: tone === "accent" ? "var(--fass-accent-soft)" : tone === "success" ? "var(--fass-success-soft)" : "var(--fass-warning-soft)",
          },
          titleStyle: {
            fontSize: "var(--font-size-sm)", fontWeight: 900,
            color: tone === "accent" ? "var(--fass-accent-strong)" : tone === "success" ? "#166534" : "#92400E",
          },
          count: rows.length + "개 영역",
          rows: rows.map(({ r, i }) => ({
            cat: r.cat, why: r.why,
            onClick: () => this.selectRec("stack", i),
            rowStyle: {
              display: "grid", gridTemplateColumns: "minmax(120px,160px) minmax(0,1fr)", gap: "14px",
              padding: "12px 14px", borderBottom: "1px solid var(--fass-line-soft)", cursor: "pointer",
              background: this.state.selRec.stack === i ? "var(--fass-accent-soft)" : "transparent",
            },
            chips: r.items.split(",").map((n) => n.trim()).filter(Boolean).map((n) => ({
              name: n,
              style: {
                display: "inline-flex", alignItems: "center", minHeight: "22px", padding: "3px 9px",
                whiteSpace: "nowrap", borderRadius: "999px", fontSize: "13px", fontWeight: 800,
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace",
                background: "var(--fass-surface)", border: "1px solid var(--fass-line-strong)",
                color: "var(--fass-text)",
              },
            })),
          })),
        };
      }),
      stackActions: [
        { label: "항목 등록", style: this.actionStyle("primary"), onClick: () => this.openRec("stack", "add") },
        { label: "수정", style: this.actionStyle("secondary"), onClick: () => this.openRec("stack", "edit") },
        { label: "삭제", style: this.actionStyle("danger"), onClick: () => this.openRec("stack", "delete") },
      ],
      stackHint: this.state.selRec.stack === null ? "행을 클릭해 선택한 뒤 수정·삭제할 수 있습니다." : "선택됨 · " + this.state.stack[this.state.selRec.stack].cat,
      reqActions: [
        { label: "요구사항 등록", style: this.actionStyle("primary"), onClick: () => this.openRec("req", "add") },
        { label: "수정", style: this.actionStyle("secondary"), onClick: () => this.openRec("req", "edit") },
        { label: "삭제", style: this.actionStyle("danger"), onClick: () => this.openRec("req", "delete") },
      ],
      reqHint: this.state.selRec.req === null ? "행을 클릭해 선택한 뒤 수정·삭제할 수 있습니다." : "선택됨 · " + this.state.reqs[this.state.selRec.req].id,
      layers: LAYERS.map((l, i) => ({
        name: l.name, note: l.note, isLast: i === LAYERS.length - 1,
        barStyle: {
          width: "4px", alignSelf: "stretch", borderRadius: "999px",
          background: l.tone === "accent" ? "var(--fass-accent)" : l.tone === "success" ? "var(--fass-success)"
            : l.tone === "warning" ? "var(--fass-warning)" : l.tone === "navy" ? "var(--fass-navy)" : "var(--fass-subtle)",
        },
        nodes: l.nodes.map((n) => ({ name: n })),
      })),
      reqTables: ["FR", "NFR"].map((kind) => ({
        title: kind === "FR" ? "기능 요구사항" : "비기능 요구사항",
        note: kind + " · " + this.state.reqs.filter((r) => r.kind === kind).length + "건",
        isFR: kind === "FR",
        rows: this.state.reqs.map((r, i) => ({ r, i })).filter((x) => x.r.kind === kind).map(({ r, i }) => ({
          cat: r.cat, id: r.id, name: r.name, detail: r.detail, pri: r.pri, memo: r.memo,
          hasMemo: !!r.memo, hasPri: !!r.pri,
          onClick: () => this.selectRec("req", i),
          rowStyle: { cursor: "pointer", background: this.state.selRec.req === i ? "var(--fass-accent-soft)" : "transparent" },
          priStyle: ((pri) => ({
            display: "inline-flex", alignItems: "center", height: "20px", padding: "0 8px",
            borderRadius: "999px", fontSize: "13px", fontWeight: 800,
            background: pri === "필수" ? "var(--fass-danger-soft)" : pri === "중요" ? "var(--fass-warning-soft)" : "var(--fass-line-soft)",
            color: pri === "필수" ? "var(--fass-danger)" : pri === "중요" ? "var(--fass-warning)" : "var(--fass-muted)",
          }))(r.pri),
        })),
      })),
      segLabel: isGrid ? G.segLabel : "",
      segNote: isGrid ? G.segNote : "",
      hasModal: !!m,
      modalTitle: m ? m.title : "",
      modalSub: m ? m.sub : "",
      modalIsForm: !!(m && m.fields),
      modalIsRec: !!(m && m.kind === "rec"),
      modalIsConfirm: !!(m && m.lines),
      modalFields: m && m.fields ? m.fields : [],
      modalRecFields: m && m.kind === "rec" ? REC_SPEC[m.target].fields.map((f) => ({
        label: f.label + (f.required ? " *" : ""),
        isSelect: f.kind === "select", isArea: f.kind === "area", isText: f.kind === "text",
        options: f.options || [],
        value: (this.state.draft && this.state.draft[f.k] !== undefined) ? this.state.draft[f.k] : "",
        placeholder: f.ph || "",
        cellStyle: { display: "flex", flexDirection: "column", gap: "4px", gridColumn: f.wide ? "1 / -1" : "auto" },
        onChange: (e) => this.setDraft(f.k, e.target.value),
      })) : [],
      modalLines: m && m.lines ? m.lines : [],
      modalConfirmLabel: m ? m.confirmLabel : "",
      modalConfirmStyle: m ? this.actionStyle(m.danger ? "danger" : "primary") : null,
      closeModal: () => this.setState({ modal: null, draft: null }),
      submitModal: () => {
        if (m && m.kind === "rec") { this.saveRec(m.target); return; }
        if (m && m.kind === "recDelete") { this.deleteRec(m.target); return; }
        this.setState({ modal: null, msg: (m ? m.title : "") + " 처리 완료 · " + (t ? t.label : "") });
      },
      navRows, segments, tabs, cols, rows, foot, hasFoot,
      headTitle: isGrid ? t.title : (isDash ? "통합 대시보드" : view === "arch" ? "기술 스택 · 아키텍처" : view === "req" ? "요구사항 정의" : "소스 반영 점검"),
      headSub: isGrid ? t.sub : (isDash ? "· 전체 주유소 운영 현황" : view === "arch" ? "· 요구사항 정의서 기준 FaSS 연계 오픈소스 스택" : view === "req" ? "· 기능(FR) 15건 · 비기능(NFR) 10건" : "· 첨부된 차세대 소스(FASS) 대비 반영 현황"),
      summary: isGrid ? t.summary : "",
      expanded: !this.state.collapsed,
      collapseLabel: this.state.collapsed ? "펼치기" : "접기",
      toggleCollapse: () => this.setState({ collapsed: !this.state.collapsed }),
      doSearch: () => this.setState({ msg: "조회 완료 · " + t.label + " " + rawRows.length + "건 표시" }),
      filters: (isGrid ? (view === "fuel" ? FUEL_FILTERS : t.filters) : []).map((f) => ({
        label: f.label,
        isSelect: f.kind === "select",
        isInput: f.kind !== "select",
        type: f.kind === "text" ? "text" : f.kind,
        value: f.value || "",
        placeholder: f.placeholder || "",
        options: this.dynOptions(f),
      })),
      metrics: (isGrid ? (isCodeMaster ? this.codeMetrics() : t.metrics) : []).map((m) => ({
        label: m.label, value: m.value, unit: m.unit, note: m.note,
        valueStyle: {
          fontSize: String(m.value).length > 8 ? "var(--font-size-lg)" : "var(--font-size-xl)",
          fontWeight: 800, lineHeight: 1, fontVariantNumeric: "tabular-nums",
          color: this.tone(m.tone),
        },
      })),
      gridTitle,
      gridCount: rawRows.length + "건 표시",
      mergeNote: isGrid ? MERGE_NOTE[view] : "",
      checkGroups: CHECK_GROUPS.map((g) => ({
        title: g.title, note: g.note,
        items: g.items.map((it) => ({
          name: it.name, status: it.status, note: it.note,
          badgeStyle: this.badgeStyle(
            it.status === "반영" ? "green" :
            it.status === "부분" ? "warn" :
            it.status === "수정" ? "blue" :
            it.status === "미반영" ? "red" : "gray"
          ),
        })),
      })),
      checkMetrics: CHECK_METRICS.map((m) => ({
        label: m.label, value: m.value, note: m.note,
        valueStyle: { fontSize: "var(--font-size-xl)", fontWeight: 800, lineHeight: 1, color: this.tone(m.tone) },
      })),
      dashKpis: DASH.kpis.map((k) => ({
        label: k.label, value: k.value, note: k.note,
        valueStyle: { fontSize: String(k.value).length > 8 ? "var(--font-size-lg)" : "30px", fontWeight: 800, lineHeight: 1, fontVariantNumeric: "tabular-nums", color: this.tone(k.tone) },
        cardStyle: { display: "flex", flexDirection: "column", gap: "8px", padding: "14px 16px", background: "var(--fass-surface)", border: "1px solid var(--fass-line)", borderLeft: "3px solid " + this.tone(k.tone), borderRadius: "var(--fass-radius-lg)", boxShadow: "var(--shadow-sm)" },
      })),
      dashStations: DASH.stations.map((s) => ({
        name: s.name, rows: s.rows,
        badgeStyle: this.badgeStyle(s.badgeTone), badge: s.badge,
        cardStyle: { display: "flex", flexDirection: "column", gap: "8px", padding: "12px 14px", border: "1px solid var(--fass-line)", borderLeft: "3px solid " + this.tone(s.tone), borderRadius: "var(--fass-radius-md)" },
      })),
      dashTanks: DASH.tanks.map((s) => ({
        station: s.station,
        state: s.fuels.some((f) => f.tone === "warning") ? "주의" : "정상",
        stateStyle: {
          display: "inline-flex", alignItems: "center", height: "18px", padding: "0 8px", borderRadius: "999px",
          fontSize: "12px", fontWeight: 800,
          background: s.fuels.some((f) => f.tone === "warning") ? "var(--fass-warning-soft)" : "var(--fass-success-soft)",
          color: s.fuels.some((f) => f.tone === "warning") ? "var(--fass-warning)" : "var(--fass-success)",
        },
        fuels: s.fuels.map((f) => ({
          label: f.label, pct: f.pct + "%",
          barStyle: { width: f.pct + "%", height: "100%", borderRadius: "999px", background: this.tone(f.tone) },
          pctStyle: { fontSize: "var(--font-size-xs)", fontWeight: 800, color: this.tone(f.tone), fontVariantNumeric: "tabular-nums" },
        })),
      })),
      dashIf: DASH.ifRows,
      dashLog: DASH.log.map((l) => ({
        text: l.text, meta: l.meta,
        dotStyle: { width: "9px", height: "9px", borderRadius: "50%", flexShrink: 0, marginTop: "5px", background: this.tone(l.tone) },
      })),
      dashJump: DASH.jump.map((j) => ({
        label: j.label, note: j.note,
        onClick: () => this.select(j.view, j.key),
      })),
      statusLeft: this.state.msg || (isGrid
        ? "[2026-07-27 16:04] " + t.label + " " + t.metrics[0].value + t.metrics[0].unit + " 조회 완료"
        : isDash ? "시스템 정상 운영 중 · DB 응답 12ms"
        : view === "arch" ? "요구사항 정의서 260720 · FaSS 연계 기술 스택 8개 영역"
        : view === "req" ? "요구사항 정의서 260720 · FR 15건 / NFR 10건"
        : "첨부 소스 32개 컴포넌트 대비 점검 결과"),
      statusRight: (isGrid ? "화면 : JTGS" + t.code + " (통합)" : isDash ? "통합 대시보드" : view === "arch" ? "기술 스택 · 아키텍처" : view === "req" ? "요구사항 정의" : "소스 반영 점검") + " | 한성민 프로 / 정보전략팀 | 2026-07-27 16:04",
    };
  }


  render() {
    const v = this.renderVals();
    return <Shell v={v} />;
  }
}
