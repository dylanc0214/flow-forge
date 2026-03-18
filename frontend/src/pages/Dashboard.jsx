import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchDashboardStats, fetchMyRequests, fetchPendingApprovals } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ 
    totalRequests: 0, pendingApprovals: 0, approvedRequests: 0,
    trendData: [], distributionData: []
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeframe, setTimeframe] = useState(30);
  const [openActionMenu, setOpenActionMenu] = useState(null); // request id
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Get current user from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'User' };

  // Close notifications if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifRef]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, requestsData, approvalsData] = await Promise.all([
          fetchDashboardStats(timeframe),
          fetchMyRequests(),
          fetchPendingApprovals()
        ]);
        setStats(statsData);
        setAllRequests(requestsData);
        setRecentRequests(requestsData.slice(0, 5)); // Just take top 5
        setNotifications(approvalsData.slice(0, 5));
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [timeframe]);

  const filteredRequests = searchQuery 
    ? allRequests.filter(req => {
        const lowerQ = searchQuery.toLowerCase();
        return (
          (req.title && req.title.toLowerCase().includes(lowerQ)) ||
          (req.workflow_name && req.workflow_name.toLowerCase().includes(lowerQ)) ||
          (req.id && String(req.id).includes(lowerQ)) ||
          (req.requestor_name && req.requestor_name.toLowerCase().includes(lowerQ))
        );
      })
    : recentRequests;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold tracking-tight">Analytics Dashboard</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary/50 transition-all" 
              placeholder="Search recent requests..." 
              type="text" 
            />
          </div>
          
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              {notifications.length > 0 && (
                 <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-50">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 dark:text-white">Notifications</h4>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">{notifications.length} New</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm">No new notifications.</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} onClick={() => navigate('/approvals')} className="p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-750 cursor-pointer transition-colors flex gap-3 items-start">
                        <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                          <span className="material-symbols-outlined text-sm">assignment</span>
                        </div>
                        <div>
                          <p className="text-sm text-slate-900 dark:text-white font-medium">Pending Approval</p>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{notif.requestor_name} requested {notif.title}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{new Date(notif.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 text-center border-t border-slate-100 dark:border-slate-700">
                  <Link to="/approvals" className="text-xs font-bold text-primary hover:underline">View All Approvals</Link>
                </div>
              </div>
            )}
          </div>

          <Link to="/help" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
            <span className="material-symbols-outlined">help</span>
          </Link>
        </div>
      </header>
      
      {/* Dashboard Content */}
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div>
          <h3 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h3>
          <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your business processes today.</p>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">view_list</span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Total Requests</p>
            <p className="text-3xl font-bold mt-1">{loading ? '-' : stats.totalRequests}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="size-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Pending Approvals</p>
            <p className="text-3xl font-bold mt-1">{loading ? '-' : stats.pendingApprovals}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="size-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <span className="material-symbols-outlined">verified</span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Approved Requests</p>
            <p className="text-3xl font-bold mt-1">{loading ? '-' : stats.approvedRequests}</p>
          </div>
        </div>
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request Trends Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-lg font-bold">Request Trends</h4>
                <p className="text-sm text-slate-500">Volume of requests over the selected period</p>
              </div>
              <select 
                value={timeframe} 
                onChange={(e) => setTimeframe(Number(e.target.value))}
                className="bg-slate-100 dark:bg-slate-800 border-none text-sm rounded-lg focus:ring-primary/30"
              >
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>This Year</option>
              </select>
            </div>
            <div className="h-64 flex items-end gap-2 mt-4 pt-10">
              {loading || !stats.trendData || stats.trendData.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">bar_chart</span>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No data available yet</p>
                  <p className="text-sm text-slate-400 mt-1">Check back later when requests are processed.</p>
                </div>
              ) : (
                stats.trendData.map((day, i) => {
                  const maxCount = Math.max(...stats.trendData.map(d => d.count)) || 1;
                  const hPct = (day.count / maxCount) * 100;
                  const dateObj = new Date(day.date);
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col justify-end gap-1 h-full group relative">
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {day.count} requests
                      </div>
                      <div className="w-full bg-primary rounded-t-sm transition-all duration-300 hover:brightness-110" style={{ height: `${hPct}%` }}></div>
                      {/* Only label every ~5th day to avoid cluttering if there's 30 days */}
                      {i % 5 === 0 && (
                        <div className="text-[10px] text-slate-400 text-center mt-2 font-medium absolute top-full left-1/2 -translate-x-1/2">
                          {dateObj.getDate()}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          {/* Task Distribution */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <h4 className="text-lg font-bold mb-6">Workflow Distribution</h4>
            {loading || !stats.distributionData || stats.distributionData.length === 0 ? (
              <div className="h-full min-h-[250px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">donut_large</span>
                <p className="text-slate-500 dark:text-slate-400 font-medium">No distribution data</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-4">
                {stats.distributionData.map((dist, idx) => {
                   const total = stats.distributionData.reduce((sum, d) => sum + d.count, 0) || 1;
                   const pct = ((dist.count / total) * 100).toFixed(0);
                   const colors = ['bg-primary', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'];
                   const colorVal = colors[idx % colors.length];

                   return (
                     <div key={idx} className="flex flex-col gap-2">
                       <div className="flex justify-between items-end">
                         <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{dist.workflow_name}</span>
                         <span className="text-sm font-bold text-slate-900 dark:text-white">{pct}% ({dist.count})</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                         <div className={`h-full ${colorVal} rounded-full`} style={{ width: `${pct}%` }}></div>
                       </div>
                     </div>
                   );
                })}
              </div>
            )}
          </div>
        </div>
        {/* Recent Requests Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h4 className="text-lg font-bold">{searchQuery ? 'Search Results' : 'Recent Requests'}</h4>
            {!searchQuery && <button onClick={() => navigate('/requests/my')} className="text-primary text-sm font-semibold hover:underline">View All</button>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
                <tr>
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">Process Name</th>
                  <th className="px-6 py-4">Requester</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">#REQ-{req.id}</td>
                    <td className="px-6 py-4 text-sm">{req.workflow_name || req.title}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div className="w-full h-full bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                            {req.requestor_name?.substring(0, 2).toUpperCase() || 'U'}
                          </div>
                        </div>
                        {req.requestor_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(req.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                        req.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenActionMenu(openActionMenu === req.id ? null : req.id); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">more_vert</span>
                        </button>
                        {openActionMenu === req.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-9 z-50 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden"
                          >
                            <button
                              onClick={() => { navigate('/requests/my'); setOpenActionMenu(null); }}
                              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              <span className="material-symbols-outlined text-base text-slate-400">open_in_new</span>
                              View Details
                            </button>
                            {req.status === 'Pending' && (
                              <button
                                onClick={() => { navigate('/approvals'); setOpenActionMenu(null); }}
                                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors border-t border-slate-100 dark:border-slate-800"
                              >
                                <span className="material-symbols-outlined text-base">task_alt</span>
                                Approve
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRequests.length === 0 && !loading && (
                    <tr><td colSpan="6" className="text-center py-4 text-slate-500">No requests found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
