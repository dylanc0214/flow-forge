import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchAnalyticsStats } from '../services/api';

const FILTER_OPTIONS = [
  { label: 'Last 7 Days',  value: 7  },
  { label: 'Last 30 Days', value: 30 },
  { label: 'Last 90 Days', value: 90 },
  { label: 'This Year',    value: 365 },
];

function exportCSV(stats, days) {
  const label = FILTER_OPTIONS.find(f => f.value === days)?.label || `${days}d`;

  // KPIs section
  const kpiLines = [
    'KPI,Value',
    `Total Workflows Executed,${stats.totalWorkflows}`,
    `Avg. Resolution Time,${stats.avgResolutionTime}`,
    `Bottlenecked Requests,${stats.bottlenecks}`,
    `Estimated Hours Saved,${stats.hoursSaved}`,
    '',
  ];

  // Volume data section
  const volHeaders = 'Month,Initiated,Completed';
  const volLines = (stats.volumeData || []).map(d => `${d.month},${d.initiated},${d.completed}`);

  // Efficiency section
  const effHeaders = 'Workflow,Avg Hours,Total Requests,Completed';
  const effLines = (stats.efficiencyData || []).map(d =>
    `"${d.workflow_name}",${Number(d.avg_hours).toFixed(1)},${d.total_requests},${d.completed_count}`);

  const csv = [
    `FlowForge Analytics Export — ${label}`,
    '',
    ...kpiLines,
    'Workflow Volume',
    volHeaders,
    ...volLines,
    '',
    'Process Efficiency',
    effHeaders,
    ...effLines,
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `flowforge-analytics-${label.toLowerCase().replace(/ /g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AnalyticsDashboard() {
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState({ 
    totalWorkflows: '-', avgResolutionTime: '-', bottlenecks: '-', hoursSaved: '-',
    volumeData: [], efficiencyData: []
  });
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAnalyticsStats(days);
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { loadStats(); }, [loadStats]);

  const kpis = [
    { label: 'Total Workflows Executed', value: stats.totalWorkflows, icon: 'account_tree', color: 'text-primary' },
    { label: 'Avg. Resolution Time',     value: stats.avgResolutionTime, icon: 'timer',        color: 'text-emerald-500' },
    { label: 'Bottlenecked Requests',    value: stats.bottlenecks,      icon: 'warning',       color: 'text-amber-500'  },
    { label: 'Estimated Hours Saved',    value: stats.hoursSaved,       icon: 'savings',       color: 'text-blue-500'   },
  ];

  return (
    <div className="flex-1 overflow-x-hidden flex flex-col bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 py-8 max-w-7xl flex-1">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Key performance metrics and workflow insights.</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {FILTER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button
              onClick={() => exportCSV(stats, days)}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-4 py-2 text-sm transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Export CSV
            </button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <span className={`material-symbols-outlined text-6xl ${kpi.color}`}>{kpi.icon}</span>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{kpi.label}</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {loading ? <span className="animate-pulse">—</span> : kpi.value}
                </h3>
                <div className="flex items-center gap-1 text-sm text-slate-400 font-medium">
                  {loading ? 'Loading...' : 'Based on selected period'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Workflow Volume Bar Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white">Workflow Volume</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-slate-500 dark:text-slate-400">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                  <span className="text-slate-500 dark:text-slate-400">Initiated</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-[300px] flex items-end gap-2 pt-10">
              {loading || stats.volumeData.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg mt-4">
                  <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">monitoring</span>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No volume data for this period</p>
                </div>
              ) : (
                stats.volumeData.map((data, i) => {
                  const maxInitiated = Math.max(...stats.volumeData.map(d => d.initiated)) || 1;
                  const intH = (data.initiated / maxInitiated) * 100;
                  const compH = data.completed > 0 ? (data.completed / data.initiated) * 100 : 0;
                  const date = new Date(data.month + '-01');
                  const monthStr = date.toLocaleString('default', { month: 'short' });
                  return (
                    <div key={i} className="flex-1 flex flex-col justify-end gap-1 h-full group relative">
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {data.completed} / {data.initiated} completed
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-sm relative" style={{ height: `${intH}%` }}>
                        <div className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-500 group-hover:brightness-110" style={{ height: `${compH}%` }}></div>
                      </div>
                      <div className="text-[10px] text-slate-400 text-center mt-2 font-medium">{monthStr}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Process Efficiency */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Process Efficiency</h3>
            {loading || stats.efficiencyData.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg min-h-[250px]">
                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">speed</span>
                <p className="text-slate-500 dark:text-slate-400 font-medium">No data for this period</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-5 overflow-y-auto pr-1">
                {stats.efficiencyData.map((wf, idx) => {
                  const avg = Number(wf.avg_hours);
                  const total = Number(wf.total_requests) || 0;
                  const completed = Number(wf.completed_count) || 0;
                  // On-time % based on completion ratio
                  const onTimePct = total > 0 ? Math.round((completed / total) * 100) : 0;
                  let colorClass = 'bg-emerald-500';
                  let textClass  = 'text-emerald-600 dark:text-emerald-400';
                  if (onTimePct < 50) { colorClass = 'bg-red-500';   textClass = 'text-red-600 dark:text-red-400'; }
                  else if (onTimePct < 80) { colorClass = 'bg-amber-500'; textClass = 'text-amber-600 dark:text-amber-400'; }

                  return (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{wf.workflow_name}</p>
                          <p className="text-xs text-slate-500">
                            {avg > 0 ? `Avg. ${avg.toFixed(1)} hrs` : 'No completions yet'} &bull; {completed}/{total} done
                          </p>
                        </div>
                        <span className={`text-xs font-bold ${textClass} ml-2 shrink-0`}>{onTimePct}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colorClass} rounded-full transition-all duration-700`}
                          style={{ width: `${onTimePct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-center">
              <Link to="/admin/workflows" className="text-primary text-sm font-bold hover:underline inline-flex items-center gap-1">
                View All Workflows <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
