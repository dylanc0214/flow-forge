import { useState } from 'react';

const STEP_ICONS = {
  trigger:      { icon: 'bolt',         bg: 'bg-violet-100 dark:bg-violet-900/30', fg: 'text-violet-600 dark:text-violet-400' },
  approval:     { icon: 'person_check',  bg: 'bg-primary/10',                      fg: 'text-primary' },
  notification: { icon: 'mail',          bg: 'bg-sky-100 dark:bg-sky-900/30',      fg: 'text-sky-600 dark:text-sky-400' },
  delay:        { icon: 'timer',         bg: 'bg-amber-100 dark:bg-amber-900/30',  fg: 'text-amber-600 dark:text-amber-400' },
  condition:    { icon: 'call_split',    bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30', fg: 'text-fuchsia-600 dark:text-fuchsia-400' },
};

const TABS = ['Builder', 'Triggers', 'Settings'];

const DEFAULT_TRIGGERS = [
  { id: 1, event: 'Form Submission',   desc: 'Fires when a new request form is submitted', active: true },
  { id: 2, event: 'Status Change',     desc: 'Fires when a request status changes',         active: false },
  { id: 3, event: 'Scheduled (Cron)',  desc: 'Fires on a repeating schedule',               active: false },
];

const DEFAULT_SETTINGS = {
  name: 'Purchase Approval Workflow',
  description: 'Sequence for multi-level spending authorization',
  autoArchive: true,
  sendSummary: true,
  timeoutHours: 48,
  priority: 'normal',
};

export default function WorkflowBuilder() {
  const [activeTab, setActiveTab] = useState('Builder');

  /* --- Steps state --- */
  const [steps, setSteps] = useState([
    { id: 1, type: 'trigger',   title: 'Workflow Trigger',  desc: 'Form Submission: New Purchase Request', pathA: '', pathB: '' },
    { id: 2, type: 'approval',  title: 'Manager Review',    desc: 'Assignee: Reporting Manager',           pathA: '', pathB: '' },
    { id: 3, type: 'condition', title: 'Total Amount > $5,000', desc: 'Split the request flow',            pathA: 'HR Approval', pathB: 'Skip to Finance' },
  ]);

  const [editing, setEditing] = useState(null); // step id being edited

  /* --- Triggers state --- */
  const [triggers, setTriggers] = useState(DEFAULT_TRIGGERS);

  /* --- Settings state --- */
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  /* --- Step helpers --- */
  const addStep = (type) => {
    const newId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1;
    const defaults = {
      trigger:      { title: 'New Trigger',       desc: 'Configure trigger event'        },
      approval:     { title: 'Approval Step',      desc: 'Assignee: Not configured'       },
      notification: { title: 'Email Notification', desc: 'Recipients: Not configured'     },
      delay:        { title: 'Wait / Delay',        desc: 'Duration: 24 hours'             },
      condition:    { title: 'Conditional Logic',   desc: 'Configure condition expression' },
    };
    const d = defaults[type] || { title: 'New Step', desc: 'Configure this step' };
    setSteps(prev => [...prev, { id: newId, type, ...d, pathA: 'Path A', pathB: 'Path B' }]);
    setEditing(newId);
  };

  const deleteStep = (id) => {
    setSteps(prev => prev.filter(s => s.id !== id));
    if (editing === id) setEditing(null);
  };

  const moveStep = (id, dir) => {
    setSteps(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  };

  const updateStep = (id, field, value) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const editingStep = steps.find(s => s.id === editing) || null;

  /* --- Trigger helpers --- */
  const toggleTrigger = (id) => setTriggers(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));

  /* --- Settings helpers --- */
  const updateSetting = (field, value) => setSettings(prev => ({ ...prev, [field]: value }));

  /* ----------------------------------------------------------------
     Render sections
  ---------------------------------------------------------------- */
  const renderBuilder = () => (
    <div className="flex flex-1 overflow-hidden">
      {/* Canvas */}
      <div className="p-8 flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto flex flex-col gap-0">
          {steps.map((step, index) => {
            const style = STEP_ICONS[step.type] || STEP_ICONS.approval;
            const isCondition = step.type === 'condition';
            const isFirst = index === 0;
            const isLast  = index === steps.length - 1;

            return (
              <div key={step.id} className="relative flex flex-col items-center">
                {/* Connector line above */}
                {index > 0 && <div className="w-px h-8 bg-slate-300 dark:bg-slate-700"></div>}

                {isCondition ? (
                  /* --- CONDITION BLOCK --- */
                  <div className="w-full flex flex-col items-center">
                    <div className="group relative w-full bg-white dark:bg-slate-900 rounded-xl border-2 border-fuchsia-200 dark:border-fuchsia-900/50 shadow-sm hover:border-fuchsia-400 transition-all">
                      <div className="flex items-center gap-3 p-4">
                        <div className={`flex-shrink-0 size-10 rounded-lg flex items-center justify-center ${style.bg}`}>
                          <span className={`material-symbols-outlined text-xl ${style.fg}`}>{style.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold uppercase tracking-widest text-fuchsia-600 dark:text-fuchsia-400 mb-0.5">Condition</p>
                          <h3 className="font-bold text-slate-900 dark:text-white truncate">{step.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">{step.desc}</p>
                        </div>
                        {/* controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => setEditing(editing === step.id ? null : step.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors" title="Edit">
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button disabled={isFirst} onClick={() => moveStep(step.id, -1)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30" title="Move Up">
                            <span className="material-symbols-outlined text-base">arrow_upward</span>
                          </button>
                          <button disabled={isLast} onClick={() => moveStep(step.id, 1)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30" title="Move Down">
                            <span className="material-symbols-outlined text-base">arrow_downward</span>
                          </button>
                          <button onClick={() => deleteStep(step.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </div>
                      {/* two paths */}
                      <div className="grid grid-cols-2 gap-3 p-4 pt-0">
                        {/* Path A */}
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                          <p className="text-xs font-bold text-primary mb-1">✓ Path A — True</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{step.pathA || 'Not configured'}</p>
                        </div>
                        {/* Path B */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                          <p className="text-xs font-bold text-slate-500 mb-1">✗ Path B — False</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{step.pathB || 'Not configured'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* --- REGULAR BLOCK --- */
                  <div className={`group relative w-full flex items-start gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-all ${editing === step.id ? 'border-primary ring-2 ring-primary/20' : ''}`}>
                    <div className={`flex-shrink-0 size-10 rounded-lg flex items-center justify-center ${style.bg}`}>
                      <span className={`material-symbols-outlined text-xl ${style.fg}`}>{style.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5 capitalize">{step.type}</p>
                      <h3 className="font-bold text-slate-900 dark:text-white truncate">{step.title}</h3>
                      <p className="text-sm text-slate-500 mt-0.5 truncate">{step.desc}</p>
                    </div>
                    {/* controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => setEditing(editing === step.id ? null : step.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button disabled={isFirst} onClick={() => moveStep(step.id, -1)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30" title="Move Up">
                        <span className="material-symbols-outlined text-base">arrow_upward</span>
                      </button>
                      <button disabled={isLast} onClick={() => moveStep(step.id, 1)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30" title="Move Down">
                        <span className="material-symbols-outlined text-base">arrow_downward</span>
                      </button>
                      <button onClick={() => deleteStep(step.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add step row */}
          <div className="flex flex-col items-center mt-4">
            <div className="w-px h-8 bg-slate-300 dark:bg-slate-700"></div>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { type: 'approval',     label: 'Approval',        icon: 'person_check' },
                { type: 'notification', label: 'Notification',    icon: 'mail' },
                { type: 'condition',    label: 'Condition',       icon: 'call_split' },
                { type: 'delay',        label: 'Delay',           icon: 'timer' },
              ].map(b => (
                <button key={b.type} onClick={() => addStep(b.type)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">{b.icon}</span>
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — Step Config */}
      <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto shrink-0 hidden xl:flex xl:flex-col">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {editingStep ? 'Edit Block' : 'Step Library'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {editingStep ? `Editing: ${editingStep.type}` : 'Click a block to edit, or add new ones'}
          </p>
        </div>

        {editingStep ? (
          /* --- Editing panel --- */
          <div className="p-5 flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Title</label>
              <input
                value={editingStep.title}
                onChange={e => updateStep(editingStep.id, 'title', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Description</label>
              <textarea
                rows={3}
                value={editingStep.desc}
                onChange={e => updateStep(editingStep.id, 'desc', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            {editingStep.type === 'condition' && (
              <>
                <div>
                  <label className="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">Path A (True)</label>
                  <input
                    value={editingStep.pathA}
                    onChange={e => updateStep(editingStep.id, 'pathA', e.target.value)}
                    className="w-full rounded-lg border border-primary/30 bg-primary/5 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. HR Approval"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Path B (False)</label>
                  <input
                    value={editingStep.pathB}
                    onChange={e => updateStep(editingStep.id, 'pathB', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Skip to Finance"
                  />
                </div>
              </>
            )}
            {editingStep.type === 'delay' && (
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Duration (hours)</label>
                <input type="number" min={1}
                  defaultValue={24}
                  onChange={e => updateStep(editingStep.id, 'desc', `Duration: ${e.target.value} hours`)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
            {editingStep.type === 'approval' && (
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Assignee</label>
                <select
                  onChange={e => updateStep(editingStep.id, 'desc', `Assignee: ${e.target.value}`)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option>Reporting Manager</option>
                  <option>HR Department</option>
                  <option>Finance Team</option>
                  <option>CEO</option>
                  <option>Custom Role</option>
                </select>
              </div>
            )}
            <button onClick={() => setEditing(null)}
              className="mt-2 w-full bg-primary text-white text-sm font-bold py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Done Editing
            </button>
          </div>
        ) : (
          /* --- Library --- */
          <div className="p-5 flex flex-col gap-6">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Core Actions</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'approval',     label: 'Approval',     icon: 'person_check' },
                  { type: 'notification', label: 'Notification', icon: 'mail' },
                  { type: 'condition',    label: 'Condition',    icon: 'call_split' },
                  { type: 'delay',        label: 'Delay',        icon: 'timer' },
                ].map(b => {
                  const s = STEP_ICONS[b.type];
                  return (
                    <button key={b.type} onClick={() => addStep(b.type)}
                      className="flex flex-col items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:ring-2 ring-primary transition-all">
                      <span className={`material-symbols-outlined mb-1 ${s.fg}`}>{b.icon}</span>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{b.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Integrations</span>
              <div className="flex flex-col gap-2">
                {[
                  { icon: 'table_rows', label: 'Google Sheets', sub: 'Update row data',     bg: 'bg-green-500/10', fg: 'text-green-500' },
                  { icon: 'forum',      label: 'Slack',         sub: 'Post channel message', bg: 'bg-blue-500/10',  fg: 'text-blue-500' },
                  { icon: 'payments',   label: 'Stripe',        sub: 'Capture payment',      bg: 'bg-orange-500/10',fg: 'text-orange-500'},
                ].map(g => (
                  <div key={g.label} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary cursor-pointer transition-all">
                    <div className={`size-8 ${g.bg} ${g.fg} rounded flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-xl">{g.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{g.label}</p>
                      <p className="text-[10px] text-slate-500">{g.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );

  const renderTriggers = () => (
    <div className="p-8 overflow-y-auto flex-1">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Workflow Triggers</h2>
          <p className="text-sm text-slate-500">Define what events start this workflow. Multiple triggers can be active at once.</p>
        </div>
        {triggers.map(t => (
          <div key={t.id} className={`flex items-start gap-4 p-5 rounded-xl border shadow-sm transition-all ${t.active ? 'bg-primary/5 border-primary/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
            <div className={`mt-0.5 size-10 rounded-lg flex items-center justify-center ${t.active ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 dark:text-white">{t.event}</p>
              <p className="text-sm text-slate-500 mt-0.5">{t.desc}</p>
            </div>
            <button onClick={() => toggleTrigger(t.id)}
              className={`relative inline-flex shrink-0 h-6 w-11 items-center rounded-full transition-colors ${t.active ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
              <span className={`size-5 bg-white rounded-full shadow transition-transform ${t.active ? 'translate-x-5' : 'translate-x-1'}`}></span>
            </button>
          </div>
        ))}
        <div className="pt-2">
          <button onClick={() => setTriggers(prev => [...prev, { id: Date.now(), event: 'Custom Event', desc: 'Click to configure this trigger', active: false }])}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:border-primary hover:text-primary transition-all text-sm font-bold w-full justify-center">
            <span className="material-symbols-outlined">add</span>
            Add Custom Trigger
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="p-8 overflow-y-auto flex-1">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Workflow Settings</h2>
          <p className="text-sm text-slate-500">Configure the behaviour and metadata for this workflow.</p>
        </div>

        {/* Basic Info */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Basic Info</h3>
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Workflow Name</label>
            <input
              value={settings.name}
              onChange={e => updateSetting('name', e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Description</label>
            <textarea
              rows={3}
              value={settings.description}
              onChange={e => updateSetting('description', e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Priority</label>
            <select
              value={settings.priority}
              onChange={e => updateSetting('priority', e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Behaviour */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Behaviour</h3>
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Approval Timeout (hours)</label>
            <input
              type="number" min={1}
              value={settings.timeoutHours}
              onChange={e => updateSetting('timeoutHours', e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-xs text-slate-400 mt-1">Auto-escalate after this many hours with no action.</p>
          </div>
          {[
            { key: 'autoArchive', label: 'Auto-archive completed requests', sub: 'Moves approved/rejected requests to the archive after 7 days' },
            { key: 'sendSummary', label: 'Send daily summary emails',       sub: 'Email all assignees a summary of pending tasks each morning' },
          ].map(o => (
            <div key={o.key} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{o.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{o.sub}</p>
              </div>
              <button onClick={() => updateSetting(o.key, !settings[o.key])}
                className={`relative inline-flex shrink-0 h-6 w-11 items-center rounded-full transition-colors mt-0.5 ${settings[o.key] ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
                <span className={`size-5 bg-white rounded-full shadow transition-transform ${settings[o.key] ? 'translate-x-5' : 'translate-x-1'}`}></span>
              </button>
            </div>
          ))}
        </div>

        <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          Save Settings
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Header */}
      <div className="flex flex-col px-8 pt-6 gap-2 shrink-0">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-primary transition-colors" href="#">Workflows</a>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">New Business Process Automation</span>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-4 py-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">{settings.name}</h1>
            <p className="text-slate-500 text-base">{settings.description}</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Save Draft
            </button>
            <button className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-100 transition-all">
              Publish Workflow
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mt-2 gap-8">
          {TABS.map(tab => {
            const tabIcons = { Builder: 'edit_note', Triggers: 'bolt', Settings: 'settings' };
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 border-b-2 pb-3 font-bold text-sm transition-colors ${active ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <span className="material-symbols-outlined text-xl">{tabIcons[tab]}</span>
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'Builder'  && renderBuilder()}
        {activeTab === 'Triggers' && renderTriggers()}
        {activeTab === 'Settings' && renderSettings()}
      </div>
    </div>
  );
}
