import React, { useEffect, useState } from 'react';
import { X, User as UserIcon, Check } from 'lucide-react';
import type { Priority, Status, Task, TaskInput } from '../hooks/useTaskStore';
import { useProjectStore } from '../hooks/useProjectStore';

type Props = {
  isOpen: boolean;
  mode: 'create' | 'edit';
  task?: Task | null;
  initialStatus?: Status;
  onClose: () => void;
  onSubmit: (input: TaskInput) => Promise<void>;
};

const toLocalDateTimeValue = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

export const TaskEditorModal: React.FC<Props> = ({ isOpen, mode, task, initialStatus = 'todo', onClose, onSubmit }) => {
  const { currentProject, getMembers } = useProjectStore();
  const [members, setMembers] = useState<any[]>([]);
  const [showAssigneePicker, setShowAssigneePicker] = useState(false);

  const [form, setForm] = useState<TaskInput>({
    title: '',
    description: '',
    status: initialStatus,
    priority: 'Medium',
    tags: [],
    startDate: '',
    dueDate: '',
    assigneeName: '',
    archived: false,
  });

  useEffect(() => {
    if (isOpen && currentProject) {
      void loadMembers();
    }
  }, [isOpen, currentProject]);

  const loadMembers = async () => {
    if (!currentProject) return;
    const data = await getMembers(currentProject.projectId);
    setMembers(data);
  };

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || initialStatus,
      priority: task?.priority || 'Medium',
      tags: task?.tags || [],
      startDate: toLocalDateTimeValue(task?.startDate),
      dueDate: toLocalDateTimeValue(task?.dueDate),
      assigneeName: task?.assigneeName || '',
      archived: task?.archived || false,
    });
  }, [initialStatus, isOpen, task]);

  if (!isOpen) return null;

  const setField = <K extends keyof TaskInput>(key: K, value: TaskInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title?.trim()) return;
    await onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description?.trim() || '',
      assigneeName: form.assigneeName?.trim() || '',
      tags: form.tags || [],
      startDate: form.startDate || undefined,
      dueDate: form.dueDate || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md p-4 md:p-8 flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-2xl bg-[var(--color-surface-container-lowest)] rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] animate-scale-in">
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-8 py-6 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-display font-black tracking-tighter text-[var(--color-on-surface)] uppercase italic">
                {mode === 'create' ? 'Assemble.Task' : 'Refine.Task'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="max-w-[220px] truncate text-[10px] font-black text-indigo-600 uppercase tracking-widest">{currentProject?.projectName}</span>
               <span className="w-1 h-1 rounded-full bg-slate-300"></span>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status: {form.status?.replace('_', ' ') || 'TODO'}</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--color-surface-container-low)] text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <label className="space-y-3 md:col-span-2">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Identity / Title</span>
                <input 
                    value={form.title} 
                    onChange={(e) => setField('title', e.target.value)} 
                    className="w-full rounded-2xl bg-[var(--color-surface-container-low)] px-6 py-4 outline-none border border-transparent focus:bg-white focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/10 transition-all font-bold text-slate-700" 
                    placeholder="e.g., Structural Facade Optimization" 
                    required
                />
              </label>

              <label className="space-y-3 md:col-span-2">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Context / Description</span>
                <textarea 
                    value={form.description} 
                    onChange={(e) => setField('description', e.target.value)} 
                    className="w-full min-h-[120px] rounded-2xl bg-[var(--color-surface-container-low)] px-6 py-4 outline-none border border-transparent focus:bg-white focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/10 transition-all font-medium text-slate-600 resize-none leading-relaxed" 
                    placeholder="Outline the parameters, dependencies, and intended output..." 
                />
              </label>

              <label className="space-y-3">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">State / Progress</span>
                <div className="relative group">
                    <select 
                        value={form.status} 
                        onChange={(e) => setField('status', e.target.value as Status)} 
                        className="w-full appearance-none rounded-2xl bg-[var(--color-surface-container-low)] px-6 py-4 outline-none border border-transparent focus:bg-white focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/10 transition-all font-bold text-slate-700 cursor-pointer"
                    >
                        {['todo', 'in_progress', 'review', 'completed'].map((status) => (
                        <option key={status} value={status}>{status.replace('_', ' ').toUpperCase()}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20">
                        <X className="w-4 h-4 rotate-45" />
                    </div>
                </div>
              </label>

              <label className="space-y-3">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Intensity / Priority</span>
                <div className="relative group">
                    <select 
                        value={form.priority} 
                        onChange={(e) => setField('priority', e.target.value as Priority)} 
                        className="w-full appearance-none rounded-2xl bg-[var(--color-surface-container-low)] px-6 py-4 outline-none border border-transparent focus:bg-white focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/10 transition-all font-bold text-slate-700 cursor-pointer"
                    >
                        {['High', 'Medium', 'Low'].map((priority) => (
                        <option key={priority} value={priority}>{priority.toUpperCase()}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20">
                        <X className="w-4 h-4 rotate-45" />
                    </div>
                </div>
              </label>

              <div className="space-y-3 relative">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Collaborator / Assignee</span>
                <button
                  type="button"
                  onClick={() => setShowAssigneePicker(!showAssigneePicker)}
                  className="w-full flex items-center justify-between rounded-2xl bg-[var(--color-surface-container-low)] px-6 py-4 border border-transparent hover:bg-white focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/10 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <UserIcon className="w-3 h-3" />
                    </div>
                    <span className={`font-bold text-[13px] ${form.assigneeName ? 'text-slate-700' : 'text-slate-300'}`}>
                      {form.assigneeName || 'Select Operative'}
                    </span>
                  </div>
                  <X className={`w-4 h-4 text-slate-300 transition-transform ${showAssigneePicker ? 'rotate-180' : 'rotate-45'}`} />
                </button>

                {showAssigneePicker && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowAssigneePicker(false)} />
                    <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-2xl shadow-xl overflow-hidden z-20 animate-scale-in">
                      <div className="p-2 space-y-1">
                        <button
                          type="button"
                          onClick={() => { setField('assigneeName', ''); setShowAssigneePicker(false); }}
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-[11px] font-black uppercase tracking-widest text-slate-400"
                        >
                          Unassign
                        </button>
                        {members.map(member => (
                          <button
                            key={member.userId}
                            type="button"
                            onClick={() => { setField('assigneeName', member.userName); setShowAssigneePicker(false); }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                              form.assigneeName === member.userName ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img src={`https://i.pravatar.cc/150?u=${member.userName}`} className="w-6 h-6 rounded-lg object-cover" alt="" />
                              <span className="text-[11px] font-black uppercase tracking-widest">{member.userName}</span>
                            </div>
                            {form.assigneeName === member.userName && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <label className="space-y-3">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Tokens / Tags</span>
                <input 
                    value={(form.tags || []).join(', ')} 
                    onChange={(e) => setField('tags', e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))} 
                    className="w-full rounded-2xl bg-[var(--color-surface-container-low)] px-6 py-4 outline-none border border-transparent focus:bg-white focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/10 transition-all font-bold text-slate-700" 
                    placeholder="tag1, tag2..." 
                />
              </label>

              <label className="space-y-3">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Initiation / Start</span>
                <input 
                    type="datetime-local" 
                    value={form.startDate || ''} 
                    onChange={(e) => setField('startDate', e.target.value)} 
                    className="w-full rounded-2xl bg-[var(--color-surface-container-low)] px-6 py-4 outline-none border border-transparent focus:bg-white focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/10 transition-all font-bold text-slate-700" 
                />
              </label>

              <label className="space-y-3">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Termination / Due</span>
                <input 
                    type="datetime-local" 
                    value={form.dueDate || ''} 
                    onChange={(e) => setField('dueDate', e.target.value)} 
                    className="w-full rounded-2xl bg-[var(--color-surface-container-low)] px-6 py-4 outline-none border border-transparent focus:bg-white focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/10 transition-all font-bold text-slate-700" 
                />
              </label>
              
              <div className="md:col-span-2 pt-4">
                <label className="flex items-center gap-4 cursor-pointer group w-fit">
                    <div className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.archived ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]' : 'bg-slate-200'}`}>
                        <input 
                            type="checkbox" 
                            checked={Boolean(form.archived)} 
                            onChange={(e) => setField('archived', e.target.checked)} 
                            className="sr-only absolute inset-0 opacity-0 cursor-pointer z-10" 
                        />
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${form.archived ? 'left-7' : 'left-1'}`}></div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[var(--color-on-surface)] transition-colors">Archive Sequence</span>
                </label>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="px-8 py-6 bg-[var(--color-surface-container-low)]/85 backdrop-blur-md flex items-center justify-between flex-shrink-0">
            <button 
                type="button" 
                onClick={onClose}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors"
            >
                Discard Changes
            </button>
            <div className="flex items-center gap-4">
              <button 
                type="submit" 
                className="bg-[var(--color-primary)] text-white font-black py-4 px-10 rounded-2xl shadow-xl hover:shadow-[0_20px_40px_rgba(53,37,205,0.2)] hover:-translate-y-1 transition-all active:translate-y-0 active:scale-95 text-xs uppercase tracking-widest"
              >
                {mode === 'create' ? 'Finalize Task' : 'Commit Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
