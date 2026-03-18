import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWorkflows, submitRequest } from '../services/api';

export default function SubmitRequest() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [formData, setFormData] = useState({ title: '', workflow_id: '', description: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        const data = await fetchWorkflows();
        setWorkflows(data);
      } catch (err) {
        console.error('Failed to load workflows', err);
      }
    };
    loadWorkflows();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Amount is optional, formatting it
      const payload = { ...formData, amount: formData.amount ? parseFloat(formData.amount) : null };
      await submitRequest(payload);
      navigate('/requests/my');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Navbar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
        <div className="flex items-center gap-2 text-slate-500">
          <span className="text-sm font-medium">Requests</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Submit New Request</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64 group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary transition-all" placeholder="Search..." type="text" />
          </div>
          <button className="p-2 text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>

      {/* Page Content */}
      <div className="p-8 max-w-3xl mx-auto">
        {/* Form Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Create New Request</h2>
          <p className="text-slate-500 mt-2">Fill out the details below to initiate a new workflow process. Our team will review and respond within 24 hours.</p>
        </div>

        {/* Main Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="title">Request Title</label>
              <input 
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400" 
                id="title" name="title" placeholder="e.g. Q3 Marketing Budget Review" type="text" 
              />
            </div>

            {/* Workflow Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="workflow_id">Workflow Type</label>
              <div className="relative">
                <select 
                  required
                  value={formData.workflow_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none cursor-pointer transition-all" 
                  id="workflow_id" name="workflow_id"
                >
                  <option disabled value="">Select a workflow process</option>
                  {workflows.map(wf => (
                    <option key={wf.id} value={wf.id}>{wf.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
              </div>
            </div>

            {/* Amount Field (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="amount">Amount (Optional)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                <input 
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400" 
                  id="amount" name="amount" placeholder="0.00" type="number" step="0.01" 
                />
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="description">Description</label>
              <textarea 
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400" 
                id="description" name="description" placeholder="Provide a detailed explanation of your request..." rows="5"
              ></textarea>
              <p className="text-xs text-slate-400 mt-2 italic">Max 500 words. Rich text options available via shortcuts.</p>
            </div>

            {/* Attachment Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Attachments</label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">upload_file</span>
                <p className="text-sm text-slate-600 dark:text-slate-400"><span className="text-primary font-medium">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-slate-400 mt-1">PDF, DOCX, or PNG up to 10MB</p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading || !formData.workflow_id}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
                {!loading && <span className="material-symbols-outlined text-sm">send</span>}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <span className="material-symbols-outlined text-primary">info</span>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Automatic Routing</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Based on the workflow type, your request will be automatically routed to the relevant department head for priority review.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-slate-500">schedule</span>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Estimated Response</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Average response time for Financial Approval workflows is currently <span className="text-slate-700 dark:text-slate-300 font-medium">12 working hours</span>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
