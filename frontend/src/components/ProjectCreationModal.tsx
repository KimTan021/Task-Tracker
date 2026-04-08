import React, { useState } from 'react';
import { X, Layout, Sparkles, AlertCircle } from 'lucide-react';
import { useProjectStore } from '../hooks/useProjectStore';
import { useAuthStore } from '../hooks/useAuthStore';
import { useEffect } from 'react';
import { hasErrors, validateProjectForm } from '../utils/validation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectCreationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    projectName: '',
    projectDescription: '',
  });
  const { createProject, isLoading, error, clearError } = useProjectStore();
  const { userId } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      clearError();
      setFieldErrors({ projectName: '', projectDescription: '' });
    }
  }, [isOpen, clearError]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateProjectForm({ projectName, projectDescription });
    setFieldErrors(nextErrors);
    if (hasErrors(nextErrors) || !userId) return;

    try {
      await createProject(projectName.trim(), projectDescription.trim(), userId);
      setProjectName('');
      setProjectDescription('');
      onClose();
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-[var(--color-surface-container-lowest)] shadow-[0_40px_100px_rgba(0,0,0,0.2)] animate-scale-in">
        <div className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(53,37,205,0.08)] flex items-center justify-center text-indigo-600">
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
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-surface-container-low)] text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
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
                    if (fieldErrors.projectName) {
                      setFieldErrors((current) => ({ ...current, projectName: '' }));
                    }
                    setProjectName(e.target.value);
                  }}
                  className={`w-full rounded-2xl bg-[var(--color-surface-container-low)] px-6 py-4 outline-none border transition-all font-bold text-slate-700 placeholder:text-slate-300 focus:bg-white focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/10 ${
                    fieldErrors.projectName ? 'border-rose-300 bg-rose-50 focus-visible:ring-rose-100' : 'border-transparent'
                  }`}
                  placeholder="e.g., Quantum Architecture Phase II"
                  required
                  maxLength={120}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              {fieldErrors.projectName && <p className="mt-2 text-xs font-bold text-rose-500">{fieldErrors.projectName}</p>}
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Project Description</span>
              <textarea
                value={projectDescription}
                onChange={(e) => {
                  if (error) clearError();
                  if (fieldErrors.projectDescription) {
                    setFieldErrors((current) => ({ ...current, projectDescription: '' }));
                  }
                  setProjectDescription(e.target.value);
                }}
                className={`mt-2 min-h-[110px] w-full rounded-2xl bg-[var(--color-surface-container-low)] px-6 py-4 outline-none border transition-all font-medium text-slate-700 placeholder:text-slate-300 resize-none focus:bg-white focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/10 ${
                  fieldErrors.projectDescription ? 'border-rose-300 bg-rose-50 focus-visible:ring-rose-100' : 'border-transparent'
                }`}
                placeholder="Summarize the project scope, goals, or what collaborators should expect."
                maxLength={1000}
              />
              {fieldErrors.projectDescription && <p className="mt-2 text-xs font-bold text-rose-500">{fieldErrors.projectDescription}</p>}
            </label>

            {error && (
              <div className="flex items-center gap-2 text-rose-500 text-xs font-bold bg-rose-50 p-4 rounded-2xl border border-rose-100 animate-fade-in-up">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-4">
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
              className="flex-1 bg-kinetic text-white font-black py-4 rounded-2xl shadow-[0_20px_40px_rgba(53,37,205,0.18)] hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 text-xs uppercase tracking-widest"
            >
              {isLoading ? 'Processing...' : 'Deploy Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
