import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

export default function Layout() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'User', email: '', role: 'Employee' };

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      {/* Side Navigation */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined">account_tree</span>
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">FlowForge</h1>
            <p className="text-xs text-slate-500">Enterprise Plan</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
             <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
             <span className="text-sm font-medium">Dashboard</span>
          </NavLink>
          
          <NavLink to="/requests/my" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${(isActive || window.location.pathname.includes('/requests/submit')) ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
             <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
             <span className="text-sm font-medium">Requests</span>
          </NavLink>

          <NavLink to="/approvals" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
             <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
             <span className="text-sm font-medium">Approvals</span>
          </NavLink>

          <NavLink to="/admin/workflows" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
             <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_tree</span>
             <span className="text-sm font-medium">Workflow Builder</span>
          </NavLink>

          <NavLink to="/analytics" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
             <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
             <span className="text-sm font-medium">Analytics</span>
          </NavLink>
          
          <NavLink to="/help" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
             <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>support</span>
             <span className="text-sm font-medium">Help Center</span>
          </NavLink>
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 p-2 rounded-lg">
              <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
               <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                 {user.name.substring(0, 2).toUpperCase()}
               </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark relative">
        {/* Render child pages here */}
        <Outlet />
      </main>
    </div>
  );
}
