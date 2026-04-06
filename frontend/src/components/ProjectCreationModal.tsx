import React, { useState } from 'react';
import { X, Layout, Sparkles, AlertCircle } from 'lucide-react';
import { useProjectStore } from '../hooks/useProjectStore';
import { useAuthStore } from '../hooks/useAuthStore';
import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectCreationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [projectName, setProjectName] = useState('');
  const { createProject, isLoading, error, clearError } = useProjectStore();
  const { userId } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !userId) return;

    try {
      await createProject(projectName.trim(), userId);
      setProjectName('');
      onClose();
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.2)] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
               <Layout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black tracking-tighter text-slate-800 uppercase italic">Initiate.Project</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Define a new workspace context</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-4">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Project Name</span>
              <div className="mt-2 relative">
                <input
                  autoFocus
                  value={projectName}
                  onChange={(e) => {
                    if (error) clearError();
                    setProjectName(e.target.value);
                  }}
                  className="w-full rounded-2xl bg-slate-50 px-6 py-4 outline-none border border-transparent focus:border-indigo-500/20 focus:bg-white focus:shadow-inner transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  placeholder="e.g., Quantum Architecture Phase II"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
            </label>

            {error && (
              <div className="flex items-center gap-2 text-rose-500 text-xs font-bold bg-rose-50 p-4 rounded-2xl border border-rose-100 animate-fade-in-up">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                 By initiating a project, you become the <span className="text-indigo-600">Architect</span>. You can then add collaborators by searching for their usernames.
               </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel Initiation
            </button>
            <button
              type="submit"
              disabled={isLoading || !projectName.trim()}
              className="flex-1 bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 text-xs uppercase tracking-widest"
            >
              {isLoading ? 'Processing...' : 'Deploy Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
