import { Link } from 'react-router-dom';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using FlowForge ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Service. These terms apply to all visitors, users, and others who access the Service.`,
  },
  {
    title: '2. Description of Service',
    content: `FlowForge is a business workflow automation and approval management platform. The Service allows organisations to create, manage, and track business process requests, approvals, and analytics. We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) at any time with reasonable notice.`,
  },
  {
    title: '3. User Accounts',
    content: `You must provide accurate, complete, and current information when creating an account. You are responsible for safeguarding your account password and for any actions taken under your account. You agree to notify us immediately of any unauthorised access to your account. FlowForge cannot and will not be liable for any loss or damage arising from your failure to comply with the above requirements.`,
  },
  {
    title: '4. Acceptable Use',
    content: `You agree not to use the Service to: (a) violate any applicable law or regulation; (b) transmit any harmful, offensive, or misleading content; (c) attempt to gain unauthorised access to any part of the Service; (d) interfere with or disrupt the integrity or performance of the Service; (e) collect or harvest any personally identifiable information without consent. Violations may result in immediate account suspension or termination.`,
  },
  {
    title: '5. Intellectual Property',
    content: `The Service and its original content, features, and functionality are and will remain the exclusive property of FlowForge Inc. and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent. You retain ownership of any content you submit through the Service, but grant FlowForge a license to use it for service operation purposes.`,
  },
  {
    title: '6. Privacy',
    content: `Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices regarding your personal data.`,
  },
  {
    title: '7. Limitation of Liability',
    content: `To the maximum extent permitted by applicable law, FlowForge Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Service.`,
  },
  {
    title: '8. Governing Law',
    content: `These Terms shall be governed and construed in accordance with applicable law, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.`,
  },
  {
    title: '9. Changes to Terms',
    content: `We reserve the right to modify these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use the Service after revisions become effective, you agree to be bound by the revised terms.`,
  },
  {
    title: '10. Contact Us',
    content: `If you have any questions about these Terms, please contact us at legal@flowforge.com or through our Help Center.`,
  },
];

export default function TermsOfService() {
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
          <Link to="/privacy" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Privacy Policy</Link>
          <Link to="/" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">Back to Sign In</Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-primary/5 border-b border-primary/10 py-14 px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto mb-4 size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">gavel</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-3">Terms of Service</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Last updated: <span className="font-semibold text-slate-700 dark:text-slate-300">March 18, 2026</span>
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Please read these terms carefully before using FlowForge.
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-12 px-6">
        <div className="mx-auto max-w-3xl space-y-8">
          {sections.map((section, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{section.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}

          {/* Footer CTA */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-7 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Have questions about our Terms? We're happy to help.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="mailto:legal@flowforge.com" className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-base">mail</span>
                Contact Legal
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
          <Link className="hover:text-primary" to="/privacy">Privacy Policy</Link>
        </p>
      </footer>
    </div>
  );
}
