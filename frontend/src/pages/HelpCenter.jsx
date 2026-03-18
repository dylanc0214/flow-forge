import { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'How do I submit a new request in FlowForge?',
    a: 'To submit a new request, click "New Request" from your Dashboard or navigate to My Requests → New Request. Choose the relevant workflow (e.g. Purchase Approval, Leave Request), fill in the required fields, and click Submit. Your request will immediately enter the configured approval chain and you will receive email notifications at each stage.'
  },
  {
    q: 'Can I track the status of my submitted requests?',
    a: 'Yes. Go to My Requests from the sidebar. Each request card shows its current status: Pending (awaiting approval action), Approved, or Rejected. Click "View Details" on any card to see the full request history, including which approver acted on it and any comments left.'
  },
  {
    q: 'How do multi-stage approval workflows work?',
    a: 'FlowForge supports sequential and conditional multi-stage approvals. When a request is submitted, it first reaches the Stage 1 approver (e.g. your line manager). Once approved, it automatically advances to Stage 2 (e.g. Finance) and so on. You can configure branching logic in the Workflow Builder — for example, requests over $5,000 can be routed to a senior approver while smaller amounts skip straight to Finance.'
  },
  {
    q: "What happens if an approver doesn't respond in time?",
    a: "Each workflow has a configurable approval timeout (default: 48 hours). When the deadline is exceeded, FlowForge will automatically send reminder emails to the approver and, if still unresolved, escalate the request to their supervisor. Timeout settings can be changed in Workflow Builder \u2192 Settings."
  },
  {
    q: 'How do I approve or reject a request as a manager?',
    a: 'Pending approvals appear in the Approvals section of the sidebar (highlighted with a badge count). Click on a request to review the full details, then use the Approve or Reject buttons. You can optionally add a comment before confirming your decision. The requester will be notified immediately by email.'
  },
  {
    q: 'Is my data encrypted and secure?',
    a: 'Yes. All data transmitted between your browser and FlowForge servers is encrypted using TLS 1.3. Passwords are hashed with bcrypt and never stored in plain text. Session tokens (JWT) expire after 24 hours. FlowForge is hosted on enterprise-grade infrastructure with regular security audits and automated daily backups.'
  },
  {
    q: 'How do I build a custom workflow?',
    a: "Go to Admin \u2192 Workflow Builder in the sidebar. You'll see a visual canvas where you can drag-and-drop step blocks: Trigger, Approval, Notification, Delay, and Condition blocks. Configure each block by clicking the edit icon on the right panel. Set up your workflow triggers (e.g. Form Submission) under the Triggers tab, and configure escalation and archiving behaviour under the Settings tab. When ready, click Publish Workflow."
  },
  {
    q: 'Can I export analytics data?',
    a: 'Yes. Navigate to Analytics Dashboard and use the time filter (Last 7 Days, 30 Days, 90 Days, This Year) to select your reporting window. Then click the Export CSV button in the top-right corner. The download includes all KPIs (total workflows, avg resolution time, bottlenecks, hours saved), monthly volume data, and per-workflow process efficiency data.'
  },
];

const ARTICLES = [
  {
    category: 'Getting Started',
    icon: 'rocket_launch',
    color: 'text-primary bg-blue-50 dark:bg-blue-900/30',
    items: [
      { title: 'Creating your FlowForge account', time: '3 min read' },
      { title: 'Understanding the Dashboard overview', time: '5 min read' },
      { title: 'Submitting your first request', time: '4 min read' },
      { title: 'How approvals and notifications work', time: '6 min read' },
      { title: 'Navigating My Requests and filters', time: '3 min read' },
    ],
  },
  {
    category: 'User Guides',
    icon: 'menu_book',
    color: 'text-emerald-600 bg-green-50 dark:bg-green-900/30',
    items: [
      { title: 'Managing pending approvals as a manager', time: '7 min read' },
      { title: 'Reading Analytics and exporting CSV reports', time: '5 min read' },
      { title: 'Using search and filters on the Dashboard', time: '3 min read' },
      { title: 'Understanding request status lifecycle', time: '4 min read' },
      { title: 'Setting up your notification preferences', time: '4 min read' },
    ],
  },
  {
    category: 'Admin & Workflows',
    icon: 'settings_suggest',
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30',
    items: [
      { title: 'Creating a multi-stage approval workflow', time: '10 min read' },
      { title: 'Using condition blocks and branching logic', time: '8 min read' },
      { title: 'Configuring triggers: form, schedule, and status change', time: '6 min read' },
      { title: 'Setting approval timeouts and escalation rules', time: '5 min read' },
      { title: 'Publishing and versioning workflows', time: '4 min read' },
    ],
  },
  {
    category: 'Account & Billing',
    icon: 'payments',
    color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/30',
    items: [
      { title: 'Updating your profile and password', time: '2 min read' },
      { title: 'Managing team members and roles', time: '5 min read' },
      { title: 'Understanding your subscription plan', time: '4 min read' },
      { title: 'Requesting a plan upgrade or downgrade', time: '3 min read' },
      { title: 'Data retention and account deletion', time: '3 min read' },
    ],
  },
];

export default function HelpCenter() {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQS.filter(f =>
    !searchQuery ||
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = ARTICLES.map(cat => ({
    ...cat,
    items: cat.items.filter(a => !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase())),
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="flex-1 overflow-x-hidden flex flex-col">
      <main className="flex-1">

        {/* Hero Search */}
        <section className="relative py-16 md:py-24 overflow-hidden bg-primary">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4">
              How can we help you today?
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mb-10">
              Search our guides, FAQs, and documentation to get the most out of FlowForge.
            </p>
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-2 flex items-center gap-2">
              <div className="pl-4 text-slate-400 flex items-center justify-center">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="flex-1 border-none focus:ring-0 text-slate-900 dark:text-white bg-transparent text-lg placeholder:text-slate-400 outline-none"
                placeholder="Search guides, FAQs, or common issues..."
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 px-2">
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
              <button className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Articles by Category */}
        <section className="container mx-auto px-4 py-16 max-w-7xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-10">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Browse Articles'}
          </h2>
          {filteredArticles.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
              No articles found for that term.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map((cat, ci) => (
              <div key={ci} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 p-5 border-b border-slate-100 dark:border-slate-800">
                  <div className={`size-10 rounded-lg flex items-center justify-center ${cat.color}`}>
                    <span className="material-symbols-outlined">{cat.icon}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{cat.category}</h3>
                  <span className="ml-auto text-xs text-slate-400 font-medium">{cat.items.length} articles</span>
                </div>
                <ul className="divide-y divide-slate-50 dark:divide-slate-800">
                  {cat.items.map((article, ai) => (
                    <li key={ai}>
                      <a href="#" className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors mt-0.5 text-base">article</span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors leading-snug">{article.title}</span>
                        </div>
                        <span className="text-xs text-slate-400 shrink-0 ml-4">{article.time}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-slate-100 dark:bg-slate-900/50 py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-3 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-10">Quick answers to the most common FlowForge questions.</p>
            <div className="space-y-3">
              {filteredFaqs.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200 pr-4">{faq.q}</span>
                    <span className={`material-symbols-outlined text-slate-400 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
              {filteredFaqs.length === 0 && (
                <div className="text-center py-8 text-slate-400">No matching FAQs found.</div>
              )}
            </div>
          </div>
        </section>

        {/* Still Need Help CTA */}
        <section className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="bg-primary/5 dark:bg-slate-900 border border-primary/20 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Still need help?</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Our support team is ready to assist you with any workflow challenge.</p>
            </div>
            <div className="flex justify-center">
              <Link
                to="/contact"
                className="inline-flex flex-col items-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-slate-100 dark:border-slate-700 hover:border-primary/40 min-w-[180px]"
              >
                <span className="material-symbols-outlined text-primary mb-3 text-4xl">support_agent</span>
                <span className="font-bold text-base text-slate-900 dark:text-white">Contact Support</span>
                <span className="text-xs text-slate-500 mt-1">Response within 4 hours</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 mt-auto">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <span className="material-symbols-outlined font-bold text-2xl">account_tree</span>
                <span className="text-slate-900 dark:text-white font-black text-xl">FlowForge</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
                The enterprise-grade solution for complex business process automation. Scale your efficiency and transform your operations today.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Platform</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm">
                <li><Link className="hover:text-primary transition-colors" to="/dashboard">Dashboard</Link></li>
                <li><Link className="hover:text-primary transition-colors" to="/requests/my">My Requests</Link></li>
                <li><Link className="hover:text-primary transition-colors" to="/approvals">Approvals</Link></li>
                <li><Link className="hover:text-primary transition-colors" to="/admin/workflows">Workflows</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Legal</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm">
                <li><Link className="hover:text-primary transition-colors" to="/privacy">Privacy Policy</Link></li>
                <li><Link className="hover:text-primary transition-colors" to="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
            <p>© 2026 FlowForge Inc. All rights reserved.</p>
            <Link className="hover:text-primary transition-colors" to="/contact">Support Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
