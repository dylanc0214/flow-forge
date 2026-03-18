import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { login } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('manager@flowforge.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [ssoModal, setSsoModal] = useState(null); // 'google' | 'sso' | null

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header / Top Navigation */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-10 py-4 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="size-8 flex items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined">account_tree</span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">FlowForge</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/help" className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors">
              <span>Help Center</span>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center p-6 bg-gradient-to-br from-background-light to-primary/5 dark:from-background-dark dark:to-primary/10">
          <div className="w-full max-w-[480px] space-y-8 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 relative z-10">
            {/* Branding & Title */}
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Welcome Back</h1>
              <p className="text-slate-500 dark:text-slate-400 text-base">Sign in to manage your business processes</p>
            </div>
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-2 text-center border border-red-200">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold leading-normal">Work Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="form-input flex w-full rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base font-normal outline-none transition-all placeholder-slate-400" 
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold leading-normal">Password</label>
                <div className="relative flex items-center">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" 
                    className="form-input flex w-full rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-4 pr-12 text-base font-normal outline-none transition-all placeholder-slate-400" 
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center">
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="remember" className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4" />
                  <label htmlFor="remember" className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-normal">Remember me</label>
                </div>
                <a href="#" className="text-primary hover:underline text-sm font-semibold leading-normal">Forgot password?</a>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                {!loading && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs font-medium uppercase tracking-widest">Or continue with</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            {/* Social Login Alternatives */}
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setSsoModal('google')} className="flex items-center justify-center gap-2 rounded-lg h-12 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button type="button" onClick={() => setSsoModal('sso')} className="flex items-center justify-center gap-2 rounded-lg h-12 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-slate-700 dark:text-white">corporate_fare</span>
                SSO
              </button>
            </div>

            {/* Google / SSO Info Modal */}
            {ssoModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSsoModal(null)}></div>
                <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                  <div className="mx-auto mb-4 size-14 rounded-full bg-primary/10 flex items-center justify-center">
                    {ssoModal === 'google'
                      ? <svg className="w-7 h-7" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      : <span className="material-symbols-outlined text-primary text-3xl">corporate_fare</span>
                    }
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                    {ssoModal === 'google' ? 'Google Sign-In' : 'Enterprise SSO'}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    {ssoModal === 'google'
                      ? 'Google OAuth integration requires configuration in the Google Cloud Console. Please contact your FlowForge administrator to enable Google Sign-In for your organisation.'
                      : 'SSO (SAML 2.0 / OIDC) is available on the Enterprise plan. Please contact your IT administrator with your company domain to set up Single Sign-On.'
                    }
                  </p>
                  <div className="flex flex-col gap-3">
                    <a
                      href={ssoModal === 'google' ? 'mailto:admin@flowforge.com?subject=Enable Google Sign-In' : 'mailto:admin@flowforge.com?subject=SSO Setup Request'}
                      className="w-full bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      Contact Administrator
                    </a>
                    <button onClick={() => setSsoModal(null)} className="w-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium py-2">
                      Back to Sign In
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Footer Link */}
            <div className="text-center pt-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Don't have an account?{' '}
                <Link className="text-primary font-bold hover:underline" to="/signup">Create an account</Link>
              </p>
            </div>
          </div>
        </main>
        {/* Bottom Footer */}
        <footer className="p-6 text-center">
          <p className="text-slate-400 dark:text-slate-500 text-xs">
            © 2026 FlowForge Inc. All rights reserved.
            <span className="mx-2">|</span>
            <Link className="hover:text-primary" to="/privacy">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <Link className="hover:text-primary" to="/terms">Terms of Service</Link>
          </p>
        </footer>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-0 right-0 z-0 w-1/3 h-1/3 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 z-0 w-1/4 h-1/4 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
}
