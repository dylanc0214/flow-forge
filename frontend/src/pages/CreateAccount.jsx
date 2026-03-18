  import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';

export default function CreateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [ssoModal, setSsoModal] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(formData.name, formData.email, formData.password);
      // Automatically login? the api actually returned a token.
      // But let's just use the api service login to be safe, or simply redirect to login.
      // For a better UX, auto login since register returned user and token.
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="layout-container flex h-full flex-col">
        {/* Header/NavBar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-10 py-3 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <div className="size-8 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">account_tree</span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">FlowForge</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Already have an account?</span>
            <Link className="text-primary font-semibold text-sm hover:underline" to="/">Sign in</Link>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center py-12 px-4">
          <div className="layout-content-container flex flex-col w-full max-w-[480px] bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            {/* Title Section */}
            <div className="flex flex-col gap-2 mb-8 text-center">
              <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Create an account</h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Join FlowForge to streamline your workflow</p>
            </div>

            {/* Social Signup Options */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button type="button" onClick={() => setSsoModal('google')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                <span className="text-sm font-semibold">Google</span>
              </button>
              <button type="button" onClick={() => setSsoModal('sso')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-slate-500">vpn_key</span>
                <span className="text-sm font-semibold">SSO</span>
              </button>
            </div>

            <div className="relative flex items-center mb-8">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase tracking-wider font-bold">Or continue with email</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            {/* Form Section */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">
                {error}
              </div>
            )}
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold leading-normal">Full Name</label>
                <input required value={formData.name} onChange={handleChange} name="name" className="flex w-full rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base font-normal outline-none transition-all placeholder-slate-400" placeholder="John Doe" type="text" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold leading-normal">Work Email</label>
                <input required value={formData.email} onChange={handleChange} name="email" className="flex w-full rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base font-normal outline-none transition-all placeholder-slate-400" placeholder="name@company.com" type="email" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold leading-normal">Password</label>
                <div className="relative flex items-center">
                  <input required value={formData.password} onChange={handleChange} name="password" className="flex w-full rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-4 pr-12 text-base font-normal outline-none transition-all placeholder-slate-400" placeholder="Create a password" type={showPassword ? 'text' : 'password'} />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center" type="button">
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold leading-normal">Confirm Password</label>
                <div className="relative flex items-center">
                  <input required value={formData.confirmPassword} onChange={handleChange} name="confirmPassword" className="flex w-full rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-4 pr-12 text-base font-normal outline-none transition-all placeholder-slate-400" placeholder="Repeat your password" type={showConfirmPassword ? 'text' : 'password'} />
                  <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center" type="button">
                    <span className="material-symbols-outlined">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <input required className="mt-1 rounded border-slate-300 text-primary focus:ring-primary" id="terms" type="checkbox" />
                <label className="text-xs text-slate-500 dark:text-slate-400 leading-normal" htmlFor="terms">
                  I agree to the <Link className="text-primary hover:underline" to="/terms">Terms of Service</Link> and <Link className="text-primary hover:underline" to="/privacy">Privacy Policy</Link>.
                </label>
              </div>

              <button disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50" type="submit">
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                {!loading && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link className="text-primary font-bold hover:underline" to="/">Sign in</Link>
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-10 text-center">
          <p className="text-slate-400 text-xs">© 2026 FlowForge Inc. All rights reserved.</p>
        </footer>
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
              {ssoModal === 'google' ? 'Google Sign-Up' : 'Enterprise SSO'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              {ssoModal === 'google'
                ? 'Google OAuth integration requires configuration by your administrator. Contact your FlowForge admin to enable Google Sign-In for your organisation.'
                : 'SSO (SAML 2.0 / OIDC) is available on the Enterprise plan. Contact your IT administrator with your company domain to set up Single Sign-On.'
              }
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={ssoModal === 'google' ? 'mailto:admin@flowforge.com?subject=Enable Google Sign-In' : 'mailto:admin@flowforge.com?subject=SSO Setup Request'}
                className="w-full bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm block"
              >
                Contact Administrator
              </a>
              <button onClick={() => setSsoModal(null)} className="w-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium py-2">
                Back to Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
