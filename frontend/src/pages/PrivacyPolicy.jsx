import { Link } from 'react-router-dom';

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us when you create an account, submit requests, or use the Service. This includes: (a) Account information such as your name, email address, and password; (b) Usage data such as requests submitted, workflows triggered, and approval actions taken; (c) Technical data such as IP addresses, browser type, operating system, and access times collected automatically when you use the Service.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to: (a) Provide, maintain, and improve the Service; (b) Process and complete transactions and send you related information; (c) Send notifications and updates about the Service; (d) Respond to your comments, questions, and provide customer support; (e) Monitor and analyse trends, usage, and activities in connection with the Service; (f) Detect and prevent fraudulent transactions and other illegal activities; (g) Comply with legal obligations.`,
  },
  {
    title: '3. Information Sharing',
    content: `We will not sell, trade, or rent your personal information to third parties. We may share your personal information with: (a) Service providers who perform services on our behalf; (b) Professional advisors such as lawyers and accountants; (c) Law enforcement when required by applicable law; (d) Acquiring entities in connection with a merger or acquisition, where prior notice will be given. All third-party service providers are required to maintain confidentiality and security of your information.`,
  },
  {
    title: '4. Data Security',
    content: `We implement industry-standard security measures to protect your personal information, including encryption in transit (TLS) and at rest, hashed passwords, and access controls. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.`,
  },
  {
    title: '5. Data Retention',
    content: `We retain your personal information for as long as necessary to fulfil the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will delete or anonymise it. You may request deletion of your account data at any time by contacting us at privacy@flowforge.com.`,
  },
  {
    title: '6. Cookies and Tracking',
    content: `We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with a small amount of data. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some portions of our Service may not function properly. We use session cookies for authentication and persistent cookies for preferences.`,
  },
  {
    title: '7. Your Rights',
    content: `Depending on your location, you may have certain rights regarding your personal information, including: (a) The right to access the personal information we hold about you; (b) The right to correct inaccurate or incomplete information; (c) The right to request deletion of your personal information; (d) The right to restrict or object to processing; (e) The right to data portability. To exercise any of these rights, please contact us at privacy@flowforge.com.`,
  },
  {
    title: '8. Children\'s Privacy',
    content: `The Service is not directed to individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that a child under 16 has provided us with personal information, we will take steps to delete such information. If you become aware that a child has provided us with personal information, please contact us immediately.`,
  },
  {
    title: '9. Links to Third-Party Sites',
    content: `The Service may contain links to third-party websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites. We strongly advise you to review the privacy policy of every site you visit. We are not responsible for any information that you submit to third-party websites.`,
  },
  {
    title: '10. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We will also notify you via email or a prominent notice on the Service prior to any material changes becoming effective. You are advised to review this Privacy Policy periodically.`,
  },
  {
    title: '11. Contact Us',
    content: `If you have any questions about this Privacy Policy or our data practices, please contact our Data Protection Officer at: privacy@flowforge.com. You may also write to us at: FlowForge Inc., Privacy Team, legal@flowforge.com.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 md:px-10 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-8 flex items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined">account_tree</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">FlowForge</h2>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/terms" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Terms of Service</Link>
          <Link to="/" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">Back to Sign In</Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/50 py-14 px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto mb-4 size-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-3xl">shield</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-3">Privacy Policy</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Last updated: <span className="font-semibold text-slate-700 dark:text-slate-300">March 18, 2026</span>
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            We are committed to protecting your personal information and your right to privacy.
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-12 px-6">
        <div className="mx-auto max-w-3xl space-y-8">

          {/* Summary badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: 'lock', label: 'Data Encrypted', desc: 'All data in transit and at rest' },
              { icon: 'visibility_off', label: 'Never Sold', desc: 'Your data is never sold to third parties' },
              { icon: 'delete', label: 'Right to Delete', desc: 'Request account deletion anytime' },
            ].map((b, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-2">
                <div className="size-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-xl">{b.icon}</span>
                </div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{b.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{b.desc}</p>
              </div>
            ))}
          </div>

          {sections.map((section, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{section.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}

          {/* Footer CTA */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-7 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Questions about your data or privacy rights? Contact our Privacy team.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="mailto:privacy@flowforge.com" className="inline-flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors">
                <span className="material-symbols-outlined text-base">shield</span>
                Contact Privacy Team
              </a>
              <Link to="/help" className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-base">help</span>
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <p className="text-slate-400 text-xs">
          © 2026 FlowForge Inc. All rights reserved.
          <span className="mx-2">|</span>
          <Link className="hover:text-primary" to="/terms">Terms of Service</Link>
        </p>
      </footer>
    </div>
  );
}
