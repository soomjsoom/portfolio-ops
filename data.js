/* Synthetic fixture only. No production records or source connections. */
(function () {
  'use strict';
  const names = Array.from({ length: 7 }, (_, i) => String.fromCharCode(65 + i) + '지점');
  const keys = names.map((_, i) => 'demo-' + String.fromCharCode(97 + i));
  const capacities = [10800, 13200, 7200, 12000, 15600, 8400, 14400];
  const season = [1.08, 1.16, 1.2, 1.12, 1.04, 1.01, .94, .89, .81, .83, .93, 1.05];
  const baseUsage = [6900, 8800, 4100, 7600, 9000, 5300, 0];
  const history = Object.fromEntries(names.map((name, i) => [name,
    Object.fromEntries(season.map((factor, m) => [m + 1, Math.round(baseUsage[i] * factor)]))]));
  const seasonMonthly = Object.fromEntries(season.map((_, m) => [m + 1, names.reduce((s, name) => s + history[name][m + 1], 0)]));
  const seasonBase = Object.values(seasonMonthly).reduce((a, b) => a + b, 0) / 12;
  const seasonIndex = Object.fromEntries(Object.entries(seasonMonthly).map(([m, usage]) => [m, usage / seasonBase]));
  function model(specs, today) {
    const stores = names.map((name, i) => {
      let retained = 780 + i * 140;
      const months = specs.map(spec => {
        const n = spec.num;
        const days = new Date(today.year, n, 0).getDate();
        const elapsed = n === today.month ? Math.max(1, today.day - 1) : days;
        const factor = elapsed / days;
        const operating = i !== 6 || n >= 5;
        const capacity = operating ? capacities[i] : 0;
        const mtdCapacity = capacity * factor;
        const utilization = operating ? 48 + i * 3 + Math.sin(n + i) * 14 : 0;
        const usage = Math.round(mtdCapacity * utilization / 100);
        const gross = usage * (11200 + i * 370);
        const refundAmount = Math.round(gross * (.021 + i * .004));
        const net = gross - refundAmount;
        const targetFull = Math.round(capacity * .66 * (11500 + i * 360));
        const target = Math.round(targetFull * factor);
        const previousRetained = retained;
        const opening = i === 6 && n === 5;
        const newSubs = operating ? Math.round((opening ? 860 : 130 + i * 17 + n * 4) * factor) : 0;
        const cancelSubs = operating ? Math.round((opening ? 8 : 60 + i * 14 + (n % 3) * 8) * factor) : 0;
        retained = operating ? previousRetained + newSubs - cancelSubs : 0;
        const retainedExposure = operating ? Math.round((previousRetained + retained) / 2 * factor) : 0;
        const mrr = retained * (37900 + i * 700);
        const grossPrev = i === 6 ? 0 : Math.round(gross / (1.08 + i * .015));
        const netPrev = Math.round(grossPrev * .965);
        const mrrPrev = i === 6 ? 0 : Math.round(mrr / 1.14);
        const sourceDate = `${today.year}-${String(n).padStart(2, '0')}-${String(elapsed).padStart(2, '0')}`;
        const storePassRevenue = retainedExposure * (40500 + i * 610);
        const discountAmount = Math.round(gross * (.008 + i * .001));
        return {
          month: spec.month, monthNum: n, quarter: spec.quarter,
          status: n === today.month ? 'mtd' : 'confirmed',
          target, targetFull, gross, grossPrev, net, netPrev,
          hasGrossYoY: grossPrev > 0, grossYoY: grossPrev ? (gross / grossPrev - 1) * 100 : 0,
          hasNetYoY: netPrev > 0, netYoY: netPrev ? (net / netPrev - 1) * 100 : 0,
          achievement: target ? net / target * 100 : 0,
          grossAchievement: target ? gross / target * 100 : 0,
          refundAmount, refundRate: gross ? refundAmount / gross * 100 : 0,
          usage, observedUsage: usage, usageMissingDays: 0, capacity, mtdCapacity,
          utilization: capacity ? usage / mtdCapacity * 100 : 0,
          utilizationRaw: capacity ? usage / mtdCapacity * 100 : 0,
          retained, retainedPrev: Math.round(retained / 1.12), retainedExposure,
          newSubs, cancelSubs, netAdds: newSubs - cancelSubs,
          churn: retainedExposure ? cancelSubs / retainedExposure * 100 : 0,
          mrr, mrrPrev, hasMrrYoY: mrrPrev > 0, mrrYoY: mrrPrev ? (mrr / mrrPrev - 1) * 100 : 0,
          arr: mrr * 12, arrPrev: mrrPrev * 12, arrYoY: 14,
          ltv: cancelSubs ? mrr / cancelSubs : 0, storePassRevenue,
          arpu: retainedExposure ? storePassRevenue / retainedExposure : 0,
          arpuBasis: 'store_pass_sales_exposure',
          hasSalesData: true, hasUsageData: true, hasSubscriptionData: true,
          hasArpuData: true, hasArpwData: true, salesComparable: true, usageComparable: true,
          salesSourceDate: sourceDate, usageSourceDate: sourceDate, subscriptionSourceDate: sourceDate,
          elapsedDays: elapsed, daysInSourceMonth: days,
          discountAmount, discountShare: gross ? discountAmount / gross * 100 : 0,
          hasDiscountData: true, listPriceRevenue: gross + discountAmount,
          contributionRevenue: gross + Math.round(gross * .13),
          observedContributionRevenue: gross + Math.round(gross * .13),
          allPassAttributedRevenue: Math.round(gross * .13),
          observedAllPassAttributedRevenue: Math.round(gross * .13),
          seasonBase: history[name][n] * factor, seasonIdx: seasonIndex[n], source: 'synthetic'
        };
      });
      return { name, id: keys[i], months };
    });
    return stores;
  }
  window.PortfolioDemo = {
    names, keys, capacities, history, model,
    seasonMonthly, seasonIndex, seasonBase,
    annual: Object.fromEntries(names.map(name => [name, Object.values(history[name]).reduce((s, n) => s + n, 0)]))
  };
})();
