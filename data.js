/* =========================================================
   Autostay OPS Dashboard — Portfolio Static Data
   All figures are fictional / illustrative only
   ========================================================= */
(function () {
  'use strict';

  /* ── FICTIONAL DATA ─────────────────────────────────── */
  var STORES = [
    { id:'seongsu',     name:'성수점',   score:87, grade:'A', status:'정상',
      util:88, churn:10, rev:4820, ach:92, netRev:4180, usage:1821, refund:3.2,
      netChange:+24, arpu:40200, mrr:382, issues:1, trend:[83,85,86,87,87] },
    { id:'hanam',       name:'하남점',   score:81, grade:'B', status:'주의',
      util:82, churn:12, rev:4120, ach:86, netRev:3620, usage:1548, refund:4.1,
      netChange:+18, arpu:38900, mrr:324, issues:2, trend:[79,80,81,80,81] },
    { id:'ilsan',       name:'일산점',   score:79, grade:'B', status:'정상',
      util:80, churn:14, rev:3840, ach:83, netRev:3310, usage:1432, refund:4.8,
      netChange:+14, arpu:37500, mrr:298, issues:1, trend:[77,78,79,79,79] },
    { id:'gwangmyeong', name:'광명점',   score:72, grade:'C', status:'경고',
      util:73, churn:18, rev:3190, ach:78, netRev:2720, usage:1210, refund:6.2,
      netChange:+8,  arpu:35800, mrr:254, issues:3, trend:[74,73,72,72,72] },
    { id:'goyang',      name:'고양점',   score:68, grade:'C', status:'경고',
      util:69, churn:21, rev:2870, ach:74, netRev:2410, usage:1094, refund:7.1,
      netChange:-2,  arpu:34200, mrr:231, issues:4, trend:[70,69,68,68,68] },
    { id:'jayuro',      name:'자유로점', score:63, grade:'D', status:'위험',
      util:64, churn:26, rev:2460, ach:68, netRev:2040, usage:921,  refund:9.4,
      netChange:-8,  arpu:31600, mrr:198, issues:5, trend:[65,64,63,63,63] },
  ];

  var MONTHS = ['1월', '2월', '3월', '4월', '5월'];
  var PALETTE = ['#243350', '#8f4219', '#1d6450', '#b87030', '#ae3f4d', '#6b7280'];

  /* ── HELPERS ────────────────────────────────────────── */
  function el(id) { return document.getElementById(id); }
  function setText(id, v) { var e = el(id); if (e) e.textContent = v; }
  function setHtml(id, v) { var e = el(id); if (e) e.innerHTML = v; }

  /* ── LOADING OVERLAY ────────────────────────────────── */
  function dismissOverlay() {
    /* Animate load steps */
    var steps = ['lstep-sheets', 'lstep-stores', 'lstep-render'];
    var bar = el('loadProgressBar');
    var pcts = [40, 75, 100];
    steps.forEach(function(id, i) {
      setTimeout(function() {
        var s = el(id); if (s) s.classList.add('active');
        if (bar) bar.style.width = pcts[i] + '%';
        if (i === steps.length - 1) {
          setTimeout(function() {
            var ov = el('loadingOverlay');
            if (!ov) return;
            ov.style.transition = 'opacity 0.5s ease';
            ov.style.opacity = '0';
            setTimeout(function() { ov.style.display = 'none'; }, 550);
          }, 300);
        }
      }, i * 180);
    });
  }

  /* ── SVG NEEDLE GAUGE ───────────────────────────────── */
  function drawGauge(containerId, pct, fillColor) {
    var svg = el(containerId);
    if (!svg) return;
    var cx = 100, cy = 108, r = 76, sw = 13;
    var cl  = Math.min(Math.max(pct, 0.01), 0.99);
    var ang = Math.PI * (1 - cl);
    var ex  = cx + r  * Math.cos(ang);
    var ey  = cy - r  * Math.sin(ang);
    var nr  = r - 10;
    var nx  = cx + nr * Math.cos(ang);
    var ny  = cy - nr * Math.sin(ang);
    var lg  = cl > 0.5 ? 1 : 0;

    var trackD = 'M ' + (cx - r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy;
    var fillD  = 'M ' + (cx - r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 ' + lg + ' 1 ' + ex + ' ' + ey;

    svg.innerHTML =
      '<path d="' + trackD + '" fill="none" stroke="#e5e0d8" stroke-width="' + sw + '" stroke-linecap="round"/>' +
      '<path d="' + fillD  + '" fill="none" stroke="' + fillColor + '" stroke-width="' + sw + '" stroke-linecap="round"/>' +
      '<line x1="' + cx + '" y1="' + cy + '" x2="' + nx + '" y2="' + ny + '" stroke="#2a2a2a" stroke-width="2.5" stroke-linecap="round"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="#2a2a2a"/>';
  }

  function renderGauges() {
    drawGauge('gsvg-ach',   0.920,       '#1d6450');
    drawGauge('gsvg-util',  0.805,       '#243350');
    drawGauge('gsvg-churn', 1 - 0.137,  '#ae3f4d');
    drawGauge('gsvg-mrr',   0.780,       '#8f4219');

    setText('gval-ach',   '92.0%');    setText('gsub-ach',   'vs 목표 90%');     setText('gbadge-ach',   '▲ 2.0%p');
    setText('gval-util',  '80.5%');    setText('gsub-util',  '전 매장 평균');     setText('gbadge-util',  '▲ 3.2%p');
    setText('gval-churn', '13.7%');    setText('gsub-churn', '월간 이탈률');      setText('gbadge-churn', '▼ 1.8%p');
    setText('gval-mrr',   '₩1.71억'); setText('gsub-mrr',   'MRR 달성률');       setText('gbadge-mrr',   '▲ 5.1%p');
  }

  /* ── HERO STRIP ─────────────────────────────────────── */
  function renderHero() {
    setText('focusLabel',     '전체 운영 현황');
    setText('focusSub',       '2026년 5월 기준 · 6개 직영 매장');
    setText('updatedAt',      '업데이트: 2026-05-06 09:00');
    setText('auditBadge',     '운영감사 D-12');
    setText('scoreBadgeVal',  '81');
    setText('scoreBadgeRank', '/ 100점');

    var items = [
      { label:'총매출',    value:'24.3억',  delta:'+8.4%',  pos:true },
      { label:'총구독자',  value:'4,217명', delta:'+312명', pos:true },
      { label:'평균 NPS',  value:'72점',    delta:'+4pt',   pos:true },
      { label:'CS해결률',  value:'94.2%',   delta:'+1.3%p', pos:true },
      { label:'운영점수',  value:'78.5점',  delta:'+2.1pt', pos:true },
      { label:'이탈률',    value:'13.7%',   delta:'-1.8%p', pos:true },
    ];
    var strip = el('heroKpiStrip');
    if (strip) {
      strip.innerHTML = items.map(function (k) {
        return '<div class="hero-kpi">' +
          '<div class="hero-kpi-label">' + k.label + '</div>' +
          '<div class="hero-kpi-val">'   + k.value + '</div>' +
          '<div class="hero-kpi-delta">' + k.delta + '</div>' +
          '</div>';
      }).join('');
    }
  }

  /* ── STATUS / ALERT ─────────────────────────────────── */
  function renderStatus() {
    var dot = el('statusDot');
    var txt = el('statusText');
    if (dot) dot.style.background = '#1d6450';
    if (txt) txt.textContent = '정상 운영중';

    var alertEl = el('alertStrip');
    if (alertEl) {
      alertEl.style.display = 'flex';
      alertEl.innerHTML =
        '<span class="alert-item alert-warn">⚠ 자유로점 가동률 64% — 즉시 점검 필요</span>' +
        '<span class="alert-item alert-info">ℹ 광명점 이탈률 18% 증가 추세</span>' +
        '<span class="alert-item alert-info">ℹ Q2 구독 목표 88% 달성 중</span>';
    }
  }

  /* ── ACTION CENTER ──────────────────────────────────── */
  function renderActionCenter() {
    setText('acActionCount', '7');
    setHtml('acActionList',
      ['자유로점 장비 점검 일정 확정',
       '광명점 이탈 고객 세그먼트 분석',
       '고양점 CS 응답 속도 개선',
       '하남점 멤버십 업셀 캠페인 실행',
       '일산점 주차 민원 대응 완료',
       '전 매장 5월 MRR 정산 검토',
       '운영감사 사전 점검 리스트 배포']
      .map(function (t) { return '<li style="font-size:12.5px;padding:2px 0;color:var(--text-2)">' + t + '</li>'; }).join(''));

    setText('acDangerCount', '3');
    setHtml('acDangerList',
      [{ name:'자유로점', score:63, issue:'가동률 64% / 이탈률 26%' },
       { name:'고양점',   score:68, issue:'CS해결률 87% / NPS 61점' },
       { name:'광명점',   score:72, issue:'이탈률 18% 상승 추세'   }]
      .map(function (s) {
        return '<li style="font-size:12.5px;padding:3px 0;color:var(--text-2)">' +
          '<strong>' + s.name + '</strong>' +
          ' <span style="font-size:10.5px;padding:1px 7px;border-radius:99px;background:var(--rose-soft);color:var(--rose);font-weight:800">' + s.score + '점</span>' +
          '<br><small style="color:var(--muted);font-size:11px">' + s.issue + '</small></li>';
      }).join(''));

    setHtml('acLossBody',
      '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:12.5px">' +
        '<span>이탈 손실 추정</span><strong>₩18.4M/월</strong></div>' +
      '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:12.5px">' +
        '<span>가동률 손실 추정</span><strong>₩9.2M/월</strong></div>' +
      '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:12.5px">' +
        '<span>CS 미해결 기회손실</span><strong>₩4.7M/월</strong></div>' +
      '<div style="display:flex;justify-content:space-between;padding:8px 0 0;font-size:13px;font-weight:800;color:var(--accent)">' +
        '<span>총 기회손실 합계</span><strong>₩32.3M/월</strong></div>');
  }

  /* ── KPI GRID ───────────────────────────────────────── */
  var KPI_COLORS = ['accent', 'navy', 'green', 'rose', 'teal', 'amber', 'navy', 'green'];

  function renderKpiGrid() {
    var kg = el('kpiGrid');
    if (!kg) return;
    var kpis = [
      { label:'월 구독 수익 (MRR)', value:'₩171M',  delta:'+12.4%',  sub:'전월 대비',       trend:[148,155,160,166,171] },
      { label:'총 구독자',          value:'4,217명', delta:'+7.9%',   sub:'6개 매장 합산',   trend:[3810,3920,4010,4120,4217] },
      { label:'평균 가동률',        value:'80.5%',   delta:'+3.2%p',  sub:'전 매장 평균',    trend:[76,77,79,80,81] },
      { label:'월간 이탈률',        value:'13.7%',   delta:'-1.8%p',  sub:'목표 12%',        trend:[17,16,15,14,14] },
      { label:'CS 해결률',          value:'94.2%',   delta:'+1.3%p',  sub:'당일 해결 기준',  trend:[91,92,93,93,94] },
      { label:'평균 NPS',           value:'72점',    delta:'+4pt',    sub:'추천 의향 지수',  trend:[65,67,69,71,72] },
      { label:'ARPU',               value:'₩40,570', delta:'+3.1%',   sub:'가입자당 월 수익',trend:[38100,39000,39500,40100,40570] },
      { label:'재구독률',           value:'87.3%',   delta:'+2.1%p',  sub:'12개월 기준',     trend:[83,84,85,86,87] },
    ];

    kg.innerHTML = kpis.map(function (k, i) {
      var max = Math.max.apply(null, k.trend);
      var min = Math.min.apply(null, k.trend);
      var span = max - min || 1;
      var pts = k.trend.map(function (v, j) {
        return (j * 14) + ',' + (22 - ((v - min) / span) * 18);
      }).join(' ');
      var isDown = k.delta.charAt(0) === '-';
      var deltaClass = isDown ? 'kpi-delta down' : 'kpi-delta up';
      var col = KPI_COLORS[i] || 'accent';
      return '<div class="kpi ' + col + '">' +
        '<div class="kpi-label">' + k.label + '</div>' +
        '<div class="kpi-main">' +
          '<div class="kpi-value">' + k.value + '</div>' +
          '<svg class="kpi-spark" viewBox="0 0 56 26" preserveAspectRatio="none" width="56" height="26">' +
            '<polyline points="' + pts + '" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
          '</svg>' +
        '</div>' +
        '<div class="kpi-row">' +
          '<span class="' + deltaClass + '">' + k.delta + '</span>' +
        '</div>' +
        '<div class="kpi-sub">' + k.sub + '</div>' +
        '</div>';
    }).join('');
  }

  /* ── SIGNAL GRID ────────────────────────────────────── */
  function renderSignalGrid() {
    var sg = el('signalGrid');
    if (!sg) return;
    var signals = [
      { label:'이탈 위험 구독자',  value:'312명', change:'▲ 28명 증가',       level:'warn'  },
      { label:'장비 점검 필요',    value:'3건',   change:'자유로 · 광명 · 고양', level:'bad'  },
      { label:'CS 미처리 티켓',    value:'18건',  change:'48시간 초과',          level:'warn'  },
      { label:'이번 주 신규 가입', value:'94명',  change:'▲ 11% 증가',           level:'ok'    },
    ];
    sg.innerHTML = signals.map(function (s) {
      return '<div class="signal ' + s.level + '">' +
        '<div class="signal-dot"></div>' +
        '<div class="signal-text">' +
          '<strong>' + s.label + ' — ' + s.value + '</strong>' +
          '<span>' + s.change + '</span>' +
        '</div></div>';
    }).join('');
  }

  /* ── INSIGHTS ───────────────────────────────────────── */
  function renderInsights() {
    setText('headline', '자유로점 집중 관리 필요 — 가동률·이탈률 동반 악화');

    setHtml('riskList',
      [{ text:'자유로점: 가동률 64%, 이탈률 26% — 즉각 현장 점검 권고', level:'critical' },
       { text:'고양점: NPS 61점 3개월 연속 하락 추세',                   level:'warning'  },
       { text:'광명점: 이탈률 전월 대비 +4%p 급등',                      level:'warning'  }]
      .map(function (r) {
        return '<div class="risk-item">' +
          '<div class="risk-dot ' + r.level + '"></div>' +
          '<span>' + r.text + '</span>' +
          '</div>';
      }).join(''));

    setHtml('auditList',
      ['성수점: 매출·가동률 2개월 연속 목표 초과 달성',
       '하남점: CS해결률 98% — 전 매장 최고',
       '일산점: 신규 가입 주간 1위 (94명)']
      .map(function (a) {
        return '<div class="audit-item"><span class="audit-ok">✓</span> ' + a + '</div>';
      }).join(''));
  }

  /* ── STORE SELECT ───────────────────────────────────── */
  function renderStoreSelect() {
    var sel = el('storeSelect');
    if (!sel) return;
    sel.innerHTML = '<option value="all">전체 매장</option>' +
      STORES.map(function (s) {
        return '<option value="' + s.id + '">' + s.name + '</option>';
      }).join('');
  }

  /* ── STORE TABLE ────────────────────────────────────── */
  function renderStoreTable() {
    var tbody = el('storeTableBody');
    if (!tbody) return;
    var sc = { '정상':'verdict-chip good', '주의':'verdict-chip warn', '경고':'verdict-chip warn', '위험':'verdict-chip bad' };

    tbody.innerHTML = STORES.map(function (s) {
      var achColor = s.ach >= 90 ? '#1d6450' : s.ach >= 80 ? '#243350' : s.ach >= 70 ? '#b87030' : '#ae3f4d';
      var netSign  = s.netChange >= 0 ? '+' : '';
      var netColor = s.netChange >= 0 ? '#1d6450' : '#ae3f4d';
      return '<tr>' +
        '<td><strong>' + s.name + '</strong></td>' +
        '<td>₩' + s.rev + '만</td>' +
        '<td><span class="ach-wrap" style="color:' + achColor + '">' + s.ach + '%</span></td>' +
        '<td>₩' + s.netRev + '만</td>' +
        '<td>' + s.usage.toLocaleString() + '건</td>' +
        '<td>' + s.util + '%</td>' +
        '<td>' + s.refund + '%</td>' +
        '<td style="color:' + netColor + ';font-weight:600">' + netSign + s.netChange + '명</td>' +
        '<td>₩' + s.arpu.toLocaleString() + '</td>' +
        '<td><span class="' + (sc[s.status] || 'verdict-chip') + '">' + s.status + '</span></td>' +
        '</tr>';
    }).join('');
  }

  /* ── RANK STRIP ─────────────────────────────────────── */
  function renderRankStrip() {
    var rs = el('rankStrip');
    if (!rs) return;
    var sorted = STORES.slice().sort(function (a, b) { return b.score - a.score; });
    var maxRev = Math.max.apply(null, sorted.map(function(s){ return s.rev; }));
    rs.innerHTML = sorted.map(function (s, i) {
      var barColor = s.score >= 80 ? '#1d6450' : s.score >= 70 ? '#b87030' : '#ae3f4d';
      var barPct   = Math.round((s.rev / maxRev) * 100);
      var numClass = i < 3 ? 'rank-num top' : 'rank-num';
      return '<div class="rank-row">' +
        '<span class="' + numClass + '">' + (i + 1) + '</span>' +
        '<span class="rank-name">' + s.name + '</span>' +
        '<div class="rank-bar-wrap"><div class="rank-bar" style="width:' + barPct + '%;background:' + barColor + '"></div></div>' +
        '<span class="rank-val">₩' + s.rev + '만</span>' +
        '<span class="rank-ach">' + s.ach + '%</span>' +
        '</div>';
    }).join('');
  }

  /* ── HEATMAP ────────────────────────────────────────── */
  function renderHeatmap() {
    var hg = el('heatmapGrid');
    if (!hg) return;
    var metrics = [
      { key:'score', label:'운영점수', fmt:function(v){return v+'점';} },
      { key:'util',  label:'가동률',   fmt:function(v){return v+'%';} },
      { key:'churn', label:'이탈률',   fmt:function(v){return v+'%';}, invert:true },
      { key:'ach',   label:'달성률',   fmt:function(v){return v+'%';} },
      { key:'refund',label:'환불율',   fmt:function(v){return v+'%';}, invert:true },
      { key:'arpu',  label:'ARPU',     fmt:function(v){return '₩'+(v/1000).toFixed(0)+'k';} },
      { key:'mrr',   label:'MRR',      fmt:function(v){return '₩'+v+'M';} },
    ];

    function cellBg(v, min, max, invert) {
      var norm = (v - min) / (max - min || 1);
      if (invert) norm = 1 - norm;
      if (norm >= 0.7) return '#1d6450';
      if (norm >= 0.4) return '#b87030';
      return '#ae3f4d';
    }

    var header = '<div class="hm-header" style="display:grid;grid-template-columns:80px repeat(' + metrics.length + ',1fr);gap:3px;margin-bottom:3px">' +
      '<div></div>' + metrics.map(function(m){ return '<div class="hm-head-cell">' + m.label + '</div>'; }).join('') + '</div>';

    var rows = STORES.map(function (s) {
      return '<div class="hm-row" style="display:grid;grid-template-columns:80px repeat(' + metrics.length + ',1fr);gap:3px;margin-bottom:3px">' +
        '<div class="hm-label-cell">' + s.name + '</div>' +
        metrics.map(function(m) {
          var vals = STORES.map(function(x){ return x[m.key]; });
          var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals);
          var bg = cellBg(s[m.key], mn, mx, m.invert);
          return '<div class="hm-cell" style="background:' + bg + ';color:#fff">' +
            '<span class="hm-cell-top">' + m.fmt(s[m.key]) + '</span>' +
            '</div>';
        }).join('') + '</div>';
    }).join('');
    hg.innerHTML = header + rows;
  }

  /* ── CAPACITY PANEL ─────────────────────────────────── */
  function renderCapacity() {
    var cp = el('capacityPanel');
    if (!cp) return;
    var BASE = 45741;

    function capColor(v) {
      if (v >= 85) return '#1d6450';
      if (v >= 75) return '#243350';
      if (v >= 70) return '#b87030';
      return '#ae3f4d';
    }

    /* Summary row */
    var avgUtil = Math.round(STORES.reduce(function(a,s){return a+s.util;},0) / STORES.length);
    var totalIdle = STORES.reduce(function(a,s){return a + Math.round(BASE*(1-s.util/100));},0);
    var totalLoss = Math.round(totalIdle * 40 / 10000);

    var summary =
      '<div class="cap-summary">' +
      '<div class="cap-sum-item"><div class="cap-sum-label">평균 가동률</div><div class="cap-sum-val">' + avgUtil + '%</div></div>' +
      '<div class="cap-sum-item"><div class="cap-sum-label">기준 대수/월</div><div class="cap-sum-val">' + BASE.toLocaleString() + '</div></div>' +
      '<div class="cap-sum-item"><div class="cap-sum-label">총 미가동 추정</div><div class="cap-sum-val bad">' + totalIdle.toLocaleString() + '</div></div>' +
      '<div class="cap-sum-item"><div class="cap-sum-label">손실 추정 (만원)</div><div class="cap-sum-val bad">₩' + totalLoss.toLocaleString() + 'M</div></div>' +
      '<div class="cap-sum-item"><div class="cap-sum-label">매장 수</div><div class="cap-sum-val">' + STORES.length + '</div></div>' +
      '</div>';

    var grid = '<div class="cap-store-grid">' +
      STORES.map(function(s) {
        var idle   = Math.round(BASE * (1 - s.util / 100));
        var loss   = Math.round(idle * 40 / 10000);
        var color  = capColor(s.util);
        return '<div class="cap-store-card">' +
          '<div class="cap-store-head">' +
            '<span class="cap-store-name">' + s.name + '</span>' +
            '<span class="cap-store-util" style="color:' + color + '">' + s.util + '%</span>' +
          '</div>' +
          '<div class="cap-bar-wrap"><div class="cap-bar" style="width:' + s.util + '%;background:' + color + '"></div></div>' +
          '<div class="cap-store-meta"><span>월 기준 대수</span><span>' + BASE.toLocaleString() + '대</span></div>' +
          '<div class="cap-idle">미가동 추정: ' + idle.toLocaleString() + '대 · 손실 ₩' + loss + 'M</div>' +
          '</div>';
      }).join('') + '</div>';

    cp.innerHTML = summary + grid;
  }

  /* ── PAYMENT / ARPU PANEL ───────────────────────────── */
  function renderPayment() {
    var pp = el('paymentPanel');
    if (!pp) return;
    pp.innerHTML =
      '<div class="pay-item accent">' +
        '<div class="pay-label">베이직</div>' +
        '<div class="pay-val">₩29,000</div>' +
        '<div class="pay-note">2,180명 · 51.7%</div>' +
      '</div>' +
      '<div class="pay-item navy">' +
        '<div class="pay-label">스탠다드</div>' +
        '<div class="pay-val">₩39,000</div>' +
        '<div class="pay-note">1,420명 · 33.7%</div>' +
      '</div>' +
      '<div class="pay-item green">' +
        '<div class="pay-label">프리미엄</div>' +
        '<div class="pay-val">₩59,000</div>' +
        '<div class="pay-note">617명 · 14.6%</div>' +
      '</div>' +
      '<div class="pay-item amber">' +
        '<div class="pay-label">평균 ARPU</div>' +
        '<div class="pay-val">₩40,570</div>' +
        '<div class="pay-note">전체 구독자 기준</div>' +
      '</div>';
  }

  /* ── DETAIL PANEL ───────────────────────────────────── */
  function renderDetailPanel() {
    setText('detailTitle', '성수점 상세');
    setText('detailSub',   '2026년 5월 기준 · 최우수 매장');
    setHtml('detailGrid',
      [{ label:'운영점수',  val:'87점',    sub:'전체 1위',       trend:'up',   delta:'▲ 4pt' },
       { label:'가동률',    val:'88%',     sub:'목표 85%',       trend:'up',   delta:'▲ 3%p' },
       { label:'이탈률',    val:'10%',     sub:'목표 12% 이하',  trend:'up',   delta:'▼ 2%p' },
       { label:'NPS',       val:'79점',    sub:'업계 평균 65',   trend:'up',   delta:'▲ 7pt' },
       { label:'CS해결률',  val:'96%',     sub:'당일 해결',      trend:'up',   delta:'▲ 2%p' },
       { label:'MRR',       val:'₩38.2M', sub:'전월 대비',       trend:'up',   delta:'▲ 8.4%' }]
      .map(function(d) {
        return '<div class="d-item">' +
          '<div class="d-label">' + d.label + '</div>' +
          '<div class="d-val">' + d.val + '</div>' +
          '<div class="d-sub">' + d.sub + '</div>' +
          '<div class="d-trend ' + d.trend + '">' + d.delta + '</div>' +
          '</div>';
      }).join(''));

    /* Sub pipeline */
    setHtml('subPipeline',
      [{ label:'신규 가입',  val:'+42명',  pct:65, color:'#1d6450', note:'월 목표 대비 105%' },
       { label:'이탈',       val:'-18명',  pct:28, color:'#ae3f4d', note:'목표 20명 이하' },
       { label:'업그레이드', val:'+8건',   pct:35, color:'#243350', note:'스탠다드→프리미엄' },
       { label:'순증',       val:'+24명',  pct:72, color:'#8f4219', note:'전월 대비 +4명' }]
      .map(function(p) {
        return '<div class="pipe-row">' +
          '<div class="pipe-label">' + p.label + '</div>' +
          '<div class="pipe-bar-wrap">' +
            '<div class="pipe-bar" style="width:' + p.pct + '%;background:' + p.color + '"></div>' +
            '<span class="pipe-val">' + p.val + '</span>' +
          '</div>' +
          '<div class="pipe-footer">' + p.note + '</div>' +
          '</div>';
      }).join(''));
  }

  /* ── CHART HELPERS ──────────────────────────────────── */
  function axisStyle() {
    return { ticks: { color: '#777', font: { size: 10 } }, grid: { color: '#ece6de' } };
  }
  function axesStyle() { return { x: axisStyle(), y: axisStyle() }; }

  var basePlugins = {
    legend: { labels: { color: '#3a3028', font: { size: 11 }, boxWidth: 12 } },
    datalabels: { display: false },
  };

  function tryChart(id, config) {
    var canvas = el(id);
    if (!canvas) return;
    try { new Chart(canvas.getContext('2d'), config); }
    catch (e) { console.warn('Chart skipped:', id, e.message); }
  }

  /* ── CHARTS ─────────────────────────────────────────── */
  function renderCharts() {

    /* 1. Performance — 매장별 월 운영점수 추이 */
    tryChart('performanceChart', {
      type: 'line',
      data: {
        labels: MONTHS,
        datasets: STORES.map(function (s, i) {
          return { label: s.name, data: s.trend,
            borderColor: PALETTE[i], backgroundColor: PALETTE[i] + '22',
            tension: 0.4, pointRadius: 3, borderWidth: 2 };
        }),
      },
      options: { responsive:true, maintainAspectRatio:false,
        plugins: basePlugins, scales: axesStyle() },
    });

    /* 2. Score — 운영 레버 레이더 */
    tryChart('scoreChart', {
      type: 'radar',
      data: {
        labels: ['가동률', '이탈관리', 'CS해결률', 'NPS', '재구독률', '매출달성'],
        datasets: [{ label: '전체 평균', data: [80,75,94,72,87,80],
          borderColor: '#243350', backgroundColor: '#24335022', pointRadius: 3 }],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins: basePlugins,
        scales: { r: { ticks:{ color:'#888', stepSize:20, backdropColor:'transparent' },
          grid:{ color:'#e0d8cc' }, pointLabels:{ color:'#555', font:{ size:11 } } } } },
    });

    /* 3. Subscription — 구독자 증감 */
    tryChart('subscriptionChart', {
      type: 'bar',
      data: {
        labels: MONTHS,
        datasets: [
          { label:'신규 가입', data:[280,295,310,305,330], backgroundColor:'#1d6450' },
          { label:'이탈',     data:[-180,-185,-195,-190,-180], backgroundColor:'#ae3f4d' },
          { label:'순증', type:'line', data:[100,110,115,115,150],
            borderColor:'#243350', backgroundColor:'transparent', tension:0.4, pointRadius:4 },
        ],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins: basePlugins, scales: axesStyle() },
    });

    /* 4. Ops — 매장별 운영점수 가로 막대 */
    tryChart('opsChart', {
      type: 'bar',
      data: {
        labels: STORES.map(function (s) { return s.name; }),
        datasets: [{ label:'운영점수', data: STORES.map(function (s) { return s.score; }),
          backgroundColor: STORES.map(function (s) {
            return s.score >= 80 ? '#1d6450' : s.score >= 70 ? '#b87030' : '#ae3f4d'; }) }],
      },
      options: { responsive:true, maintainAspectRatio:false, indexAxis:'y',
        plugins: basePlugins, scales: axesStyle() },
    });

    /* 5. MRR Trend */
    tryChart('mrrTrendChart', {
      type: 'line',
      data: {
        labels: MONTHS,
        datasets: [{ label:'MRR (만원)', data:[1480,1550,1600,1660,1710],
          borderColor:'#8f4219', backgroundColor:'#8f421922', fill:true, tension:0.4, pointRadius:4 }],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins: basePlugins, scales: axesStyle() },
    });

    /* 6. Bridge — MRR 워터폴 */
    tryChart('bridgeChart', {
      type: 'bar',
      data: {
        labels: ['전월 MRR', '신규', '업셀', '다운셀', '이탈', '이번달 MRR'],
        datasets: [{ label:'MRR 변동 (만원)', data:[1660,130,45,-20,-105,1710],
          backgroundColor:['#6b7280','#1d6450','#243350','#b87030','#ae3f4d','#8f4219'] }],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins: basePlugins, scales: axesStyle() },
    });

    /* 7. Health — 건강도 도넛 */
    tryChart('healthChart', {
      type: 'doughnut',
      data: {
        labels: ['우수 (A)', '양호 (B)', '주의 (C)', '위험 (D)'],
        datasets: [{ data:[1,2,2,1], backgroundColor:['#1d6450','#243350','#b87030','#ae3f4d'] }],
      },
      options: { responsive:true, maintainAspectRatio:false, cutout:'62%', plugins: basePlugins },
    });

    /* 8. Mix — 플랜 구성 파이 */
    tryChart('mixChart', {
      type: 'pie',
      data: {
        labels: ['베이직', '스탠다드', '프리미엄'],
        datasets: [{ data:[2180,1420,617], backgroundColor:['#8f4219','#243350','#1d6450'] }],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins: basePlugins },
    });

    /* 9. Quarter — 분기 목표 달성률 */
    tryChart('quarterChart', {
      type: 'bar',
      data: {
        labels: ['매출', '구독자', 'NPS', '가동률', 'CS해결률'],
        datasets: [
          { label:'목표',   data:[100,100,100,100,100], backgroundColor:'#ddd6cc' },
          { label:'달성률', data:[92,88,80,85,94],      backgroundColor:'#243350' },
        ],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins: basePlugins, scales: axesStyle() },
    });

    /* 10. Scatter — 매장 포지셔닝 */
    tryChart('scatterChart', {
      type: 'scatter',
      data: {
        datasets: STORES.map(function (s, i) {
          return { label: s.name, data:[{ x: s.util, y: s.score }],
            backgroundColor: PALETTE[i], pointRadius: 9 };
        }),
      },
      options: { responsive:true, maintainAspectRatio:false, plugins: basePlugins,
        scales: {
          x: Object.assign({}, axisStyle(), { title:{ display:true, text:'가동률 (%)', color:'#666' } }),
          y: Object.assign({}, axisStyle(), { title:{ display:true, text:'운영점수',   color:'#666' } }),
        } },
    });

    /* 11. Momentum */
    tryChart('momentumChart', {
      type: 'line',
      data: {
        labels: MONTHS,
        datasets: [{ label:'모멘텀 지수', data:[68,71,73,76,78],
          borderColor:'#1d6450', backgroundColor:'#1d645022', fill:true, tension:0.4, pointRadius:4 }],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins: basePlugins, scales: axesStyle() },
    });

    /* 12. Season — 요일별 이용 패턴 */
    tryChart('seasonChart', {
      type: 'bar',
      data: {
        labels: ['월', '화', '수', '목', '금', '토', '일'],
        datasets: [{ label:'이용 건수', data:[820,880,940,910,1050,1420,1380],
          backgroundColor:['#b0a898','#b0a898','#b0a898','#b0a898','#b0a898','#8f4219','#8f4219'] }],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins: basePlugins, scales: axesStyle() },
    });
  }

  /* ── COLLAPSIBLE SECTIONS ───────────────────────────── */
  function initCollapsible() {
    document.querySelectorAll('.collapse-toggle[data-target]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = this.getAttribute('data-target');
        var wrap = document.getElementById(targetId);
        var arrow = this.querySelector('.arrow');
        var label = this.querySelector('.toggle-label');
        if (!wrap) return;
        var collapsed = wrap.style.display === 'none';
        wrap.style.display = collapsed ? '' : 'none';
        if (arrow) arrow.textContent = collapsed ? '▾' : '▸';
        if (label) label.textContent = collapsed ? '접기' : '펼치기';
      });
    });

    document.querySelectorAll('details > summary').forEach(function (sum) {
      sum.addEventListener('click', function () {
        var sp = this.querySelector('span');
        if (!sp) return;
        var open = this.closest('details').hasAttribute('open');
        sp.textContent = open ? '▶' : '▼';
      });
    });
  }

  /* ── STORE SELECT INTERACTION ───────────────────────── */
  function initStoreSelect() {
    var sel = el('storeSelect');
    if (!sel) return;
    sel.addEventListener('change', function () {
      var val = this.value;
      if (val === 'all') {
        setText('detailTitle', '전체 매장 현황');
        setText('detailSub',   '6개 직영 매장 통합 기준');
      } else {
        var s = STORES.filter(function (x) { return x.id === val; })[0];
        if (s) {
          setText('detailTitle', s.name + ' 상세');
          setText('detailSub',   '운영점수 ' + s.score + '점 · ' + s.status);
        }
      }
    });
  }

  /* ── INIT ───────────────────────────────────────────── */
  function init() {
    renderHero();
    renderStatus();
    renderGauges();
    renderActionCenter();
    renderKpiGrid();
    renderSignalGrid();
    renderInsights();
    renderStoreSelect();
    renderStoreTable();
    renderRankStrip();
    renderHeatmap();
    renderCapacity();
    renderPayment();
    renderDetailPanel();
    renderCharts();
    initCollapsible();
    initStoreSelect();
    setTimeout(dismissOverlay, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
