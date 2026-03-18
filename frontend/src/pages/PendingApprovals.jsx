import { useState, useEffect } from 'react';
import { fetchPendingApprovals, fetchApprovalStats, approveRequest, rejectRequest } from '../services/api';

export default function PendingApprovals() {
  const [approvals, setApprovals] = useState([]);
  const [stats, setStats] = useState({ avgResponseTime: '-', approvalRate: '-' });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // store request ID being acted on
  const [comments, setComments] = useState({});

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'User' };

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const [approvalData, statsData] = await Promise.all([
        fetchPendingApprovals(),
        fetchApprovalStats()
      ]);
      setApprovals(approvalData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load approvals or stats', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setActionLoading(id);
    try {
      const comment = comments[id] || '';
      if (action === 'approve') {
        await approveRequest(id, comment);
      } else {
        await rejectRequest(id, comment);
      }
      // Refresh list
      loadApprovals();
    } catch (err) {
      console.error('Failed to perform action', err);
      alert(err.response?.data?.error || 'Failed to perform action');
    } finally {
      setActionLoading(null);
    }
  };

  const totalValue = approvals.reduce((sum, req) => sum + (parseFloat(req.amount) || 0), 0);
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Navbar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-slate-700 transition-all outline-none" placeholder="Search requests..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            {approvals.length > 0 && <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>}
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <span className="material-symbols-outlined">help</span>
          </button>
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-8 max-w-7xl w-full mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Approvals</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">You have {loading ? '...' : approvals.length} requests awaiting your review.</p>
          </div>
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button className="px-4 py-1.5 text-sm font-bold bg-white dark:bg-slate-700 shadow-sm rounded-md text-slate-900 dark:text-white">Pending</button>
            <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">History</button>
            <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Archived</button>
          </div>
        </div>

        {/* Approval Table Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Submitter</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Request Details</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount / Priority</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Feedback</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading pending approvals...</td>
                  </tr>
                )}
                {!loading && approvals.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 bg-slate-50/50 dark:bg-slate-800/20">No pending approvals require your attention.</td>
                  </tr>
                )}
                {approvals.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                          <span className="text-xs font-bold">{req.requestor_name?.substring(0, 2).toUpperCase() || 'U'}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{req.requestor_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{req.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Submitted {new Date(req.created_at).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{req.amount ? `$${req.amount}` : '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <input
                        value={comments[req.id] || ''}
                        onChange={(e) => setComments({ ...comments, [req.id]: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs px-3 py-2 focus:ring-1 focus:ring-primary/40 focus:bg-white dark:focus:bg-slate-700 transition-all outline-none"
                        placeholder="Add a comment (optional)..."
                        type="text"
                        disabled={actionLoading === req.id}
                      />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAction(req.id, 'reject')}
                          disabled={actionLoading === req.id}
                          className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(req.id, 'approve')}
                          disabled={actionLoading === req.id}
                          className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">Showing {approvals.length} pending requests</p>
            <div className="flex gap-2">
              <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-30" disabled>
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-30" disabled>
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-primary/70">Total Pending Value</span>
              <span className="material-symbols-outlined text-primary">payments</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pending total</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Average Response Time</span>
              <span className="material-symbols-outlined text-slate-400">timer</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.avgResponseTime}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Based on past completions</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Approval Rate</span>
              <span className="material-symbols-outlined text-slate-400">bar_chart</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.approvalRate}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total approved vs rejected</p>
          </div>
        </div>

      </div>
    </div>
  );
}
