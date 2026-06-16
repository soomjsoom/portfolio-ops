/* =========================================================
   Autostay OPS Dashboard — Portfolio Static Demo
   Original cockpit structure reflected with de-identified sample data
   ========================================================= */
(function () {
  'use strict';

  var MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월'];
  var PALETTE = ['#243350', '#8f4219', '#1d6450', '#b87030', '#ae3f4d', '#6b7280', '#1c7070'];
  var PORTFOLIO = {
    gross: 30.1,
    grossAch: 102.9,
    net: 29.0,
    target: 29.3,
    netAch: 98.8,
    mrr: 5.3,
    mrrYoY: 15.7,
    util: 71.8,
    usage: 291458,
    churn: 14.0,
    churnCount: 7275,
    retained: 8674,
    newSubs: 8155,
    netChange: 880,
    capacityOpportunity: 12.9,
    idleCapacity: 116177,
    avgUnitPrice: 11089,
    score: 67
  };

  var STORES = [
    { id:'hanam', name:'하남', score:88, grade:'A', status:'우수',
      util:89.4, churn:8.2, rev:8.1, ach:130.6, netRev:7.9, usage:55420, refund:2.2,
      netChange:420, arpu:68200, mrr:1.12, idle:10400, opp:1.1, trend:[74,82,94,106,122,131] },
    { id:'gwangmyeong', name:'광명', score:76, grade:'B', status:'관리',
      util:74.0, churn:10.8, rev:6.2, ach:99.4, netRev:5.9, usage:42180, refund:3.5,
      netChange:210, arpu:62800, mrr:0.86, idle:23400, opp:2.6, trend:[88,91,96,98,99,99] },
    { id:'ilsan', name:'일산', score:72, grade:'B', status:'관리',
      util:68.1, churn:10.2, rev:4.8, ach:92.4, netRev:4.5, usage:35260, refund:3.0,
      netChange:168, arpu:60400, mrr:0.71, idle:31680, opp:1.9, trend:[82,84,88,90,91,92] },
    { id:'seongsu', name:'성수', score:62, grade:'C', status:'주의',
      util:62.5, churn:12.8, rev:3.9, ach:78.9, netRev:3.5, usage:30340, refund:4.9,
      netChange:54, arpu:59200, mrr:0.61, idle:38600, opp:1.5, trend:[72,76,79,77,79,79] },
    { id:'goyang', name:'고양', score:56, grade:'D', status:'위험',
      util:48.4, churn:12.1, rev:3.0, ach:72.8, netRev:2.6, usage:24200, refund:5.4,
      netChange:-38, arpu:55100, mrr:0.48, idle:50850, opp:2.0, trend:[78,73,70,68,62,73] },
    { id:'jayuro', name:'자유로', score:54, grade:'D', status:'위험',
      util:57.4, churn:19.1, rev:2.8, ach:62.8, netRev:2.3, usage:27810, refund:6.8,
      netChange:-146, arpu:52600, mrr:0.43, idle:57400, opp:2.6, trend:[68,66,65,64,63,63] },
    { id:'anseong', name:'안성', score:54, grade:'D', status:'위험',
      util:7.0, churn:7.6, rev:1.3, ach:64.6, netRev:1.2, usage:6248, refund:2.8,
      netChange:212, arpu:48700, mrr:0.32, idle:67600, opp:2.6, trend:[0,0,0,0,51,65] },
  ];

  function el(id) { return document.getElementById(id); }
  function setText(id, v) { var e = el(id); if (e) e.textContent = v; }
  function setHtml(id, v) { var e = el(id); if (e) e.innerHTML = v; }
  function fmtEok(v) { return v.toFixed(v >= 10 ? 1 : 1) + '억'; }
  function fmtPct(v) { return v.toFixed(1) + '%'; }
  function fmtNum(v) { return Math.round(v).toLocaleString('ko-KR'); }
  function signed(v, unit) { return (v >= 0 ? '+' : '') + fmtNum(v) + (unit || ''); }

  function dismissOverlay() {
    var steps = ['lstep-sheets', 'lstep-stores', 'lstep-render'];
    var bar = el('loadProgressBar');
    steps.forEach(function(id, i) {
      setTimeout(function() {
        var s = el(id); if (s) s.classList.add('active');
        if (bar) bar.style.width = [40, 75, 100][i] + '%';
        if (i === steps.length - 1) {
          setTimeout(function() {
            var ov = el('loadingOverlay');
            if (!ov) return;
            ov.style.transition = 'opacity 0.45s ease';
            ov.style.opacity = '0';
            setTimeout(function() { ov.style.display = 'none'; }, 480);
          }, 240);
        }
      }, i * 150);
    });
  }

  function drawGauge(containerId, pct, fillColor) {
    var svg = el(containerId);
    if (!svg) return;
    var cx = 100, cy = 108, r = 76, sw = 13;
    var cl = Math.min(Math.max(pct, 0.01), 0.99);
    var ang = Math.PI * (1 - cl);
    var ex = cx + r * Math.cos(ang);
    var ey = cy - r * Math.sin(ang);
    var nr = r - 10;
    var nx = cx + nr * Math.cos(ang);
    var ny = cy - nr * Math.sin(ang);
    var lg = cl > 0.5 ? 1 : 0;
    var trackD = 'M ' + (cx - r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy;
    var fillD = 'M ' + (cx - r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 ' + lg + ' 1 ' + ex + ' ' + ey;
    svg.innerHTML =
      '<path d="' + trackD + '" fill="none" stroke="#e5e0d8" stroke-width="' + sw + '" stroke-linecap="round"/>' +
      '<path d="' + fillD + '" fill="none" stroke="' + fillColor + '" stroke-width="' + sw + '" stroke-linecap="round"/>' +
      '<line x1="' + cx + '" y1="' + cy + '" x2="' + nx + '" y2="' + ny + '" stroke="#2a2a2a" stroke-width="2.5" stroke-linecap="round"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="#2a2a2a"/>';
  }

  function renderHero() {
    setText('focusLabel', '전체 합산');
    setText('focusSub', '6개월 합산 · 운영 7개 매장');
    setText('updatedAt', '🕐 조회 오후 01:49 · 방금 전');
    setText('auditBadge', '✓ 정합성 정상');
    setText('scoreBadgeVal', PORTFOLIO.score);
    setText('scoreBadgeRank', '/ 100점');

    var items = [
      { label:'총매출', value:fmtEok(PORTFOLIO.gross), delta:'총매출 달성 ' + fmtPct(PORTFOLIO.grossAch) },
      { label:'MRR', value:fmtEok(PORTFOLIO.mrr), delta:'MRR YoY +' + fmtPct(PORTFOLIO.mrrYoY) },
      { label:'가동률', value:fmtPct(PORTFOLIO.util), delta:fmtNum(PORTFOLIO.usage) + '대 사용' },
      { label:'이탈률', value:fmtPct(PORTFOLIO.churn), delta:'해지 ' + fmtNum(PORTFOLIO.churnCount) + '건' },
      { label:'순증감', value:signed(PORTFOLIO.netChange), delta:'신규 ' + fmtNum(PORTFOLIO.newSubs) + ' − 해지 ' + fmtNum(PORTFOLIO.churnCount) },
      { label:'순매출 달성률', value:fmtPct(PORTFOLIO.netAch), delta:'순매출 ' + fmtEok(PORTFOLIO.net) + ' / 목표 ' + fmtEok(PORTFOLIO.target) },
    ];
    setHtml('heroKpiStrip', items.map(function(k) {
      return '<div class="hero-kpi">' +
        '<div class="hero-kpi-label">' + k.label + '</div>' +
        '<div class="hero-kpi-val">' + k.value + '</div>' +
        '<div class="hero-kpi-delta">' + k.delta + '</div>' +
      '</div>';
    }).join(''));
  }

  function renderStatus() {
    var dot = el('statusDot');
    var txt = el('statusText');
    if (dot) dot.style.background = '#ae3f4d';
    if (txt) txt.textContent = '위험 지표 있음';
    setHtml('alertStrip',
      '<span class="alert-item alert-warn">⚠ 이탈률 14.0% — 긴급 해지 방어 캠페인 검토</span>' +
      '<span class="alert-item alert-info">ℹ 전체 7개 매장 합산 · 1월~6월</span>' +
      '<span class="alert-item alert-info">ℹ 원천 매출 6.14 · 2일 지연</span>');
    var alertEl = el('alertStrip');
    if (alertEl) alertEl.style.display = 'flex';
  }

  function renderGauges() {
    drawGauge('gsvg-ach', PORTFOLIO.netAch / 100, '#1d6450');
    drawGauge('gsvg-util', PORTFOLIO.util / 100, '#243350');
    drawGauge('gsvg-churn', 1 - (PORTFOLIO.churn / 100), '#ae3f4d');
    drawGauge('gsvg-mrr', 0.79, '#8f4219');
    setText('gval-ach', fmtPct(PORTFOLIO.netAch));
    setText('gsub-ach', '목표 ' + fmtEok(PORTFOLIO.target) + ' · 순매출 ' + fmtEok(PORTFOLIO.net) + ' ▲4.3%p MoM');
    setText('gbadge-ach', '목표 근접');
    setText('gval-util', fmtPct(PORTFOLIO.util));
    setText('gsub-util', '총사용 ' + fmtNum(PORTFOLIO.usage) + '대 · 유휴 Capacity ' + fmtNum(PORTFOLIO.idleCapacity) + '대');
    setText('gbadge-util', '▲4.9%p');
    setText('gval-churn', fmtPct(PORTFOLIO.churn));
    setText('gsub-churn', '이탈 ' + fmtNum(PORTFOLIO.churnCount) + '명 · 유지 ' + fmtNum(PORTFOLIO.retained) + '명');
    setText('gbadge-churn', '위험');
    setText('gval-mrr', '+' + fmtPct(PORTFOLIO.mrrYoY));
    setText('gsub-mrr', 'MRR ' + fmtEok(PORTFOLIO.mrr) + ' · ARPU 6.1만원');
    setText('gbadge-mrr', '고성장');
  }

  function actionItem(title, dri, deadline, kpi, done) {
    return '<div class="ac-item">' +
      '<span class="ac-item-dot warning"></span>' +
      '<div class="ac-item-text"><strong>' + title + '</strong>' +
      '<small>👤 DRI: ' + dri + '</small>' +
      '<small>📅 기한: ' + deadline + '</small>' +
      '<small>📊 KPI: ' + kpi + '</small>' +
      '<small>✅ 완료: ' + done + '</small></div></div>';
  }

  function renderActionCenter() {
    setText('acActionCount', '2');
    setHtml('acActionList',
      actionItem('이탈률 14.0% — 리텐션 캠페인 긴급 집행', '사업운영팀', '2026-06-23', '이탈률 10% 이하', '7일 내 이탈률 1%p 이상 개선 또는 전환율 8% 이상') +
      actionItem('Capacity 기회금액 상한 12.9억 — 수요 검증 후 가동률 제고 계획 수립', '사업운영팀', '2026-06-23', '가동률 65% 이상', '14일 내 주간 가동률 5%p 이상 반등 수치 확인'));

    var danger = [
      { rank:1, name:'자유로', score:54, issue:'순매출 달성률 62.8% · 이탈 19.1% · 가동 57.4%', cause:'이탈 집중관리 + 목표 큰 폭 미달', action:'CS 이슈 긴급 점검 · 해지 사유 분류', dri:'BizOps 리텐션 담당' },
      { rank:2, name:'안성', score:54, issue:'순매출 달성률 64.6% · 가동 7.0%', cause:'목표 큰 폭 미달 + 저가동', action:'가격·프로모션 긴급 검토', dri:'BizOps 영업 담당' },
      { rank:3, name:'고양', score:56, issue:'이탈 12.1% · 가동 48.4%', cause:'이탈 관리필요 + 저가동', action:'리텐션 캠페인 집행 · 해지 사유 수집', dri:'BizOps 리텐션 담당' },
    ];
    setText('acDangerCount', '3');
    setHtml('acDangerList', danger.map(function(s) {
      return '<div class="ac-danger-store">' +
        '<span class="ac-danger-rank">' + s.rank + '</span>' +
        '<div class="ac-danger-main"><strong>' + s.name + '</strong><small>' + s.issue + '</small>' +
        '<small>1차 원인: ' + s.cause + '</small><small>우선 액션: ' + s.action + '</small><small>DRI: ' + s.dri + '</small></div>' +
        '<span class="ac-danger-score">' + s.score + '점</span></div>';
    }).join(''));

    setHtml('acLossBody',
      '<div class="ac-loss-total">' + fmtEok(PORTFOLIO.capacityOpportunity) + '</div>' +
      '<div class="ac-loss-sub">운영 매장 합산 · 유휴 Capacity ' + fmtNum(PORTFOLIO.idleCapacity) + '대 · 가중 평균 단가 ' + fmtNum(PORTFOLIO.avgUnitPrice) + '원/대</div>' +
      '<div class="ac-loss-row"><span>확정월 누적</span><strong>10.8억</strong></div>' +
      '<div class="ac-loss-row"><span>MTD (14일)</span><strong>2.1억</strong></div>' +
      '<div class="ac-loss-row"><span>월말 예상</span><strong>4.4억</strong></div>' +
      '<div class="ac-loss-breakdown">' + STORES.slice().sort(function(a,b){ return b.opp - a.opp; }).map(function(s) {
        return '<div><div class="ac-loss-row"><span>' + s.name + '</span><strong>' + fmtEok(s.opp) + '</strong></div>' +
          '<div class="ac-loss-bar-wrap"><div class="ac-loss-bar" style="width:' + Math.min(100, s.opp / 2.6 * 100) + '%"></div></div></div>';
      }).join('') + '</div>');
  }

  function renderKpiGrid() {
    var kpis = [
      { label:'총매출', value:fmtEok(PORTFOLIO.gross), delta:'달성률 ' + fmtPct(PORTFOLIO.grossAch), sub:'전체 7개 매장', trend:[3.7,4.5,5.0,5.2,6.0,5.7] },
      { label:'순매출', value:fmtEok(PORTFOLIO.net), delta:'목표 근접 ' + fmtPct(PORTFOLIO.netAch), sub:'목표 ' + fmtEok(PORTFOLIO.target), trend:[3.5,4.3,4.8,5.0,5.8,5.6] },
      { label:'MRR', value:fmtEok(PORTFOLIO.mrr), delta:'YoY +' + fmtPct(PORTFOLIO.mrrYoY), sub:'월 반복 매출', trend:[4.58,4.71,4.83,4.96,5.18,5.31] },
      { label:'가동률', value:fmtPct(PORTFOLIO.util), delta:'▲4.9%p MoM', sub:'목표 75%', trend:[61,65,68,70,72,72] },
      { label:'이탈률', value:fmtPct(PORTFOLIO.churn), delta:'즉각 대응', sub:'목표 10% 이하', trend:[13.1,12.7,13.8,14.4,13.6,14.0] },
      { label:'순증감', value:signed(PORTFOLIO.netChange), delta:'신규 ' + fmtNum(PORTFOLIO.newSubs), sub:'해지 ' + fmtNum(PORTFOLIO.churnCount), trend:[80,132,188,150,210,120] },
    ];
    setHtml('kpiGrid', kpis.map(function(k, i) {
      var max = Math.max.apply(null, k.trend);
      var min = Math.min.apply(null, k.trend);
      var pts = k.trend.map(function(v, j) {
        return (j * 12) + ',' + (22 - ((v - min) / (max - min || 1)) * 18);
      }).join(' ');
      return '<div class="kpi ' + ['accent','green','navy','amber','rose','teal'][i] + '">' +
        '<div class="kpi-label">' + k.label + '</div>' +
        '<div class="kpi-main"><div class="kpi-value">' + k.value + '</div>' +
        '<svg class="kpi-spark" viewBox="0 0 62 26" preserveAspectRatio="none" width="62" height="26"><polyline points="' + pts + '" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></div>' +
        '<div class="kpi-row"><span class="kpi-delta up">' + k.delta + '</span></div>' +
        '<div class="kpi-sub">' + k.sub + '</div></div>';
    }).join(''));
  }

  function renderSignalGrid() {
    var signals = [
      { label:'목표 근접', value:'순매출 달성률 98.8%', change:'3399.6만원 미달', level:'warn' },
      { label:'이탈 위험', value:'이탈률 14.0%', change:'즉각 대응', level:'bad' },
      { label:'가동 양호', value:'운영 가동률 71.8%', change:'목표 75%까지 3.2%p', level:'ok' },
      { label:'MRR 고성장', value:'YoY +15.7%', change:'5.3억', level:'ok' },
    ];
    setHtml('signalGrid', signals.map(function(s) {
      return '<div class="signal ' + s.level + '"><div class="signal-dot"></div><div class="signal-text"><strong>' + s.label + '</strong><span>' + s.value + ' — ' + s.change + '</span></div></div>';
    }).join(''));
  }

  function renderInsights() {
    setText('headline', '[1월~6월 기준] 7개 직영점 합산: 순매출 29.0억 / 총매출 30.1억 (순매출 목표 근접 98.8%) · 운영 가동률 71.8% · 이탈률 14.0% · MRR 5.3억 성장 중. 합산 최고 매출: 하남 8.1억.');
    setHtml('riskList',
      '<div class="risk-item"><div class="risk-dot critical"></div><span><strong>이탈률 심각 (14.0%)</strong><br>MRR 직접 손실 · 구독 기반 잠식 위험<br>담당: 사업운영팀 · 마케팅팀<br>→ 해지 방어 캠페인 즉시 실행 + 해지 원인 인터뷰 착수</span></div>' +
      '<div class="risk-item"><div class="risk-dot warning"></div><span><strong>자유로·안성·고양 우선 점검</strong><br>목표 미달, 저가동, 이탈 리스크가 중첩된 매장입니다.</span></div>');
    setHtml('auditList',
      '<div class="audit-item"><span class="audit-ok">✓</span> 모든 핵심 수치가 정상 범위로 렌더링되었습니다.</div>' +
      '<div class="audit-item"><span class="audit-ok">✓</span> 매출·구독·가동률·환불율·이탈률 지표가 동일 기간 기준으로 정렬되었습니다.</div>' +
      '<div class="audit-item"><span class="audit-ok">✓</span> 원본 구조 반영, 포트폴리오용 민감 정보 비식별 처리.</div>');
  }

  function renderStoreSelect() {
    setHtml('storeSelect', '<option value="all">전체 (7개 매장 합산)</option>' + STORES.map(function(s) {
      return '<option value="' + s.id + '">' + s.name + '</option>';
    }).join(''));
  }

  function storeStatusClass(status) {
    return status === '우수' ? 'verdict-chip good' : status === '관리' ? 'verdict-chip warn' : 'verdict-chip bad';
  }

  function renderStoreTable() {
    setHtml('storeTableBody', STORES.map(function(s) {
      var achClass = s.ach >= 95 ? 'ach-cell-good' : s.ach >= 75 ? 'ach-cell-warn' : 'ach-cell-bad';
      return '<tr data-store="' + s.id + '">' +
        '<td><strong>' + s.name + '</strong></td>' +
        '<td>' + fmtEok(s.rev) + '</td>' +
        '<td><span class="' + achClass + '">' + fmtPct(s.ach) + '</span></td>' +
        '<td>' + fmtEok(s.netRev) + '</td>' +
        '<td>' + fmtNum(s.usage) + '건</td>' +
        '<td>' + fmtPct(s.util) + '</td>' +
        '<td>' + fmtPct(s.refund) + '</td>' +
        '<td style="color:' + (s.netChange >= 0 ? '#1d6450' : '#ae3f4d') + ';font-weight:700">' + signed(s.netChange, '명') + '</td>' +
        '<td>₩' + fmtNum(s.arpu) + '</td>' +
        '<td><span class="' + storeStatusClass(s.status) + '">' + s.status + '</span></td></tr>';
    }).join(''));
  }

  function renderRankStrip() {
    var sorted = STORES.slice().sort(function(a, b) { return b.rev - a.rev; });
    var maxRev = sorted[0].rev;
    setHtml('rankStrip', sorted.map(function(s, i) {
      var color = s.ach >= 95 ? '#1d6450' : s.ach >= 75 ? '#b87030' : '#ae3f4d';
      return '<div class="rank-row" data-store="' + s.id + '">' +
        '<span class="' + (i < 3 ? 'rank-num top' : 'rank-num') + '">' + (i + 1) + '</span>' +
        '<span class="rank-name">' + s.name + '</span>' +
        '<div class="rank-bar-wrap"><div class="rank-bar" style="width:' + Math.round(s.rev / maxRev * 100) + '%;background:' + color + '"></div></div>' +
        '<span class="rank-val">' + fmtEok(s.rev) + '</span>' +
        '<span class="rank-ach">' + fmtPct(s.ach) + '</span></div>';
    }).join(''));
  }

  function renderHeatmap() {
    var metrics = [
      { key:'score', label:'점수', fmt:function(v){ return v + '점'; } },
      { key:'ach', label:'달성률', fmt:fmtPct },
      { key:'util', label:'가동률', fmt:fmtPct },
      { key:'churn', label:'이탈률', fmt:fmtPct, invert:true },
      { key:'refund', label:'환불율', fmt:fmtPct, invert:true },
      { key:'netChange', label:'순증감', fmt:function(v){ return signed(v); } },
      { key:'arpu', label:'ARPU', fmt:function(v){ return Math.round(v / 1000) + 'k'; } },
      { key:'mrr', label:'MRR', fmt:function(v){ return fmtEok(v); } },
    ];
    function color(v, values, invert) {
      var min = Math.min.apply(null, values);
      var max = Math.max.apply(null, values);
      var norm = (v - min) / (max - min || 1);
      if (invert) norm = 1 - norm;
      if (norm >= 0.68) return '#1d6450';
      if (norm >= 0.38) return '#b87030';
      return '#ae3f4d';
    }
    var head = '<div class="hm-head-row"><div></div>' + metrics.map(function(m) {
      return '<div class="hm-head-cell">' + m.label + '</div>';
    }).join('') + '</div>';
    var rows = STORES.map(function(s) {
      return '<div class="hm-data-row" data-store="' + s.id + '"><div class="hm-label-cell">' + s.name + '</div>' +
        metrics.map(function(m) {
          var values = STORES.map(function(x) { return x[m.key]; });
          return '<div class="hm-cell" style="background:' + color(s[m.key], values, m.invert) + ';color:#fff"><span class="hm-cell-top">' + m.fmt(s[m.key]) + '</span></div>';
        }).join('') + '</div>';
    }).join('');
  setHtml('heatmapGrid', '<div class="hm-scroll-inner">' + head + rows + '</div>');
}

  function renderCapacity() {
    var avgUtil = PORTFOLIO.util;
    var totalLoss = PORTFOLIO.capacityOpportunity;
    var summary = '<div class="cap-summary">' +
      '<div class="cap-sum-item"><div class="cap-sum-label">평균 가동률</div><div class="cap-sum-val">' + fmtPct(avgUtil) + '</div></div>' +
      '<div class="cap-sum-item"><div class="cap-sum-label">연평균 기준 대수/월</div><div class="cap-sum-val">45,741</div></div>' +
      '<div class="cap-sum-item"><div class="cap-sum-label">유휴 Capacity</div><div class="cap-sum-val bad">' + fmtNum(PORTFOLIO.idleCapacity) + '</div></div>' +
      '<div class="cap-sum-item"><div class="cap-sum-label">기회금액 상한</div><div class="cap-sum-val bad">' + fmtEok(totalLoss) + '</div></div>' +
      '<div class="cap-sum-item"><div class="cap-sum-label">운영 매장</div><div class="cap-sum-val">' + STORES.length + '</div></div>' +
    '</div>';
    var grid = '<div class="cap-store-grid">' + STORES.map(function(s) {
      var color = s.util >= 75 ? '#1d6450' : s.util >= 55 ? '#b87030' : '#ae3f4d';
      return '<div class="cap-store-card"><div class="cap-store-head"><span class="cap-store-name">' + s.name + '</span>' +
        '<span class="cap-store-util" style="color:' + color + '">' + fmtPct(s.util) + '</span></div>' +
        '<div class="cap-bar-wrap"><div class="cap-bar" style="width:' + Math.min(100, s.util) + '%;background:' + color + '"></div></div>' +
        '<div class="cap-store-meta"><span>유휴 Capacity</span><span>' + fmtNum(s.idle) + '대</span></div>' +
        '<div class="cap-idle">기회금액 상한: ' + fmtEok(s.opp) + '</div></div>';
    }).join('') + '</div>';
    setHtml('capacityPanel', summary + grid);
  }

  function renderPayment() {
    setHtml('paymentPanel',
      '<div class="pay-item accent"><div class="pay-label">건당 총매출</div><div class="pay-val">₩10,342</div><div class="pay-note">총매출 / 총사용</div></div>' +
      '<div class="pay-item navy"><div class="pay-label">건당 순매출</div><div class="pay-val">₩9,934</div><div class="pay-note">환불·할인 반영 후</div></div>' +
      '<div class="pay-item green"><div class="pay-label">구독 ARPU</div><div class="pay-val">₩61,200</div><div class="pay-note">월말 유지 구독자 기준</div></div>' +
      '<div class="pay-item amber"><div class="pay-label">기회 단가</div><div class="pay-val">₩11,089</div><div class="pay-note">Capacity 손실 산정 기준</div></div>');
  }

  function renderDetailPanel(store) {
    var s = store || STORES[0];
    setText('detailTitle', s.name + ' 상세');
    setText('detailSub', '운영점수 ' + s.score + '점 · ' + s.status + ' · 순매출 달성률 ' + fmtPct(s.ach));
    var detail = [
      { label:'총매출', val:fmtEok(s.rev), sub:'기간 합산', delta:'달성률 ' + fmtPct(s.ach), trend:s.ach >= 95 ? 'up' : 'down' },
      { label:'순매출', val:fmtEok(s.netRev), sub:'환불·할인 반영', delta:'환불율 ' + fmtPct(s.refund), trend:s.refund <= 4 ? 'up' : 'down' },
      { label:'가동률', val:fmtPct(s.util), sub:'보정 Capacity 기준', delta:'유휴 ' + fmtNum(s.idle) + '대', trend:s.util >= 65 ? 'up' : 'down' },
      { label:'이탈률', val:fmtPct(s.churn), sub:'목표 10% 이하', delta:s.churn > 12 ? '긴급 관리' : '관리 가능', trend:s.churn > 12 ? 'down' : 'up' },
      { label:'MRR', val:fmtEok(s.mrr), sub:'월 반복 매출', delta:'ARPU ₩' + fmtNum(s.arpu), trend:'up' },
      { label:'순증감', val:signed(s.netChange, '명'), sub:'신규−해지', delta:s.netChange >= 0 ? '순증' : '순감', trend:s.netChange >= 0 ? 'up' : 'down' },
    ];
    setHtml('detailGrid', detail.map(function(d) {
      return '<div class="d-item"><div class="d-label">' + d.label + '</div><div class="d-val">' + d.val + '</div><div class="d-sub">' + d.sub + '</div><div class="d-trend ' + d.trend + '">' + d.delta + '</div></div>';
    }).join(''));
    setHtml('subPipeline',
      '<div class="pipe-row"><div class="pipe-label">월말 유지</div><div class="pipe-bar-wrap"><div class="pipe-bar" style="width:82%;background:#1d6450"></div><span class="pipe-val">' + fmtNum(PORTFOLIO.retained) + '명</span></div><div class="pipe-footer">전체 포트폴리오 기준</div></div>' +
      '<div class="pipe-row"><div class="pipe-label">신규</div><div class="pipe-bar-wrap"><div class="pipe-bar" style="width:76%;background:#243350"></div><span class="pipe-val">+' + fmtNum(PORTFOLIO.newSubs) + '명</span></div><div class="pipe-footer">6개월 합산 신규</div></div>' +
      '<div class="pipe-row"><div class="pipe-label">해지</div><div class="pipe-bar-wrap"><div class="pipe-bar" style="width:68%;background:#ae3f4d"></div><span class="pipe-val">-' + fmtNum(PORTFOLIO.churnCount) + '명</span></div><div class="pipe-footer">해지 방어 필요</div></div>' +
      '<div class="pipe-row"><div class="pipe-label">순증</div><div class="pipe-bar-wrap"><div class="pipe-bar" style="width:40%;background:#8f4219"></div><span class="pipe-val">+' + fmtNum(PORTFOLIO.netChange) + '명</span></div><div class="pipe-footer">신규 대비 순증 효율 점검</div></div>');
  }

  function axisStyle() {
    return { ticks: { color: '#777', font: { size: 10 } }, grid: { color: '#ece6de' } };
  }
  function axesStyle() { return { x: axisStyle(), y: axisStyle() }; }
  var basePlugins = { legend: { labels: { color: '#3a3028', font: { size: 11 }, boxWidth: 12 } }, datalabels: { display: false } };
  function tryChart(id, config) {
    var canvas = el(id);
    if (!canvas || !window.Chart) return;
    try { new Chart(canvas.getContext('2d'), config); }
    catch (e) { console.warn('Chart skipped:', id, e.message); }
  }

  function renderMiniDetails() {
    setHtml('opsUtilDetail', '<div class="ops-mini-kv"><strong>운영 가동률 ' + fmtPct(PORTFOLIO.util) + '</strong><span>목표 75%까지 3.2%p, 유휴 Capacity ' + fmtNum(PORTFOLIO.idleCapacity) + '대</span></div>');
    setHtml('opsChurnDetail', '<div class="ops-mini-kv"><strong>이탈률 ' + fmtPct(PORTFOLIO.churn) + ' · 환불율 3.7%</strong><span>해지 방어 캠페인과 환불 원인 분류를 동시에 진행</span></div>');
    setHtml('opsArpuDetail', '<div class="ops-mini-kv"><strong>ARPU 6.1만원 · 쿠폰할인율 5.1%</strong><span>상품 믹스와 할인 정책을 순매출 관점으로 재점검</span></div>');
  }

  function renderCharts() {
    tryChart('performanceChart', {
      type:'line',
      data:{ labels:MONTHS, datasets:[
        { label:'목표매출', data:[4.1,4.4,4.8,5.0,5.5,5.5], borderColor:'#b0a898', borderDash:[4,4], backgroundColor:'transparent', tension:.35 },
        { label:'총매출', data:[3.9,4.7,5.1,5.3,6.0,5.1], borderColor:'#243350', backgroundColor:'#24335022', tension:.35, pointRadius:3 },
        { label:'순매출', data:[3.7,4.5,4.9,5.1,5.8,5.0], borderColor:'#1d6450', backgroundColor:'#1d645022', tension:.35, pointRadius:3 },
        { label:'MRR', data:[4.6,4.7,4.8,5.0,5.2,5.3], borderColor:'#8f4219', backgroundColor:'#8f421922', tension:.35, pointRadius:3 },
      ]},
      options:{ responsive:true, maintainAspectRatio:false, plugins:basePlugins, scales:axesStyle() }
    });

    tryChart('scoreChart', {
      type:'radar',
      data:{ labels:['순매출 달성','가동률','이탈관리','환불관리','MRR 성장','순증감'], datasets:[
        { label:'전체 평균', data:[99,72,60,82,86,68], borderColor:'#243350', backgroundColor:'#24335022', pointRadius:3 },
        { label:'하남', data:[100,89,82,92,91,80], borderColor:'#1d6450', backgroundColor:'#1d645020', pointRadius:2 },
      ]},
      options:{ responsive:true, maintainAspectRatio:false, plugins:basePlugins, scales:{ r:{ ticks:{ color:'#888', backdropColor:'transparent' }, grid:{ color:'#e0d8cc' }, pointLabels:{ color:'#555', font:{ size:10 } } } } }
    });

    tryChart('subscriptionChart', {
      type:'bar',
      data:{ labels:MONTHS, datasets:[
        { label:'유지', data:[7610,7800,8010,8220,8520,8674], backgroundColor:'#243350' },
        { label:'신규', data:[1080,1240,1390,1420,1540,1485], backgroundColor:'#1d6450' },
        { label:'해지', data:[-970,-1050,-1210,-1270,-1330,-1445], backgroundColor:'#ae3f4d' },
        { label:'순증감', type:'line', data:[110,190,180,150,210,40], borderColor:'#8f4219', backgroundColor:'transparent', tension:.35, pointRadius:4 },
      ]},
      options:{ responsive:true, maintainAspectRatio:false, plugins:basePlugins, scales:axesStyle() }
    });

    tryChart('opsUtilChart', {
      type:'line',
      data:{ labels:MONTHS, datasets:[
        { label:'가동률', data:[61.2,64.8,68.4,70.1,72.4,71.8], borderColor:'#243350', backgroundColor:'#24335022', fill:true, tension:.35 },
        { label:'목표 75%', data:[75,75,75,75,75,75], borderColor:'#b87030', borderDash:[5,5], pointRadius:0 },
      ]},
      options:{ responsive:true, maintainAspectRatio:false, plugins:basePlugins, scales:axesStyle() }
    });
    tryChart('opsChurnChart', {
      type:'line',
      data:{ labels:MONTHS, datasets:[
        { label:'이탈률', data:[13.1,12.7,13.8,14.4,13.6,14.0], borderColor:'#ae3f4d', backgroundColor:'#ae3f4d22', tension:.35 },
        { label:'환불율', data:[4.8,4.3,3.9,3.6,3.4,3.7], borderColor:'#b87030', backgroundColor:'#b8703022', tension:.35 },
      ]},
      options:{ responsive:true, maintainAspectRatio:false, plugins:basePlugins, scales:axesStyle() }
    });
    tryChart('opsArpuChart', {
      type:'bar',
      data:{ labels:MONTHS, datasets:[
        { label:'ARPU(만원)', data:[5.7,5.8,5.9,6.0,6.1,6.1], backgroundColor:'#1d6450' },
        { label:'쿠폰할인율(%)', type:'line', data:[6.8,6.1,5.7,5.4,5.0,5.1], borderColor:'#8f4219', backgroundColor:'transparent', tension:.35 },
      ]},
      options:{ responsive:true, maintainAspectRatio:false, plugins:basePlugins, scales:axesStyle() }
    });

    tryChart('mrrTrendChart', { type:'line', data:{ labels:MONTHS, datasets:[{ label:'MRR(억)', data:[4.6,4.7,4.8,5.0,5.2,5.3], borderColor:'#8f4219', backgroundColor:'#8f421922', fill:true, tension:.35 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:basePlugins, scales:axesStyle() } });
    tryChart('bridgeChart', { type:'bar', data:{ labels:['정가 추정','쿠폰할인','총매출','환불','순매출'], datasets:[{ label:'매출 브리지(억)', data:[32.6,-1.7,30.1,-1.1,29.0], backgroundColor:['#243350','#b87030','#1d6450','#ae3f4d','#8f4219'] }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:basePlugins, scales:axesStyle() } });
    tryChart('healthChart', { type:'doughnut', data:{ labels:['우수','관리','주의','위험'], datasets:[{ data:[1,2,1,3], backgroundColor:['#1d6450','#243350','#b87030','#ae3f4d'] }] }, options:{ responsive:true, maintainAspectRatio:false, cutout:'62%', plugins:basePlugins } });
    tryChart('mixChart', { type:'pie', data:{ labels:['순매출','쿠폰할인','환불','기타'], datasets:[{ data:[29.0,1.7,1.1,.8], backgroundColor:['#1d6450','#b87030','#ae3f4d','#6b7280'] }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:basePlugins } });
    tryChart('quarterChart', { type:'bar', data:{ labels:['Q1','Q2'], datasets:[{ label:'목표', data:[13.3,16.0], backgroundColor:'#ddd6cc' }, { label:'순매출', data:[13.1,15.9], backgroundColor:'#243350' }, { label:'순증감', type:'line', data:[480,400], borderColor:'#8f4219', yAxisID:'y1' }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:basePlugins, scales:{ y:axisStyle(), y1:Object.assign({}, axisStyle(), { position:'right', grid:{ drawOnChartArea:false } }), x:axisStyle() } } });
    tryChart('scatterChart', { type:'bubble', data:{ datasets:STORES.map(function(s, i){ return { label:s.name, data:[{ x:s.ach, y:s.churn, r:Math.max(6, s.rev * 1.6) }], backgroundColor:PALETTE[i] + 'bb' }; }) }, options:{ responsive:true, maintainAspectRatio:false, plugins:basePlugins, scales:{ x:Object.assign({}, axisStyle(), { title:{ display:true, text:'순매출 달성률(%)', color:'#666' } }), y:Object.assign({}, axisStyle(), { title:{ display:true, text:'이탈률(%)', color:'#666' } }) } } });
    tryChart('momentumChart', { type:'line', data:{ labels:MONTHS, datasets:[{ label:'총매출 YoY', data:[4.8,7.2,9.1,11.4,14.8,15.7], borderColor:'#243350', backgroundColor:'transparent', tension:.35 }, { label:'가동률 YoY', data:[1.4,2.0,3.1,4.2,4.8,4.9], borderColor:'#1d6450', backgroundColor:'transparent', tension:.35 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:basePlugins, scales:axesStyle() } });
    tryChart('seasonChart', { type:'bar', data:{ labels:MONTHS, datasets:[{ label:'세차 대수', data:[39210,42480,45410,47520,49230,47608], backgroundColor:'#8f4219' }, { label:'계절 지수', type:'line', data:[.86,.93,.99,1.04,1.08,1.04], borderColor:'#243350', yAxisID:'y1', tension:.35 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:basePlugins, scales:{ y:axisStyle(), y1:Object.assign({}, axisStyle(), { position:'right', grid:{ drawOnChartArea:false } }), x:axisStyle() } } });
    renderMiniDetails();
  }

  function initCollapsible() {
    document.querySelectorAll('.collapse-toggle[data-target]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var wrap = document.getElementById(this.getAttribute('data-target'));
        var arrow = this.querySelector('.arrow');
        var label = this.querySelector('.toggle-label');
        if (!wrap) return;
        var collapsed = wrap.style.display === 'none';
        wrap.style.display = collapsed ? '' : 'none';
        if (arrow) arrow.textContent = collapsed ? '▾' : '▸';
        if (label) label.textContent = collapsed ? '상세' : '펼치기';
      });
    });
    document.querySelectorAll('details > summary').forEach(function(sum) {
      sum.addEventListener('click', function() {
        var sp = this.querySelector('span');
        if (sp) sp.textContent = this.closest('details').hasAttribute('open') ? '▶' : '▼';
      });
    });
  }

  function selectStore(id) {
    var store = STORES.filter(function(s) { return s.id === id; })[0];
    if (!store) {
      setText('focusLabel', '전체 합산');
      setText('focusSub', '6개월 합산 · 운영 7개 매장');
      renderDetailPanel(STORES[0]);
      return;
    }
    setText('focusLabel', store.name);
    setText('focusSub', '운영점수 ' + store.score + '점 · ' + store.status);
    setText('scoreBadgeVal', store.score);
    renderDetailPanel(store);
  }

  function initInteractions() {
    var sel = el('storeSelect');
    if (sel) sel.addEventListener('change', function() { selectStore(this.value); });
    document.querySelectorAll('[data-store]').forEach(function(node) {
      node.addEventListener('click', function() {
        var id = this.getAttribute('data-store');
        if (sel) sel.value = id;
        selectStore(id);
      });
    });
    var refresh = el('refreshBtn');
    if (refresh) refresh.addEventListener('click', function() {
      refresh.textContent = '✓ 최신 샘플 반영';
      setTimeout(function() { refresh.textContent = '↻ 새로고침'; }, 1100);
    });
  }

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
    renderDetailPanel(STORES[0]);
    renderCharts();
    initCollapsible();
    initInteractions();
    setTimeout(dismissOverlay, 420);
    setTimeout(function() {
      var ov = el('loadingOverlay');
      if (ov) ov.style.display = 'none';
    }, 1800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
