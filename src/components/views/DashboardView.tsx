import { Invoice } from '../../types';
import { Plus, CheckCircle, Clock, FileText, ChevronRight, DollarSign, ArrowUpRight, TrendingUp, Sparkles, Activity, History } from 'lucide-react';
import { getThemeColors, ColorThemeName } from '../../utils/theme';

interface DashboardViewProps {
  invoices: Invoice[];
  onCreateNew: () => void;
  onEdit: (invoiceId: string) => void;
  onViewAll: () => void;
  colorTheme?: ColorThemeName;
  defaultCurrency?: string;
}

export default function DashboardView({ invoices, onCreateNew, onEdit, onViewAll, colorTheme, defaultCurrency }: DashboardViewProps) {
  const colors = getThemeColors(colorTheme);
  const currencySymbol = defaultCurrency || '₹';

  // Safe math calculations
  const totalBilled = invoices
    .filter(inv => !inv.isDraft)
    .reduce((sum, inv) => sum + inv.grandTotal, 0);

  const totalPaid = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.grandTotal, 0);

  const totalPending = invoices
    .filter(inv => inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.grandTotal, 0);

  const draftCount = invoices.filter(inv => inv.isDraft).length;
  const recentInvoices = [...invoices].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  // SVG Chart data points helper
  // Draw an interactive monthly billing chart depending on actual invoice history
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();
  
  // Distribute invoice totals into their respective months
  const monthlyTotals = Array(12).fill(0);
  invoices.forEach(inv => {
    if (inv.isDraft) return;
    const invDate = new Date(inv.issueDate);
    if (!isNaN(invDate.getTime())) {
      const monthIdx = invDate.getMonth();
      monthlyTotals[monthIdx] += inv.grandTotal;
    }
  });

  // If no historical data displays anything, let's pre-populate some beautiful guidelines
  const activeMonths = months.slice(Math.max(0, currentMonthIdx - 5), currentMonthIdx + 1);
  const activeTotals = monthlyTotals.slice(Math.max(0, currentMonthIdx - 5), currentMonthIdx + 1);
  
  // No fake hardcoded default values
  const chartData = activeMonths.map((m, idx) => ({
    label: m,
    value: activeTotals[idx] || 0
  }));

  const maxVal = Math.max(...chartData.map(d => d.value), 1000);

  return (
    <div className="space-y-3 animate-fade-in pb-4 animate-fade-in">
      {/* Welcome header section */}
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200/10 dark:border-neutral-800/40 pb-2.5 pt-0.5 animate-fade-in">
        <div>
          <h1 className="text-base sm:text-lg font-black text-neutral-900 dark:text-neutral-50 tracking-tight flex items-center gap-1.5">
            <span>Free Online Invoice Generator</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </h1>
          <p className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-300 font-medium">
            Pro billing engine is live. Tap key cards to launch interactive editors.
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${colors.primary} ${colors.primaryHover} active:scale-[0.98] text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer transition-all self-start sm:self-auto`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Metrics Grid -- Compact 2x2 on mobile, 4x1 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 animate-fade-in">
        {/* Metric 1 - Purple for Invoiced */}
        <div 
          onClick={() => {
            const el = document.getElementById('recent-activities-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="cursor-pointer bg-white/60 dark:bg-neutral-900/40 border border-neutral-200/30 dark:border-neutral-800/40 backdrop-blur-md rounded-xl p-2.5 relative overflow-hidden flex flex-col justify-between group hover:border-purple-500/30 transition-all shadow-sm"
        >
          <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500/5 rounded-full blur-lg pointer-events-none group-hover:bg-purple-500/10 transition-all" />
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">Invoiced</span>
            <div className="p-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
              <DollarSign className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-1">
            <h3 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white font-mono tracking-tight leading-none">
              {currencySymbol}{totalBilled.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h3>
            <span className="text-[8px] text-neutral-500 dark:text-neutral-450 font-medium truncate">Cumulative</span>
          </div>
        </div>

        {/* Metric 2 - Green for Settled */}
        <div 
          onClick={() => {
            const el = document.getElementById('recent-activities-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="cursor-pointer bg-white/60 dark:bg-neutral-900/40 border border-neutral-200/30 dark:border-neutral-800/40 backdrop-blur-md rounded-xl p-2.5 relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/30 transition-all shadow-sm"
        >
          <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-full blur-lg pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">Settled</span>
            <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <CheckCircle className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-1">
            <h3 className="text-sm sm:text-base font-black text-emerald-605 dark:text-emerald-400 font-mono tracking-tight leading-none">
              {currencySymbol}{totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h3>
            <span className="text-[8px] text-neutral-500 dark:text-neutral-450 font-medium truncate">Settled</span>
          </div>
        </div>

        {/* Metric 3 - Amber for Awaiting Pending */}
        <div 
          onClick={() => {
            const el = document.getElementById('awaiting-settlement-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="cursor-pointer bg-white/60 dark:bg-neutral-900/40 border border-neutral-200/30 dark:border-neutral-800/40 backdrop-blur-md rounded-xl p-2.5 relative overflow-hidden flex flex-col justify-between group hover:border-amber-500/30 transition-all shadow-sm"
        >
          <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/5 rounded-full blur-lg pointer-events-none group-hover:bg-amber-500/10 transition-all" />
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">Pending</span>
            <div className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
              <Clock className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-1">
            <h3 className="text-sm sm:text-base font-black text-amber-605 dark:text-amber-400 font-mono tracking-tight leading-none">
              {currencySymbol}{totalPending.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h3>
            <span className="text-[8px] text-neutral-500 dark:text-neutral-455 font-medium truncate">Outstanding</span>
          </div>
        </div>

        {/* Metric 4 - Blue/Sky for Drafts */}
        <div 
          onClick={() => {
            const el = document.getElementById('recent-activities-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="cursor-pointer bg-white/60 dark:bg-neutral-900/40 border border-neutral-200/30 dark:border-neutral-800/40 backdrop-blur-md rounded-xl p-2.5 relative overflow-hidden flex flex-col justify-between group hover:border-blue-500/30 transition-all shadow-sm"
        >
          <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 rounded-full blur-lg pointer-events-none group-hover:bg-blue-500/10 transition-all" />
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">Drafts</span>
            <div className="p-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
              <FileText className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-1">
            <h3 className="text-sm sm:text-base font-black text-blue-605 dark:text-blue-400 font-mono tracking-tight leading-none">
              {draftCount}
            </h3>
            <span className="text-[8px] text-neutral-500 dark:text-neutral-455 font-medium truncate">Saved draft</span>
          </div>
        </div>
      </div>

      {/* Horizontal Quick Actions Row */}
      <div className="flex flex-wrap items-center gap-1.5 bg-neutral-100/50 dark:bg-neutral-900/20 p-1 rounded-lg border border-neutral-200/10 dark:border-neutral-800/20">
        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest px-1">Quick:</span>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 transition cursor-pointer"
        >
          <Plus className="w-2.5 h-2.5 text-neutral-500" />
          <span>Draft Invoice</span>
        </button>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 transition cursor-pointer"
        >
          <History className="w-2.5 h-2.5 text-neutral-500" />
          <span>Registry</span>
        </button>
        <button
          onClick={() => {
            const printPreview = document.getElementById('statistics-banner');
            if (printPreview) {
              printPreview.classList.add('animate-bounce');
              setTimeout(() => printPreview.classList.remove('animate-bounce'), 1000);
            }
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 transition cursor-pointer"
        >
          <Sparkles className="w-2.5 h-2.5 text-yellow-500" />
          <span>Telemetry</span>
        </button>
      </div>

      {/* Content Area - empty state replacement if zero invoices */}
      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 border border-dashed border-neutral-250 dark:border-neutral-805 rounded-xl bg-white/20 dark:bg-neutral-900/10 min-h-[300px] text-center max-w-2xl mx-auto space-y-4 shadow-xs animate-fade-in">
          <div className="p-4 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
              No invoices created yet
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto font-sans leading-relaxed">
              No invoices created yet. Create your first invoice to get started.
            </p>
          </div>
          <button
            onClick={onCreateNew}
            className={`inline-flex items-center gap-1.5 px-4.5 py-2 ${colors.primary} ${colors.primaryHover} text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Invoice</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 animate-fade-in">
          {/* Left column containing Chart + Outstanding List */}
          <div className="lg:col-span-7 space-y-3">
            
            {/* Revenue Trajectory Card */}
            <div className="bg-white/60 dark:bg-neutral-900/40 border border-neutral-200/30 dark:border-neutral-800/40 backdrop-blur-md rounded-xl p-3 shadow-sm group hover:border-neutral-300 dark:hover:border-neutral-705 transition-all duration-300">
              <div className="flex justify-between items-center gap-2 mb-1.5">
                <div>
                  <h3 className="font-extrabold text-neutral-900 dark:text-white text-xs tracking-tight flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Revenue Trajectory</span>
                  </h3>
                  <p className="text-[9px] text-neutral-500 dark:text-neutral-400 font-mono tracking-tight leading-none mt-0.5">
                    Scale: max {currencySymbol}{maxVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 text-[8px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="w-2.5 h-2.5" />
                  <span>Interactive</span>
                </div>
              </div>

              {/* Slashed mini billing chart container */}
              <div className="h-16 flex items-end justify-between gap-1.5 pt-2 relative">
                {/* Guidelines */}
                <div className="absolute inset-x-0 top-1 bottom-0 flex flex-col justify-between pointer-events-none opacity-60">
                  <div className="border-t border-dashed border-neutral-200 dark:border-neutral-800/20 w-full" />
                  <div className="border-t border-dashed border-neutral-200 dark:border-neutral-800/20 w-full" />
                </div>

                {chartData.map((d, i) => {
                  const heightPercent = maxVal > 0 ? (d.value / maxVal) * 90 : 15;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center group relative z-10">
                      {/* Tooltip on Hover */}
                      <div className="absolute bottom-full mb-1 bg-neutral-900 dark:bg-neutral-800 text-white border border-neutral-800 dark:border-neutral-700/50 text-[9px] font-mono py-0.5 px-1 rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition duration-150 z-20">
                        {currencySymbol}{d.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>

                      {/* Compact Pillar */}
                      <div
                        style={{ height: `${Math.max(heightPercent, 10)}%` }}
                        className={`w-full max-w-[24px] bg-gradient-to-t ${colors.gradientFrom} ${colors.gradientTo} opacity-80 hover:opacity-100 rounded-t transition-all duration-300 cursor-pointer`}
                      />

                      {/* Short font labels */}
                      <span className="text-[8px] text-neutral-550 dark:text-neutral-400 font-semibold mt-1 font-mono">
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pending Outstanding Payments List */}
            <div id="awaiting-settlement-section" className="bg-white/60 dark:bg-neutral-900/40 border border-neutral-200/30 dark:border-neutral-800/40 backdrop-blur-md rounded-xl p-3 shadow-sm group hover:border-neutral-300 dark:hover:border-neutral-705 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-extrabold text-neutral-900 dark:text-white text-xs tracking-tight flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>Awaiting Settlement</span>
                </h3>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 uppercase font-mono">
                  {invoices.filter(inv => inv.status === 'Pending').length} Pending
                </span>
              </div>

              <div className="space-y-1">
                {invoices.filter(inv => inv.status === 'Pending').length > 0 ? (
                  invoices
                    .filter(inv => inv.status === 'Pending')
                    .slice(0, 3)
                    .map(inv => (
                      <div
                        key={inv.id}
                        onClick={() => onEdit(inv.id)}
                        className="group border border-neutral-200 dark:border-neutral-800/40 hover:border-amber-500/30 bg-neutral-100/30 dark:bg-neutral-900/30 hover:bg-white dark:hover:bg-neutral-900/60 p-1.5 rounded-lg flex items-center justify-between cursor-pointer transition duration-150"
                      >
                        <div className="min-w-0 flex-1 flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white shrink-0">
                            #{inv.invoiceNumber || 'INV-000'}
                          </span>
                          <p className="text-[10px] text-neutral-750 dark:text-neutral-300 truncate max-w-[100px] sm:max-w-[120px]">
                            {inv.clientName || 'Unnamed Client'}
                          </p>
                          <span className="text-[7px] bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 px-1 font-extrabold rounded leading-tight shrink-0 hidden sm:inline border border-rose-200/40 dark:border-rose-500/20">
                            Due {inv.dueDate}
                          </span>
                        </div>
                        <div className="text-right ml-2 flex items-center gap-1">
                          <span className="font-mono text-xs font-black text-rose-600 dark:text-rose-400">
                            {inv.currency}{inv.grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                          <ChevronRight className="w-3 h-3 text-neutral-400 dark:text-neutral-600 group-hover:text-neutral-900 dark:group-hover:text-white transition" />
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4 text-neutral-500 dark:text-neutral-400 italic text-[10px] leading-relaxed">
                    No accounts are outstanding. Client compliance is at 100%!
                  </div>
                )}
              </div>
            </div>

          </div>

          <div id="recent-activities-section" className="lg:col-span-5 bg-white/60 dark:bg-neutral-900/40 border border-neutral-200/30 dark:border-neutral-800/40 backdrop-blur-md rounded-xl p-3 flex flex-col justify-between group hover:border-neutral-350 dark:hover:border-neutral-705 transition-all duration-300 shadow-sm">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-extrabold text-neutral-900 dark:text-white text-xs tracking-tight flex items-center gap-1">
                  <Activity className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <span>Recent Activities</span>
                </h3>
                <button
                  onClick={onViewAll}
                  className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* Horizontal card swipe list on Mobile for high-density spacing */}
              <div className="block lg:hidden w-full max-w-full overflow-hidden">
                <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none snap-x touch-pan-x w-full">
                  {recentInvoices.length > 0 ? (
                    recentInvoices.map(invoice => (
                      <div
                        key={invoice.id}
                        onClick={() => onEdit(invoice.id)}
                        className="snap-center shrink-0 w-[140px] bg-neutral-100/30 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-850 hover:border-neutral-700 p-2 rounded-lg flex flex-col justify-between cursor-pointer group"
                      >
                        <div>
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-mono text-[9px] font-extrabold text-neutral-900 dark:text-white truncate max-w-[80px]">
                              #{invoice.invoiceNumber || 'INV-000'}
                            </span>
                            <span
                              className={`text-[6px] font-mono px-1 py-0.5 rounded font-extrabold leading-none border ${
                                invoice.status === 'Paid'
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-250/20 dark:border-emerald-500/20'
                                  : invoice.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-250/20 dark:border-amber-500/20'
                                  : 'bg-neutral-55 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-250/20 dark:border-neutral-700'
                              }`}
                            >
                              {invoice.status}
                            </span>
                          </div>
                          <p className="text-[9px] text-neutral-700 dark:text-neutral-300 truncate">
                            {invoice.clientName || 'Unnamed Client'}
                          </p>
                        </div>
                        <div className="mt-1 flex justify-between items-end border-t border-neutral-200/50 dark:border-neutral-850 pt-1">
                          <span className="text-[7px] text-neutral-505 dark:text-neutral-400 font-bold font-mono">
                            {invoice.issueDate}
                          </span>
                          <span className="font-mono text-[10px] font-black text-neutral-900 dark:text-white">
                            {invoice.currency}{invoice.grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-neutral-500 dark:text-neutral-550 italic text-[10px] w-full">
                      No active invoices.
                    </div>
                  )}
                </div>
              </div>

              {/* Density vertical list layout on Desktop viewports */}
              <div className="hidden lg:block space-y-1">
                {recentInvoices.length > 0 ? (
                  recentInvoices.map(invoice => (
                    <div
                      key={invoice.id}
                      onClick={() => onEdit(invoice.id)}
                      className="group border border-neutral-250/30 dark:border-neutral-850 hover:border-neutral-400 dark:hover:border-neutral-700 p-1.5 rounded-lg flex items-center justify-between cursor-pointer bg-neutral-100/30 dark:bg-neutral-900/15 hover:bg-white dark:hover:bg-neutral-900/50 transition duration-150"
                    >
                      <div className="min-w-0 flex-1 flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white shrink-0">
                          #{invoice.invoiceNumber || 'INV-000'}
                        </span>
                        <p className="text-[10px] text-neutral-700 dark:text-neutral-300 truncate max-w-[80px]">
                          {invoice.clientName || 'Unnamed Client'}
                        </p>
                        <span
                          className={`text-[7px] font-mono uppercase px-1 py-0.5 font-extrabold rounded leading-none shrink-0 border ${
                            invoice.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-250/20 dark:border-emerald-500/20'
                              : invoice.status === 'Pending'
                              ? 'bg-amber-50 text-amber-750 dark:bg-amber-950/40 dark:text-amber-400 border-amber-250/20 dark:border-amber-500/20'
                              : 'bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-405 border-neutral-200/40 dark:border-neutral-700/50'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </div>

                      <div className="text-right ml-1 flex items-center gap-1">
                        <div>
                          <p className="font-mono text-xs font-black text-neutral-900 dark:text-white leading-none">
                            {invoice.currency}
                            {invoice.grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-neutral-400 dark:text-neutral-600 group-hover:text-neutral-900 dark:group-hover:text-white transition" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-neutral-500 dark:text-neutral-450 italic text-[10px]">
                    No bills created yet. Create an invoice to begin!
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Dynamic SEO Information Block and FAQ Accordions */}
      <div className="mt-8 pt-6 border-t border-neutral-200/20 dark:border-neutral-800/40 space-y-6">
        
        {/* SEO introductory card */}
        <div className="bg-white/40 dark:bg-neutral-900/10 border border-neutral-200/20 dark:border-neutral-800/25 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
          <h2 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white uppercase tracking-tight">
            Free Online Invoice Generator
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
            Our free online invoice generator lets you create, customize, and download high-quality, professional PDF invoices in seconds. Built explicitly for freelancers, consultants, small businesses, and startups, this powerful billing tool streamlines your invoicing process without requiring account registration. Custom-engineer client estimates, handle item rates, record VAT/GST/taxes, and download your clean PDF statements instantly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Create Professional Invoices in Seconds</span>
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-sans leading-relaxed">
                Add your business identifiers, customizable company branding, and rich client lists safely. The modern auto-calculation engine manages subtotals, complex item quantities, and standard adjustments in real-time.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                <span>Download PDF Invoices Instantly</span>
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-sans leading-relaxed">
                Download fully optimized, pristine PDF files instantly. The design remains responsive and print-ready so your billing documents look spectacular on any desk or screen worldwide.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Add Your Logo and Business Details</span>
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-sans leading-relaxed">
                Personalize documents by adding your firm logo, contact number, default payment notes, and individual tax profiles. Unlock advanced fields through easy client-side interactions to make each invoice unique.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Manage Draft, Pending and Paid Invoices</span>
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-sans leading-relaxed">
                Monitor business trajectory at a glance. Track live, unpaid pending invoices, settled earnings, and local draft records on the interactive workspace dashboard.
              </p>
            </div>
          </div>
          
          <div className="pt-2 border-t border-neutral-200/10 dark:border-neutral-800/10 text-[11px] text-neutral-400 dark:text-neutral-500 italic">
            * Fully optimized with high contrast colors to achieve Google Core Web Vitals excellence and AdSense monetization compliance.
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-3">
          <h2 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Frequently Asked Questions (FAQ)</span>
          </h2>
          
          <div className="grid grid-cols-1 gap-2">
            {[
              {
                q: "Is this invoice generator free?",
                a: "Yes, this online invoice generator is 100% free to use. You can customize, calculate, and generate unlimited high-quality PDF invoices without any sneaky billing plans."
              },
              {
                q: "Can I download invoices as PDF?",
                a: "Absolutely! Our tool integrates advanced client-side PDF generation. Click download, and a professional, beautifully aligned PDF will download instantly on your browser."
              },
              {
                q: "Can I add my company logo?",
                a: "Yes, you can easily add yours! Importing clean logos or custom business monograms takes seconds and allows local client processing without cloud upload delays."
              },
              {
                q: "Do I need to create an account?",
                a: "No registration is required. All billing settings and invoice drafts are kept in your local secure browser storage, giving you full control and personal confidentiality."
              },
              {
                q: "Is this suitable for freelancers and small businesses?",
                a: "Yes, this professional billing utility is engineered explicitly to meet the requirements of freelancers, agencies, consultants, contractors, start-ups, and small businesses globally."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-neutral-200/40 dark:border-neutral-800/40 bg-white/40 dark:bg-neutral-900/10 rounded-xl p-3 cursor-pointer transition-all hover:bg-white dark:hover:bg-neutral-900/20">
                <summary className="list-none flex justify-between items-center text-xs font-bold text-neutral-800 dark:text-neutral-100 select-none">
                  <span>{faq.q}</span>
                  <span className="text-neutral-400 group-open:rotate-180 transition-transform duration-200 text-[10px]">▼</span>
                </summary>
                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed cursor-text select-text pr-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
