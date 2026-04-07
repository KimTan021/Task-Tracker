import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import type { Project } from '../hooks/useProjectStore';

interface Props {
  isOpen: boolean;
  project: Project | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteProjectModal: React.FC<Props> = ({ isOpen, project, isDeleting, onClose, onConfirm }) => {
  if (!isOpen || !project) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-[var(--color-surface-container-lowest)] shadow-[0_40px_100px_rgba(0,0,0,0.2)] animate-scale-in">
        <div className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black uppercase italic tracking-tighter text-slate-800">Delete.Project</h2>
              <p className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-slate-400">Permanent destructive action</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface-container-low)] text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-8">
          <div className="space-y-4">
            <div className="rounded-[2rem] bg-rose-50/70 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-rose-500">Project</p>
              <p className="mt-3 text-2xl font-display font-black uppercase italic tracking-tight text-slate-900">{project.projectName}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {project.projectDescription?.trim() || 'No project description was provided.'}
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--color-surface-container-low)] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Impact</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Deleting this project removes its tasks, invitations, and collaborator access. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Keep Project
            </button>
            <button
              type="submit"
              disabled={isDeleting}
              className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-rose-500 py-4 text-xs font-black uppercase tracking-widest text-white shadow-[0_20px_40px_rgba(244,63,94,0.2)] transition-all hover:-translate-y-1 hover:bg-rose-600 active:translate-y-0 disabled:cursor-wait disabled:opacity-70 disabled:translate-y-0"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? 'Deleting...' : 'Delete Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
