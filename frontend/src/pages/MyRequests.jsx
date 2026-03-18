import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyRequests } from '../services/api';

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpenActionMenu(null); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchMyRequests();
        setRequests(data);
      } catch (err) {
        console.error('Failed to load requests', err);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  const filteredRequests = requests.filter(req => filter === 'All' || req.status === filter);
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Requests</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage your submitted business processes.</p>
          </div>
          <Link to="/requests/submit" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-base">add</span>
            New Request
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-slate-200 dark:border-slate-800">
          <nav className="flex gap-8">
            {['All', 'Pending', 'Approved', 'Rejected'].map(t => (
               <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`border-b-2 pb-4 text-sm font-bold ${filter === t ? 'border-primary text-primary' : 'border-transparent font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
               >
                 {t === 'All' ? 'All Requests' : t}
               </button>
            ))}
          </nav>
        </div>

        {/* Request List */}
        <div className="grid gap-4">
          {loading && <p className="text-slate-500 py-8 text-center">Loading requests...</p>}
          
          {!loading && filteredRequests.length === 0 && (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500">
              No requests found.
            </div>
          )}

          {filteredRequests.map(req => (
            <div key={req.id} className="group relative flex flex-col md:flex-row items-start md:items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                req.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                req.status === 'Rejected' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' :
                'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
              }`}>
                <span className="material-symbols-outlined">description</span>
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    req.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 
                    req.status === 'Rejected' ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300' :
                    'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                  }`}>
                    {req.status}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(req.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{req.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Workflow: {req.workflow_name} {req.amount ? `| Amount: $${req.amount}` : ''}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button 
                  onClick={() => setSelectedRequest(req)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  View Details
                </button>
                <div className="relative" ref={openActionMenu === req.id ? menuRef : null}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenActionMenu(openActionMenu === req.id ? null : req.id); }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                  {openActionMenu === req.id && (
                    <div className="absolute right-0 top-9 z-50 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
                      <button
                        onClick={() => { setSelectedRequest(req); setOpenActionMenu(null); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base text-slate-400">info</span>
                        View Details
                      </button>
                      {req.status === 'Pending' && (
                        <button
                          onClick={() => setOpenActionMenu(null)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-slate-100 dark:border-slate-800"
                        >
                          <span className="material-symbols-outlined text-base">cancel</span>
                          Cancel Request
                        </button>
                      )}
                      {req.status === 'Approved' && (
                        <button
                          onClick={() => setOpenActionMenu(null)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border-t border-slate-100 dark:border-slate-800"
                        >
                          <span className="material-symbols-outlined text-base">download</span>
                          Download Receipt
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedRequest(null)}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Request Details</h3>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    selectedRequest.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' :
                    selectedRequest.status === 'Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                  }`}>
                    {selectedRequest.status}
                  </span>
                  <span className="text-sm text-slate-500 font-medium tracking-wide border-l border-slate-300 dark:border-slate-700 pl-3">
                    ID: #{selectedRequest.id}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{selectedRequest.title}</h4>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <span className="text-sm text-slate-500 font-medium">Workflow</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedRequest.workflow_name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <span className="text-sm text-slate-500 font-medium">Amount</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedRequest.amount ? `$${selectedRequest.amount}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <span className="text-sm text-slate-500 font-medium">Created</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {new Date(selectedRequest.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500 font-medium">Requested By</span>
                  <div className="flex items-center gap-2">
                    <div className="size-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                       {selectedRequest.requestor_name?.substring(0, 2).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedRequest.requestor_name}</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Description</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl leading-relaxed">
                  {selectedRequest.description || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
