import React from 'react';
import { ArrowUpCircle, Shield, X } from 'lucide-react';

interface Member {
  userId: number;
  userName: string;
  userEmail: string;
  role: string;
}

interface Props {
  isOpen: boolean;
  member: Member | null;
  isPromoting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const PromoteCollaboratorModal: React.FC<Props> = ({ isOpen, member, isPromoting, onClose, onConfirm }) => {
  if (!isOpen || !member) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-[var(--color-surface-container-lowest)] shadow-[0_40px_100px_rgba(0,0,0,0.2)] animate-scale-in">
        <div className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black uppercase italic tracking-tighter text-slate-800">Promote.Member</h2>
              <p className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-slate-400">Grant co-architect access</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPromoting}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface-container-low)] text-slate-400 transition-all hover:bg-amber-50 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-8">
          <div className="space-y-4">
            <div className="rounded-[2rem] bg-amber-50/70 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-600">Collaborator</p>
              <p className="mt-3 text-2xl font-display font-black uppercase italic tracking-tight text-slate-900">{member.userName}</p>
              <p className="mt-2 text-sm font-semibold text-slate-500">{member.userEmail}</p>
            </div>

            <div className="rounded-2xl bg-[var(--color-surface-container-low)] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Access Change</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Promoting this collaborator to co-architect lets them invite new collaborators to the project. They will not gain project deletion or promotion rights.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPromoting}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPromoting}
              className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-amber-500 py-4 text-xs font-black uppercase tracking-widest text-white shadow-[0_20px_40px_rgba(245,158,11,0.2)] transition-all hover:-translate-y-1 hover:bg-amber-600 active:translate-y-0 disabled:cursor-wait disabled:opacity-70 disabled:translate-y-0"
            >
              <ArrowUpCircle className="h-4 w-4" />
              {isPromoting ? 'Promoting...' : 'Promote To Co-Architect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
