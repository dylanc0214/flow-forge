import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ContactSupport() {
  const [formData, setFormData] = useState({ name: '', email: '', category: '', subject: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', category: '', subject: '', description: '' });
      setTimeout(() => setSuccess(false), 5000); // clear success msg after 5s
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 overflow-y-auto">
      <div className="mb-10">
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <Link to="/help" className="hover:text-primary transition-colors">Help Center</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-200 font-medium">Contact Support</span>
        </nav>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Contact Support</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Our technical team is ready to help you optimize your business workflows. Expect a response within 4 hours.</p>
      </div>

      {/* Support Form */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined">check_circle</span>
          <span>Your support ticket has been submitted successfully! We'll be in touch soon.</span>
        </div>
      )}
      
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
          {/* Identity Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 placeholder-slate-400" placeholder="Alex Johnson" type="text" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Work Email</label>
              <input required name="email" value={formData.email} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 placeholder-slate-400" placeholder="alex.j@company.com" type="email" />
            </div>
          </div>

          {/* Category & Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Inquiry Category</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="appearance-none w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224px%22%20height%3D%2224px%22%20fill%3D%22rgb(18%2C88%2C226)%22%20viewBox%3D%220%200%20256%20256%22%3E%3Cpath%20d%3D%22M181.66%2C170.34a8%2C8%2C0%2C0%2C1%2C0%2C11.32l-48%2C48a8%2C8%2C0%2C0%2C1-11.32%2C0l-48-48a8%2C8%2C0%2C0%2C1%2C11.32-11.32L128%2C212.69l42.34-42.35A8%2C8%2C0%2C0%2C1%2C181.66%2C170.34Zm-96-84.68L128%2C43.31l42.34%2C42.35a8%2C8%2C0%2C0%2C0%2C11.32-11.32l-48-48a8%2C8%2C0%2C0%2C0-11.32%2C0l-48%2C48A8%2C8%2C0%2C0%2C0%2C85.66%2C85.66Z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5rem] bg-[right_1rem_center] bg-no-repeat pr-10">
                <option value="">Select a category</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing Inquiry</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subject</label>
              <input required name="subject" value={formData.subject} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 placeholder:text-slate-400" placeholder="Short summary of the issue" type="text" />
            </div>
          </div>

          {/* Description Area */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Detailed Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 placeholder:text-slate-400 resize-y" placeholder="Please describe the issue, including steps to reproduce if applicable..." rows={6}></textarea>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-sm">info</span>
              <span className="text-xs">Your data is processed securely according to our Privacy Policy.</span>
            </div>
            <button disabled={loading} className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50" type="submit">
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
